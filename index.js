const dut = require('./build/Release/dut.node');
const clock = require('./clock.js');

/*const fastclk = new clock(dut.fastclk, dut.eval);
console.log('dut: ', dut);
console.log(clock);
var i = 0;
dut.clk(0);
dut.in_quad(0);
fastclk.on('tickevent',  (props) => {
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

});

function x(){
    for(var i = 0; i < 10; i++) {
	fastclk.posedge();
	console.log("here");
    }
}

x();

fastclk.run(1000);
*/

const clk = new clock(dut, dut.clk, dut.eval);
console.log('dut: ', dut);
console.log(clk);

const init = () => {
    dut.t0_data(0);
    dut.t0_valid(0);
    dut.i0_ready(1);
    dut.clk(0);
    dut.rstf(0);
};

init();
var i = 0;
clk.on('posedge', (props) => {
    if(i < 10) {
	dut.rstf(0);
    } else {
	dut.rstf(1);
	dut.t0_data(dut.t0_data() + 2);
	dut.t0_valid(1);
    }
    console.log('i0_data: ', dut.t0_data(), ' i0_valid: ', dut.i0_valid(), ' rstf: ', dut.rstf());
    i++;
});

clk.run(200);


       
		   
module.exports = dut;
