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

const modelBigInt = (din_array) => {
  let dout = [];
  while(din_array.length > 0) {
      dout.push({data: din_array[0].data << 2n, isLast: din_array[0].isLast});
      din_array.shift();
  }
  return dout;
};

let sim;
let target0, initiator0;
let target1, initiator1;
let target2, initiator2;

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
    target0 = new Elastic(sim, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
    initiator0 = new Elastic(sim, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);
    target0.randomizeValid = ()=>{ return jsc.random(0,5); };
    initiator0.randomizeReady = ()=>{ return jsc.random(0,5); };

      target1 = new Elastic(sim, 0, dut.clk, dut.t1_data, dut.t1_valid, dut.t1_ready, null, true);
      initiator1 = new Elastic(sim, 1, dut.clk, dut.i1_data, dut.i1_valid, dut.i1_ready, null, true);
      target1.randomizeValid = ()=>{ return jsc.random(0,5); };
      initiator1.randomizeReady = ()=>{ return jsc.random(0,5); };

      target2 = new Elastic(sim, 0, dut.clk, dut.t2_data, dut.t2_valid, dut.t2_ready, null, true);
      initiator2 = new Elastic(sim, 1, dut.clk, dut.i2_data, dut.i2_valid, dut.i2_ready, null, true);
      target2.randomizeValid = ()=>{ return jsc.random(0,5); };
      initiator2.randomizeReady = ()=>{ return jsc.random(0,5); };


    target0.init();
      initiator0.init();
      target1.init();
      initiator1.init();
      target2.init();
      initiator2.init();
    
    //target.print = true;
      let din = [];
      let dinBigInt = [];
    for(let i of _.range(10)) {
        din.push({data: i*3423, isLast: false});
        dinBigInt.push({data: BigInt(i*5255), isLast: false});
    }
      target0.txArray = din.slice();
      target1.txArray = dinBigInt.slice();
      target2.txArray = dinBigInt.slice();
    sim.addTask(() => {
        let dout = model(din.slice());
        let doutBigInt = modelBigInt(dinBigInt.slice());
      try{
	        assert.deepEqual(dout, initiator0.rxArray);
          assert.deepEqual(doutBigInt, initiator1.rxArray);
          assert.deepEqual(doutBigInt, initiator2.rxArray);
      } catch(e){
	        dut.finish();
	        throw(e);
      }
    },'POST_RUN');
      
  };
  
  it('Constant valid - Constant ready', () => {
    setup("top_cc");
    initiator0.randomize = 0;
    target0.randomize = 0;

      initiator1.randomize = 0;
      target1.randomize = 0;

      initiator2.randomize = 0;
      target2.randomize = 0;

    sim.run(1000);
  });
  
  it('Randomized valid - Constant Ready', function () {
    this.timeout(6000); // test timeout in milliseconds
    let t = jsc.forall(jsc.constant(0), function () {
      setup("top_rc");
      initiator0.randomize = 0;
      target0.randomize = 1;

        initiator1.randomize = 0;
        target1.randomize = 1;

        initiator2.randomize = 0;
        target1.randomize = 1;

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
      initiator0.randomize = 1;
      target0.randomize = 0;

        initiator1.randomize = 1;
        target1.randomize = 0;

        initiator2.randomize = 1;
        target2.randomize = 0;

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
      initiator0.randomize = 1;
      target0.randomize = 1;

        initiator1.randomize = 1;
        target1.randomize = 1;

        initiator2.randomize = 1;
        target2.randomize = 1;

      sim.run(1000);
      return true;
    });
    const props = {tests: 100};
    jsc.check(t, props);//.then( r => r === true ? done() : done(new Error(JSON.stringify(r))));
  });

});

