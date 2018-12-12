const dut = require('./build/Release/dut.node');
console.log('dut: ', dut);
console.log(dut.hello());
for(var i=0; i<1000; i++) {
    dut.set_in_quad(dut.get_in_quad() + 0x12);
    dut.tick();
    
//    console.log(dut.tick());
}

module.exports = dut;
