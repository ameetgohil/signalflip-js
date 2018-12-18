const dut = require('./build/Release/dut.node');
const clock = require('./clock.js');

const fastclk = new clock(dut.fastclk);
console.log('dut: ', dut);
console.log(dut.hello());
//fastclk.run(1000);
console.log(clock);
/*clock.on('tickevent', (props) => {
    console.log(props);
});*/
/*for(var i=1; i<1000; i++) {
    dut.in_quad(dut.in_quad() + 0x12);
    //dut.tick();
//    i
    //dut.fastclk(dut.fastclk() ? 0:1);
    fastclk.tick();
    if(i%10 == 3) {
	dut.clk(1);
    }
    if(i%10 == 8) {
	dut.clk(0);
    }
    if(i > 1 && i < 10) {
	dut.reset_l(0);
    } else {
	dut.reset_l(1);
    }

    dut.eval();
//    console.log(dut.tick());
}*/

var i = 0;
fastclk.on('tickevent',  (props) => {
//    console.log(props);
    dut.in_quad(dut.in_quad() + 0x12);
    i++;
    if(i%10 == 3) {
	dut.clk(1);
    }
    if(i%10 == 8) {
	dut.clk(0);
    }
    if(i > 1 && i < 10) {
	dut.reset_l(0);
    } else {
	dut.reset_l(1);
    }

    dut.eval();
});

fastclk.run(1000);
		   
		   
module.exports = dut;
