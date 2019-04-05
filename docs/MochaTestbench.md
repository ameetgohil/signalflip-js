# Mocha Testbench Tutorial
This tutorial goes over how to setup a signalflip testbench for a valid-ready design that shifts the input data by 2. <br />
First you need to install the prerequisites <br />
- [Verilator (4.0 or above)](https://www.veripool.org/projects/verilator/wiki/Installing) <br />
- [nvm (node)](https://github.com/creationix/nvm) <br />
- cmake
- gtkwave (for viewing waveforms) <br />
	
## Setup a testbench template
```
git clone https://github.com/ameetgohil/create-signalflip-js-tb.git elastic_tb && rm -rf elastic_tb/.git
cd elastic_tb
nvm use || nvm install
npm i --ignore-scripts
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
Add the following to test.js import useful functions such as RisingEdge, FallingEdge, Sim
```javascript
const _ = require('lodash');
//const chai = require('chai');
//const expect = chai.expect;
const jsc = require('jsverify');
const assert = require('assert');
//imports dut that was compiled with verilator wrapped with N-API. All top level signals are accessible via this import
const dut = require('./build/Release/dut.node');
//Sim manages tasks and advances time
//RisingEdge/FallingEdge - wait under rising/falling edge detect on a given signal
const dut = require('../build/Release/dut.node');
const {Sim, SimUtils, RisingEdge, FallingEdge, Interfaces} = require('../');
// Elastic is a valid-ready driver in the signalflip package (see src/interfaces/elastic/elastic.js in signalflip-js github repo)
const { Clock } = SimUtils;
const {Elastic} = Interfaces;
//A nice to have utililty to deal with arrays
const _ = require('lodash');
const jsc = require("jsverify");
const assert = require('assert');
let range = n => Array.from(Array(n).keys());
const u = x => x >>> 0;
```
Create dut model
```javascript
const model = (din_array) => {
    let dout = [];
    while(din_array.length > 0) {
	dout.push(din_array[0] << 2);
	din_array.shift();
    }
    return dout;
};
```
Describe the test (Template)
```javascript

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
	    for(let i of _.range(5)) {
		yield* RisingEdge(dut.clk);
	    }
	    dut.rstf(1);
	}
	sim.addTask(reset());

	let clk = new Clock(dut.clk, 1);
	sim.addClock(clk);

	target = new Elastic(sim, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
	initiator = new Elastic(sim, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);
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
		//assert.deepEqual(dout, initiator.rxArray);
	    } catch(e){
		//console.log(e);
		dut.finish();
		throw(e);
	    }
	});
	
    });
    it('Constant valid - Constant ready', () => {
	//this.timeout(6000); // test timeout in milliseconds
	dut.init("top_cc");
	target.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator.randomizeReady = ()=>{ return jsc.random(0,5); };
	initiator.randomize = 0;
	target.randomize = 0;

	target.init();
	//console.log(target.txArray);
	initiator.init();

	sim.run(100);
    });
    
    it('Randomized valid - Constant Ready', () => {
	//this.timeout(6000); // test timeout in milliseconds
	dut.init("top_rc");
	target.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator.randomizeReady = ()=>{ return jsc.random(0,5); };
	initiator.randomize = 0;
	target.randomize = 1;
	//initiator.print = true;
	//target.print = true;
	target.init();
	initiator.init();

	sim.run(1000);
    });
    
    it('Constant valid - Randomized ready', () => {
	//this.timeout(6000); // test timeout in milliseconds
	dut.init("top_cr");
	target.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator.randomizeReady = ()=>{ return jsc.random(0,5); };
	initiator.randomize = 1;
	target.randomize = 0;

	target.init();
	initiator.init();

	sim.run(1000);
    });

    it('Randomized valid - Randomized ready', () => {
	//this.timeout(6000); // test timeout in milliseconds
	dut.init("top_rr");
	target.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator.randomizeReady = ()=>{ return jsc.random(0,5); };
	initiator.randomize = 1;
	target.randomize = 1;

	target.init();
	initiator.init();

	sim.run(1000);
    });
    
});

```

Final test.js
```javascript
const dut = require('../build/Release/dut.node');
const {Sim, SimUtils, RisingEdge, FallingEdge, Interfaces} = require('signalflip-js');
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
	    for(let i of _.range(5)) {
		yield* RisingEdge(dut.clk);
	    }
	    dut.rstf(1);
	}
	sim.addTask(reset());

	let clk = new Clock(dut.clk, 1);
	sim.addClock(clk);

	target = new Elastic(sim, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
	initiator = new Elastic(sim, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);
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
		//assert.deepEqual(dout, initiator.rxArray);
	    } catch(e){
		//console.log(e);
		dut.finish();
		throw(e);
	    }
	});
	
    });
    it('Constant valid - Constant ready', () => {
	//this.timeout(6000); // test timeout in milliseconds
	dut.init("top_cc");
	target.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator.randomizeReady = ()=>{ return jsc.random(0,5); };
	initiator.randomize = 0;
	target.randomize = 0;

	target.init();
	//console.log(target.txArray);
	initiator.init();

	sim.run(100);
    });
    
    it('Randomized valid - Constant Ready', () => {
	//this.timeout(6000); // test timeout in milliseconds
	dut.init("top_rc");
	target.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator.randomizeReady = ()=>{ return jsc.random(0,5); };
	initiator.randomize = 0;
	target.randomize = 1;
	//initiator.print = true;
	//target.print = true;
	target.init();
	initiator.init();

	sim.run(1000);
    });
    
    it('Constant valid - Randomized ready', () => {
	//this.timeout(6000); // test timeout in milliseconds
	dut.init("top_cr");
	target.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator.randomizeReady = ()=>{ return jsc.random(0,5); };
	initiator.randomize = 1;
	target.randomize = 0;

	target.init();
	initiator.init();

	sim.run(1000);
    });

    it('Randomized valid - Randomized ready', () => {
	//this.timeout(6000); // test timeout in milliseconds
	dut.init("top_rr");
	target.randomizeValid = ()=>{ return jsc.random(0,5); };
	initiator.randomizeReady = ()=>{ return jsc.random(0,5); };
	initiator.randomize = 1;
	target.randomize = 1;

	target.init();
	initiator.init();

	sim.run(1000);
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
gtkwave logs/vlt_dump.vcd
```
