const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const PromiseA = require('bluebird');
const utils = require('./utils');

const CUPSDRV = '.cupsdrv.json';

function isValidDriverDir(dir) {
  return fs.existsSync(path.join(dir, 'models.txt')) && fs.existsSync(path.join(dir, 'install.sh'));
}

function isCompatiblesFile(file) {
  return _.endsWith(file, 'compatibles.yml');
}

class Builder {

  static build(pkg, options) {
    return Builder.create(pkg, options).build();
  }

  static create(pkg, options) {
    return new Builder(pkg, options);
  }

  constructor(pkg, options) {
    this.pkg = pkg;
    if (_.isString(options)) {
      options = {cwd: options};
    }
    options = options || {};
    this.cwd = options.cwd || process.cwd();
    this.options = options;
  }

  _fetch(options) {
    options = Object.assign({force: true}, options);
    return utils.fetch(this.pkg, Object.assign({dir: this.cwd}, this.options, options)).then(installed => {
      if (!_.isEmpty(installed)) {
        fs.writeJSONSync(path.join(this.cwd, CUPSDRV), installed);
      }
      return installed;
    });
  }

  _load(dir) {
    dir = dir || this.cwd;
    const cupsdrvFile = path.resolve(dir, CUPSDRV);
    if (!fs.existsSync(cupsdrvFile)) {
      throw new Error(`Can not find .cupsdrv.json file in ${dir}. You should call "fetch" first`);
    }

    const info = fs.readJSONSync(cupsdrvFile);
    if (!fs.existsSync(info.canonicalDir)) {
      throw new Error(`Can not find cups driver libs: ${info.canonicalDir}. You should "fetch" it first`);
    }

    const cupsdrvDir = info.canonicalDir;

    return utils.files(cupsdrvDir, 'dir').map(maker => {
      return utils.files(path.join(cupsdrvDir, maker), 'all').then(result => {
        const drivers = result.dirs
          .map(name => ({name, path: path.join(cupsdrvDir, maker, name)}))
          .filter(item => isValidDriverDir(item.path));

        const compatibles = result.files
          .map(name => path.join(cupsdrvDir, maker, name))
          .find(isCompatiblesFile);

        return {maker, drivers, compatibles};
      }).then(item => PromiseA.all([
        (() => PromiseA.map(item.drivers, driver => {
          driver.scripts = _.omitBy({
            install: utils.fileIfExists(driver.path, 'install.sh'),
            uninstall: utils.fileIfExists(driver.path, 'uninstall.sh')
          }, _.isEmpty);
          /* eslint-disable no-return-assign */
          return driver.models = utils.loadModels(driver.path);
        }))(),
        (() => {
          if (_.isString(item.compatibles)) {
            item.compatibles = utils.loadCompatibles(item.compatibles);
          }
        })()
      ]).thenReturn(item));
    }).then(items => ({info, items}));
  }

  build() {
    return this._fetch().then(() => this._load().then(data => {
      const {info, items} = data;
      const drivers = _.flatten(items.map(item => {
        const answer = {};
        _.forEach(item.drivers, driver => {
          _.forEach(driver.models, model => {
            answer[model] = {
              model,
              maker: item.maker,
              driver: driver.name,
              scripts: driver.scripts
            };
          });
        });

        _.forEach(item.compatibles, (compatible, model) => {
          if (!answer[compatible]) {
            throw new Error(`There is no compatible driver ${item.maker} -> ${compatible} for ${item.maker} -> ${model}`);
          }
          if (answer[model]) {
            console.warn(`Overriding driver ${item.maker} -> ${model} with ${item.maker} -> ${compatible}`);
          }
          answer[model] = Object.assign(_.cloneDeep(answer[compatible]), {model, compatible});
        });

        return _.values(answer);
      }));

      if (this.options.scriptUriTemplate) {
        const template = utils.compile(this.options.scriptUriTemplate);
        _.forEach(drivers, driver => {
          const {scripts} = driver;
          _.forEach(scripts, (file, name) => {
            scripts[name] = template(Object.assign(_.omit(driver, ['scripts']), {script: scripts[name]}));
          });
        });
      }
      return {info, drivers};
    }));
  }
}

module.exports = Builder;
