const addon = require('../build/Release/n-api-test-native');

function NApiTest(name) {
    this.greet = function(str) {
        return _addonInstance.greet(str);
    }

    var _addonInstance = new addon.NApiTest(name);
}

module.exports = NApiTest;
