const PromiseA = require('bluebird');
const ndir = require('node-dir');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const YAML = require('yamljs');
const bower = require('bower');
const Handlebars = require('handlebars');

/**
 *
 * @param {String} dir
 * @param {String} [type]
 * 	'file' returns only file listings
 * 	'dir' returns only directory listings
 * 	'all' returns {dirs:[], files:[]}
 * 	'combine' returns []
 *	@param {Object} [options]
 * @returns {Function}
 */
exports.files = function (dir, type, options) {
	options = Object.assign({recursive: false, shortName: true}, options);
	return PromiseA.fromCallback(cb => ndir.files(dir, type, cb, options));
};

exports.loadModels = function (loc) {
	if (!fs.lstatSync(loc).isFile()) {
		loc = path.join(loc, 'models.txt');
	}
	if (!fs.lstatSync(loc).isFile()) {
		return [];
	}
	const content = fs.readFileSync(loc).toString();
	return content.split(/[\r\n]/).map(_.trim).filter(_.identity);
};

exports.loadCompatibles = function (loc) {
	if (!fs.lstatSync(loc).isFile()) {
		loc = path.join(loc, 'compatibles.yml');
	}
	if (!fs.lstatSync(loc).isFile()) {
		return {};
	}
	return YAML.load(loc);
};

exports.fetch = function (pkg, options) {
	if (_.isString(options)) {
		options = {dir: options};
	}
	options = Object.assign({force: true}, options);
	options.directory = options.directory || options.dir || process.cwd();

	fs.ensureDirSync(options.directory);
	return new PromiseA((resolve, reject) => {
		bower.commands.install([pkg], {}, options)
			.on('error', reject)
			.on('end', resolve);
	}).then(installed => {
		if (!_.isEmpty(installed)) {
			installed = installed[Object.keys(installed)[0]];
		}
		return installed;
	})
};

exports.fileIfExists = function (dir, file) {
	if (fs.existsSync(path.resolve(dir, file))) {
		return file;
	}
};

exports.compile = function (template) {
	return Handlebars.compile(template);
};
