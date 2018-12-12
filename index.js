const dut = require('./build/Release/dut.node');
console.log('dut: ', dut);
console.log(dut.hello());
for(var i=0; i<10000; i++) {
    dut.tick();
//    console.log(dut.tick());
}

module.exports = dut;
