const dut = require('./build/Release/dut.node');
console.log('dut: ', dut);
console.log(dut.hello());
for(var i=0; i<10; i++) {
//    dut.tick();
}

module.exports = dut;
