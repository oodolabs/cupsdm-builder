const {assert} = require('chai');
const path = require('path');
const utils = require('../lib/utils');

describe('utils', function () {
	this.timeout(10000);

	it('Should fetch to specified dir', function () {
		const dir = path.join(__dirname, 'tmp');
		return utils.fetch('oodolabs/cups-drivers', {dir}).then(installed => {
			console.log(installed);
			assert.ok(installed);
			assert.include(installed.canonicalDir, dir);
			assert.nestedPropertyVal(installed, 'endpoint.name', 'cups-drivers');
		});
	});
});
