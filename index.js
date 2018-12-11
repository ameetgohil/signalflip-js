const dut = require('./build/Release/dut.node');
console.log('dut: ', dut);
console.log(dut.hello());

module.exports = dut;
