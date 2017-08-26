# cupsdm-builder [![Build Status](https://travis-ci.org/oodolabs/cupsdm-builder.svg?branch=master)](https://travis-ci.org/oodolabs/cupsdm-builder)

> CUPS drivers builder


## Install

```
$ npm install cupsdm-builder
```


## Usage

```js
const Builder = require('cupsdm-builder');

Builder.build('oodolabs/cups-drivers', {
  scriptUriTemplate: 'https://raw.githubusercontent.com/oodolabs/cups-drivers/master/{{{maker}}}/{{{driver}}}/{{{script}}}'
}).then(result => {
  console.log(result);
  /* -->
{ info: 
   { endpoint: 
      { name: 'cups-drivers',
        source: 'oodolabs/cups-drivers',
        target: '*' },
     canonicalDir: '/Users/taoyuan/dev/oodo/oodo-printers/cupsdm-builder/test/tmp/cups-drivers',
     pkgMeta: 
      { name: 'cups-drivers',
        homepage: 'https://github.com/oodolabs/cups-drivers',
        _release: '52c4b3769f',
        _resolution: 
         { type: 'branch',
           branch: 'master',
           commit: '52c4b3769f0ff9fe9ea163c0f409aa0c8e92d40d' },
        _source: 'https://github.com/oodolabs/cups-drivers.git',
        _target: '*' },
     dependencies: {},
     nrDependants: 0 },
  drivers: 
   [ { model: 'Brother BrGenPrintML2 for CUPS',
       maker: 'Brother',
       driver: 'BrGenPrintML2',
       scripts: { install: 'https://raw.githubusercontent.com/oodolabs/cups-drivers/master/Brother/BrGenPrintML2/install.sh' } },
     { model: 'Brother DCP-1618W',
       maker: 'Brother',
       driver: 'BrGenPrintML2',
       scripts: { install: 'https://raw.githubusercontent.com/oodolabs/cups-drivers/master/Brother/BrGenPrintML2/install.sh' },
       driverModel: 'Brother BrGenPrintML2 for CUPS' },
     { model: 'HP Deskjet 5820 Series, hpcups 3.16.11',
       maker: 'HP',
       driver: 'hplip',
       scripts: { install: 'https://raw.githubusercontent.com/oodolabs/cups-drivers/master/HP/hplip/install.sh' } } ] }
  */
})

```

## API

### Builder(pkg, [options])

#### pkg

Type: `string`

The CUPS driver libraries package in [bower install](https://bower.io/docs/api/#install) package format.

#### options

##### cwd

Type: `string`<br>
Default: `process.cwd()`

The working directory that the package stored in.

##### scriptUriTemplate
Type: `string`<br>
Default: `undefined`

The scripts of install and uninstall urls generation template based on [handlebars](http://handlebarsjs.com/). 

For example:

```
https://raw.githubusercontent.com/oodolabs/cups-drivers/master/{{{maker}}}/{{{driver}}}/{{{script}}}
```

### .build()

Build CUPS drivers libraries to flat json format like:

```js
{ info: 
   { endpoint: 
      { name: 'cups-drivers',
        source: 'oodolabs/cups-drivers',
        target: '*' },
     canonicalDir: '/Users/taoyuan/dev/oodo/oodo-printers/cupsdm-builder/test/tmp/cups-drivers',
     pkgMeta: 
      { name: 'cups-drivers',
        homepage: 'https://github.com/oodolabs/cups-drivers',
        _release: '52c4b3769f',
        _resolution: 
         { type: 'branch',
           branch: 'master',
           commit: '52c4b3769f0ff9fe9ea163c0f409aa0c8e92d40d' },
        _source: 'https://github.com/oodolabs/cups-drivers.git',
        _target: '*' },
     dependencies: {},
     nrDependants: 0 },
  drivers: 
   [ { model: 'Brother BrGenPrintML2 for CUPS',
       maker: 'Brother',
       driver: 'BrGenPrintML2',
       scripts: { install: 'https://raw.githubusercontent.com/oodolabs/cups-drivers/master/Brother/BrGenPrintML2/install.sh' } },
     { model: 'Brother DCP-1618W',
       maker: 'Brother',
       driver: 'BrGenPrintML2',
       scripts: { install: 'https://raw.githubusercontent.com/oodolabs/cups-drivers/master/Brother/BrGenPrintML2/install.sh' },
       driverModel: 'Brother BrGenPrintML2 for CUPS' },
     { model: 'HP Deskjet 5820 Series, hpcups 3.16.11',
       maker: 'HP',
       driver: 'hplip',
       scripts: { install: 'https://raw.githubusercontent.com/oodolabs/cups-drivers/master/HP/hplip/install.sh' } } ] }
```

## License

MIT © [Oodolabs](https://github.com/oodolabs)
