const dut = require('../build/Release/dut.node');
const {Sim, SimUtils, RisingEdge, RisingEdges, FallingEdge, FallingEdges, Interfaces, Fork} = require('../');
const { Clock, Intf } = SimUtils;
const {Elastic} = Interfaces;
const _ = require('lodash');
const jsc = require('jsverify');
const assert = require('assert');

const model = (din_array) => {
    let dout = [];
    while(din_array.length > 0) {
	dout.push({data: din_array[0].data << 2, isLast: din_array[0].isLast});
	din_array.shift();
    }
    return dout;
};

let sim;
let target, initiator;

describe('Multi-Clock Group', () => {
    let setup = (name) => {
	// set up the environment
	dut.init(name); // Init dut
	sim = new Sim(dut);

	// TODO: Create clock
	let clk = new Clock(dut.clk, 5);
	let clk2 = new Clock(dut.clk2, 14);
	let clk3 = new Clock(dut.clk3, 8);
	let clk4 = new Clock(dut.clk4, 9);
	let clk5 = new Clock(dut.clk5, 13);
	sim.addClock(clk);
	sim.addClock(clk2);
	sim.addClock(clk3);
	sim.addClock(clk4);
	sim.addClock(clk5);

	
	// RESET
	sim.addTask(function* () {
	    dut.rstf(0);
	    yield* RisingEdges(dut.clk, 10);
	    dut.rstf(1);
	    yield* RisingEdges(dut.clk,10);
	}(), 'RESET');
	
	// TODO: Add setup code (interfaces, transaction, ...) etc...
	target_0 = new Elastic(sim, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
	initiator_0 = new Elastic(sim, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);

	target_0.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator_0.randomizeReady = ()=>{ return jsc.random(0,5); };

	target_1 = new Elastic(sim, 0, dut.clk2, dut.t3_data, dut.t3_valid, dut.t3_ready, null);
	initiator_1 = new Elastic(sim, 1, dut.clk2, dut.i3_data, dut.i3_valid, dut.i3_ready, null);

	target_1.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator_1.randomizeReady = ()=>{ return jsc.random(0,5); };

	target_0.init();
	initiator_0.init();

	target_1.init();
	initiator_1.init();
	//initiator_1.print = true;
	//target_0.print = true;
	let din = [];
	for(let i of _.range(10)) {
	    din.push({data: i, isLast: false});
	}
	//console.log(din);
	target_0.txArray = din.slice();
	target_1.txArray = din.slice();
	sim.addTask(() => {
	    let dout = model(din.slice());
	    //console.log(dout);
	    //console.log(initiator_0.rxArray);
	    //console.log(initiator_1.rxArray);
	    try{
		assert.deepEqual(dout, initiator_0.rxArray);
		assert.deepEqual(dout, initiator_1.rxArray);
	    } catch(e){
		dut.finish();
		throw(e);
	    }
	},'POST_RUN');
	
    };
    
    it('Constant valid - Constant ready', () => {
	setup("multi_clock_top_cc");
	initiator_0.randomize = 0;
	target_0.randomize = 0;
	initiator_1.randomize = 0;
	target_1.randomize = 0;

	sim.run(1000);
    });
    
/*    it('Randomized valid - Constant Ready', function () {
	this.timeout(6000); // test timeout in milliseconds
	let t = jsc.forall(jsc.constant(0), function () {
	    setup("multi_clock_top_rc");
	    initiator_0.randomize = 0;
	    target_0.randomize = 1;

	    initiator_1.randomize = 0;
	    target_1.randomize = 1;

	    sim.run(1000);
	    return true;
	});
	const props = {tests: 100};
	jsc.check(t, props);
    });
    
    it('Constant valid - Randomized ready', function () {
	this.timeout(6000); // test timeout in milliseconds
	let t = jsc.forall(jsc.constant(0), function () {
	    setup("multi_clock_top_cr");
	    initiator_0.randomize = 1;
	    target_0.randomize = 0;

	    initiator_1.randomize = 1;
	    target_1.randomize = 0;

	    sim.run(1000);
	    return true;
	});
	const props = {tests: 100};
	jsc.check(t, props);
    });

    it('Randomized valid - Randomized ready', function () {
	this.timeout(6000); // test timeout in milliseconds
	let t = jsc.forall(jsc.constant(0), function () {
	    setup("multi_clock_top_rr");
	    initiator_0.randomize = 1;
	    target_0.randomize = 1;

	    initiator_1.randomize = 1;
	    target_1.randomize = 1;

	    sim.run(1000);
	    return true;
	});
	const props = {tests: 100};
	jsc.check(t, props);//.then( r => r === true ? done() : done(new Error(JSON.stringify(r))));
    });
*/

});

