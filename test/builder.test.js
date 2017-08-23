const {assert} = require('chai');
const path = require('path');
const Builder = require('../lib/builder');

describe('builder', function () {
	this.timeout(10000);

	it('Should build with default options', function () {
		const builder = new Builder('taoyuan/cups-driver-libs', {
			cwd: path.join(__dirname, 'tmp')
		});
		return builder.build().tap(console.log).then(drivers => assert.ok(drivers.length));
	});

	it('Should build with scriptUriTemplate', function () {
		const builder = new Builder('taoyuan/cups-driver-libs', {
			cwd: path.join(__dirname, 'tmp'),
			scriptUriTemplate: 'https://raw.githubusercontent.com/taoyuan/cups-driver-libs/master/{{{maker}}}/{{{driver}}}/{{{script}}}'
		});
		return builder.build().tap(console.log).then(drivers => assert.ok(drivers.length));
	});
});
