# Basic Testbench Tutorial
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
Add the following to index.js import useful functions such as RisingEdge, FallingEdge, Sim
```javascript
//imports dut that was compiled with verilator wrapped with N-API. All top level signals are accessible via this import
const dut = require('./build/Release/dut.node');
//Sim manages tasks and advances time
//RisingEdge/FallingEdge - wait under rising/falling edge detect on a given signal
const {Sim, RisingEdge, FallingEdge, Interfaces} = require('signalflip-js');
// Elastic is a valid-ready driver in the signalflip package (see src/interfaces/elastic/elastic.js in signalflip-js github repo)
const {Elastic} = Interfaces;
//A nice to have utililty to deal with arrays
const _ = require('lodash');
const jsc = require("jsverify");
const assert = require('assert');
let range = n => Array.from(Array(n).keys());
const u = x => x >>> 0;
```
Describe the test (Template)
```
describe('Basic Group', function () {

    before(() => {
	
	;
    });

    it('Basic', (done) => {
	this.timeout(60000); //

	let t = jsc.forall(jsc.constant(0), function () {

		setImmediate(() => {try{

            clk.run(1000);
  
            resolve(true);
  
          }catch(e){reject(e)}});
        }); // promise
      }); // forall
	// number of times the test is run
      const props = {tests: 100}; // , rngState:"0084da9315c6bfe072"
      jsc.check(t, props).then( r => r === true ? done() : done(new Error(JSON.stringify(r))));
    }); // it


}); // describe
```

Final index.js
```javascript
const dut = require('../build/Release/dut.node');
const {Sim, RisingEdge, FallingEdge, Interfaces} = require('signalflip-js');
const {Elastic} = Interfaces;
const _ = require('lodash');
const jsc = require("jsverify");
const assert = require('assert');
let range = n => Array.from(Array(n).keys());
const u = x => x >>> 0;
const model = (din_array) => {
	    let dout = [];
	    while(din_array.length > 0) {
		dout.push(din_array[0] << 2);
		din_array.shift();
	    }
	    return dout;
};

describe('Basic Group', function () {

    before(() => {
	
	;
    });

    it('Basic', (done) => {
	this.timeout(60000);

	let t = jsc.forall(jsc.constant(0), function () {
	    dut.init();

	    return new Promise(function(resolve, reject) {

		const clk = new Sim(dut, dut.eval, dut.clk);

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

		const target = new Elastic(clk, 0, dut.clk, dut.t0_data, dut.t0_valid, dut.t0_ready, null);
		const initiator = new Elastic(clk, 1, dut.clk, dut.i0_data, dut.i0_valid, dut.i0_ready, null);
		initiator.randomize = 0;
		target.randomize = 0;
		
		target.randomizeValid = ()=>{ return jsc.random(0,5); };
		initiator.randomizeReady = ()=>{ return jsc.random(0,5); };

		target.init();
		initiator.init();
		
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

		setImmediate(() => {try{

            clk.run(1000);
  
            resolve(true);
  
          }catch(e){reject(e)}});
        }); // promise
      }); // forall
  
      const props = {tests: 100}; // , rngState:"0084da9315c6bfe072"
      jsc.check(t, props).then( r => r === true ? done() : done(new Error(JSON.stringify(r))));
    }); // it


}); // describe
```

## Run the simulation
Any time the port definitions change for the top-level dut, the following command needs to be run to generate a new wrapper for the dut.
```
npm run gen
```
To run the the simulation
```
npm run all
```

To re-run the test without compiling the dut
```
npm run test
```

To build the dut
```
npm run build
```

To view the waveform
```
gtkwave logs/vlt_dump.vcd
```


NOTE: For this simulation we wrote a single test index.js. The next tutorial we go over how to create multiple tests using a test framework called mocha. This will enable regression testing and randomization using jsverify.
