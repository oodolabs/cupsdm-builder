const path = require('path');
const {assert} = require('chai');
const Builder = require('../lib/builder');

describe('builder', function () {
	this.timeout(10000);

	it('Should build with default options', () => {
		const builder = new Builder('oodolabs/cups-drivers', {
			cwd: path.join(__dirname, 'tmp')
		});
		return builder.build().tap(console.log).then(drivers => assert.ok(drivers.length));
	});

	it('Should build with scriptUriTemplate', () => {
		const builder = new Builder('oodolabs/cups-drivers', {
			cwd: path.join(__dirname, 'tmp'),
			scriptUriTemplate: 'https://raw.githubusercontent.com/oodolabs/cups-drivers/master/{{{maker}}}/{{{driver}}}/{{{script}}}'
		});
		return builder.build().tap(console.log).then(drivers => assert.ok(drivers.length));
	});
});
