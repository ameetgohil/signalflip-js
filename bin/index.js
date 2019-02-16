const dut = require('./build/Release/dut.node');
const {Sim, RisingEdge, FallingEdge, Interfaces} = require('signalflip-js');
const {Elastic} = Interfaces;
const _ = require('lodash');


const clk = new Sim(dut, dut.eval, dut.clk);
dut.init();

const init = () => {
    dut.t0_data(0);
    dut.t0_valid(0);
    dut.i0_ready(1);
    dut.clk(0);
    dut.rstf(0);
};

init();
let i = 0;
clk.on('negedge', (props) => {
    if(i < 10) {
	dut.rstf(0);
    } else {
	dut.rstf(1);
    }
    i++;
});

let range = n => Array.from(Array(n).keys())

const target = new Elastic(clk, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
const initiator = new Elastic(clk, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);
initiator.randomize = 0;
target.randomize = 0;
target.init();
initiator.init();


const u = x => x >>> 0;

const model = (din_array) => {
    let dout = [];
    while(din_array.length > 0) {
	dout.push(din_array[0] << 2);
	din_array.shift();
    }
    return dout;
};


let din = range(5).map(x => u(x));
target.txArray = din.slice();

clk.finishTask(() => {
    let dout = model(din.slice());
    

    console.log('initator array:: ', initiator.rxArray);
    console.log('dou array:: ', dout);
    console.log('are equal: ', _.isEqual(dout, initiator.rxArray));
    console.log('expected #: ', dout.length, ' actual #: ', initiator.rxArray.length);
    dout.map((x,i) => {
	if(x != initiator.rxArray[i])
	    console.log('x: ', x, ' i: ', i, 'initiator[i]: ', initiator.rxArray[i]);
    });
});

//clk.addTask(txn());
clk.run(100);



module.exports = dut;
