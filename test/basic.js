const dut = require('../build/Release/dut.node');
const {Sim, SimUtils, RisingEdge, RisingEdges, FallingEdge, FallingEdges, Interfaces} = require('../');
const { Clock, Intf } = SimUtils;
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

let sim;
let target, initiator;

describe('Basic Group', () => {
    beforeEach(() => {
	// set up the environment
	dut.init(); // Init dut
	sim = new Sim(dut, dut.eval);

	/*const init = () => {
	  dut.t0_data(0);
	  dut.t0_valid(0);
	  dut.clk(0);
	  dut.rstf(0);
	  };
	  init();*/

	function* reset() {
	    dut.rstf(0);
	    yield* RisingEdges(dut.clk,5);
	    dut.rstf(1);
	}
	sim.addTask(reset());

	let clk = new Clock(dut.clk, 1);
	sim.addClock(clk);

	target = new Elastic(sim, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
	initiator = new Elastic(sim, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);
	target.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator.randomizeReady = ()=>{ return jsc.random(0,5); };

	//target.print = true;
	let din = _.range(10).map(x => x);
	target.txArray = din.slice();
	sim.finishTask(() => {
	    let dout = model(din.slice());
	    //		    assert(_.isEqual(dout, initiator.rxArray));
	    
	    
	    dout.map((x,i) => {
		if(x != initiator.rxArray[i])
		    console.log('x: ', x, ' i: ', i, 'initiator[i]: ', initiator.rxArray[i]);
	    });

	    try{
		assert.deepEqual(dout, initiator.rxArray);
	    } catch(e){
		//console.log(e);
		dut.finish();
		throw(e);
	    }
	});
	
    });
    it('Constant valid - Constant ready', () => {
	dut.init("top_cc");
	initiator.randomize = 0;
	target.randomize = 0;
	target.init();
	initiator.init();

	sim.run(100);
    });
    
    it('Randomized valid - Constant Ready', () => {
	dut.init("top_rc");
	initiator.randomize = 0;
	target.randomize = 1;
	target.init();
	initiator.init();

	sim.run(1000);
    });
    
    it('Constant valid - Randomized ready', () => {
	dut.init("top_cr");
	initiator.randomize = 1;
	target.randomize = 0;

	target.init();
	initiator.init();

	sim.run(1000);
    });

    it('Randomized valid - Randomized ready', () => {
	//	let t = jsc.forall(jsc.constant(0), function () {
	
	//this.timeout(6000); // test timeout in milliseconds
	dut.init("top_rr");
	initiator.randomize = 1;
	target.randomize = 1;
	target.init();
	initiator.init();

	sim.run(1000);
	//	});
	//	const props = {tests: 1 , rngState:"0084da9315c6bfe072"};
	//	jsc.check(t, props);//.then( r => r === true ? done() : done(new Error(JSON.stringify(r))));
    });
    
});

