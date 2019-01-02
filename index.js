const dut = require('./build/Release/dut.node');
const clock = require('./clock.js');


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
//	dut.t0_data(dut.t0_data() + 2);
//	dut.t0_valid(1);
    }
    console.log('i0_data: ', dut.i0_data(), ' i0_valid: ', dut.i0_valid(), ' rstf: ', dut.rstf());
    i++;
});

function* drive_t0() {
    while(true) {
	yield function() {return dut.rstf() == 1};
	dut.t0_data(dut.t0_data() + 2);
	dut.t0_valid(1);
    }
}

clk.addTask(drive_t0);
clk.run(20);


       
		   
module.exports = dut;
