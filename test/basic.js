const dut = require('../build/Release/dut.node');
const {Sim, sim-utils, RisingEdge, FallingEdge, Interface} = require('../');
const { Clock } = sim-utils;
const {Elastic} = Interfaces;
const _ = require('lodash');
//const chai = require('chai');
//const expect = chai.expect;
const jsc = require('jsverify');
const assert = require('assert');

const model = (din_array) => {
    let dout = [];
    while(din_array.length > 0) {
	dout.push(din_array[0] << 2);
	din_array.shift();
    }
    return dout;
}

describe('Basic Group', () => {
    it('Constant valid-ready', () => {
	dut.init(); // Iniit dut
	const sim = new Sim(dut, dut.eval);

	const init = () => {
	    dut.t0_data(0);
	    dut.t0_valid(0);
	    dut.clk(0);
	    dut.rstf(0);
	};

	init();

	let clk = new Clock(dut.clk, 1);
	sim.addClock(clk);
	const target = new Elastic(clk, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
	const initiator = new Elastic(clk, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);

	initiator.randomize = 0;
	target.randomize = 0;

	let din = range(50).map(x => BigInt(x));
	target.txArray = din.slice();

	clk.finishTask(() => {
	    let dout = model(din.slice());
	    //		    assert(_.isEqual(dout, initiator.rxArray));
	    try{
		assert.deepEqual(dout, initiator.rxArray);
	    } catch(e){
		dut.finish();
	    }
	    
	    dout.map((x,i) => {
		if(x != initiator.rxArray[i])
		    console.log('x: ', x, ' i: ', i, 'initiator[i]: ', initiator.rxArray[i]);
	    });
	});

	clk.run(1000);
    });
});


