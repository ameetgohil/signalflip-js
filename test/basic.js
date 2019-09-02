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

describe('Basic Group', () => {
  let setup = (name) => {
    // set up the environment
    dut.init(name); // Init dut
    sim = new Sim(dut);

    // TODO: Create clock
    let clk = new Clock(dut.clk, 1);
    sim.addClock(clk);

    
    // RESET
    sim.addTask(function* () {
      dut.rstf(0);
      yield* RisingEdges(dut.clk, 5);
      dut.rstf(1);
      yield* RisingEdge(dut.clk);
    }(), 'RESET');
    
    // TODO: Add setup code (interfaces, transaction, ...) etc...
    target = new Elastic(sim, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
    initiator = new Elastic(sim, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);
    target.randomizeValid = ()=>{ return jsc.random(0,5); };
    initiator.randomizeReady = ()=>{ return jsc.random(0,5); };

    target.init();
    initiator.init();
    
    //target.print = true;
    let din = [];
    for(let i of _.range(10)) {
      din.push({data: i, isLast: false});
    }
    target.txArray = din.slice();
    sim.addTask(() => {
      let dout = model(din.slice());
      try{
	assert.deepEqual(dout, initiator.rxArray);
      } catch(e){
	dut.finish();
	throw(e);
      }
    },'POST_RUN');
    
  };
  
  it('Constant valid - Constant ready', () => {
    setup("top_cc");
    initiator.randomize = 0;
    target.randomize = 0;

    sim.run(1000);
  });
  
  it('Randomized valid - Constant Ready', function () {
    this.timeout(6000); // test timeout in milliseconds
    let t = jsc.forall(jsc.constant(0), function () {
      setup("top_rc");
      initiator.randomize = 0;
      target.randomize = 1;

      sim.run(1000);
      return true;
    });
    const props = {tests: 100};
    jsc.check(t, props);
  });
  
  it('Constant valid - Randomized ready', function () {
    this.timeout(6000); // test timeout in milliseconds
    let t = jsc.forall(jsc.constant(0), function () {
      setup("top_cr");
      initiator.randomize = 1;
      target.randomize = 0;

      sim.run(1000);
      return true;
    });
    const props = {tests: 100};
    jsc.check(t, props);
  });

  it('Randomized valid - Randomized ready', function () {
    this.timeout(6000); // test timeout in milliseconds
    let t = jsc.forall(jsc.constant(0), function () {
      setup("top_rr");
      initiator.randomize = 1;
      target.randomize = 1;

      sim.run(1000);
      return true;
    });
    const props = {tests: 100};
    jsc.check(t, props);//.then( r => r === true ? done() : done(new Error(JSON.stringify(r))));
  });

});

