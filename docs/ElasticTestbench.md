# Elastic(valid-ready) Testbench Tutorial
This tutorial goes over how to setup a signalflip testbench for a valid-ready design that shifts the input data by 2. <br />
First you need to install the prerequisites <br />
- [Verilator (4.0 or above)](https://www.veripool.org/projects/verilator/wiki/Installing) <br />
- [nvm (node)](https://github.com/creationix/nvm) <br />
- cmake
- gtkwave (for viewing waveforms) <br />
	
Implemented tutorial for reference https://github.com/ameetgohil/elastic-signalflip-example
## Setup a testbench template
```
git clone https://github.com/ameetgohil/create-signalflip-js-tb.git elastic_tb && rm -rf elastic_tb/.git
cd elastic_tb
nvm use || nvm install
npm i 
```

## Create the top.sv file
The top.sv file can saved anywhere, but for this tutorial, we will create a new folder called verilogsrc and save it there (elastic_tb->verilogsrc->top.sv)
```systemverilog
module top
  (
   input [31:0] t0_data,
   input        t0_valid,
   output       t0_ready,
   output [31:0] i0_data,
   output        i0_valid,
   input        i0_ready,
   input        clk,
   input        rstf
   );

   wire         t0_ready;
   
   reg [31:0]   i0_data;
   
   reg          i0_valid;
   

   logic      data_en;
   assign t0_ready = ~rstf ? 0:~i0_valid | i0_ready;

   assign data_en = t0_valid & t0_ready;

   always @(posedge clk or negedge rstf) begin
      if(!rstf) begin
         i0_data <= 0;
         i0_valid <= 0;
      end
      else begin
         if(data_en)
           i0_data <= t0_data<<2;
         i0_valid <= ~t0_ready | t0_valid;
      end
   end
endmodule
```

## Modify config.json
Point to the .sv file you want simulate and set dut name.
```json
    "dut_file": "./verilogsrc/top.sv",
    "dut_name": "top",
```

## Create the test
The index.js file in the template already contains code to run the top_elastic (valid-ready) test. We will empty out the file for this tutorial. <br />
<br />
Add the following to basic.js import useful functions such as RisingEdge, FallingEdge, Sim
```javascript
//imports dut that was compiled with verilator wrapped with N-API. All top level signals are accessible via this import
const dut = require('../build/Release/dut.node');
//Sim manages tasks and advances time
//RisingEdge/FallingEdge - wait under rising/falling edge detect on a given signal
const {Sim, SimUtils, RisingEdge, RisingEdges, FallingEdge, FallingEdges, Edge, Edges, Interfaces} = require('signalflip-js');
const { Clock, Intf } = SimUtils;
const { Elastic } = Interfaces;
//A nice to have utililty to deal with arrays
const _ = require('lodash');

const jsc = require('jsverify');
const assert = require('assert');

let sim;
let target, initiator;
```
Create dut model
```javascript
const model = (din_array) => {
  let dout = [];
  while(din_array.length > 0) {
    dout.push({data: din_array[0].data << 2, isLast: din_array[0].isLast});
    din_array.shift();
  }
  return dout;
};
```
Describe the test
- Initialize target(master) and initiator(slave) driver
- Assign randomizer functions for valid and ready signals
- Generate target trasaction (din)
- Create post simulation checker that verifies the output(intiator) capture data described by the model described above
- Create test with constant valid and ready signals

```javascript
describe('Basic Group', () => {
  let setup = (name) => {
    // set up the environment
    dut.init(name); // Init dut
    sim = new Sim(dut);

    // TODO: Create clock
    let clk = new Clock(dut.clk, 1)
    sim.addClock(clk);

    // RESET
    sim.addTask(function* () {
      dut.rstf(0);
      yield* RisingEdges(dut.clk, 5);
      dut.rstf(1);
      yield* RisingEdge(dut.clk);
    }(), 'RESET');
    
    // TODO: Add setup code (interfaces, transaction, ...) etc...
	//- Initialize target(master) and initiator(slave) driver
    target = new Elastic(sim, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
    initiator = new Elastic(sim, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);
	- Assign randomizer functions for valid and ready signals
    target.randomizeValid = ()=>{ return jsc.random(0,5); };
    initiator.randomizeReady = ()=>{ return jsc.random(0,5); };

    target.init();
    initiator.init();
    
    //target.print = true;
	//- Generate target trasaction (din)
    let din = [];
    for(let i of _.range(10)) {
      din.push({data: i, isLast: false});
    }
    target.txArray = din.slice();
	
	//- Create post simulation checker that verifies the output(intiator) capture data described by the model described above
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
});
```

Final basic.js with 3 more tests with randomized valid-ready signals<br />
The randomized tests are wrapped with jsverify so that the tests run 100 times (the "test" param controls number of times the test runs)<br />
If a randomized test fails, you can use th rngState value to recreate the failed test. See jsverify docs to more info
```javascript
//imports dut that was compiled with verilator wrapped with N-API. All top level signals are accessible via this import
const dut = require('../build/Release/dut.node');
//Sim manages tasks and advances time
//RisingEdge/FallingEdge - wait under rising/falling edge detect on a given signal
const {Sim, SimUtils, RisingEdge, RisingEdges, FallingEdge, FallingEdges, Edge, Edges, Interfaces} = require('signalflip-js');
const { Clock, Intf } = SimUtils;
const { Elastic } = Interfaces;
//A nice to have utililty to deal with arrays
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
    let clk = new Clock(dut.clk, 1)
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
```

## Run the simulation
To run simulation
```
make
```
To view the waveform
```
gtkwave logs/top_cc.vcd
gtkwave logs/top_cr.vcd
gtkwave logs/top_rc.vcd
gtkwave logs/top_rr.vcd
```
