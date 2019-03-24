const dut = require('../build/Release/dut.node');
const {Sim, SimUtils, RisingEdge, FallingEdge, Interfaces} = require('../');
const { Clock } = SimUtils;
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

	function* reset() {
	    dut.rstf(0);
	    for(let i of _.range(5)) {
		yield* RisingEdge(dut.clk);
	    }
	    dut.rstf(1);
	}
	sim.addTask(reset());

	let clk = new Clock(dut.clk, 1);
	sim.addClock(clk);
	const target = new Elastic(sim, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
	const initiator = new Elastic(sim, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);
	target.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator.randomizeReady = ()=>{ return jsc.random(0,5); };
	initiator.randomize = 0;
	target.randomize = 0;

	target.init();
	initiator.init();

	let din = _.range(10).map(x => x);
	target.txArray = din.slice();

	sim.finishTask(() => {
	    let dout = model(din.slice());
	    //		    assert(_.isEqual(dout, initiator.rxArray));
	    try{
		assert.deepEqual(dout, initiator.rxArray);
	    } catch(e){
		//console.log(e);
		dut.finish();
		throw(e);
	    }
	    
	    dout.map((x,i) => {
		if(x != initiator.rxArray[i])
		    console.log('x: ', x, ' i: ', i, 'initiator[i]: ', initiator.rxArray[i]);
	    });
	});

	sim.run(100);
    });
});


