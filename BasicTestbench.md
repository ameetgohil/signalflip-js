# Basic Testbench Tutorial
This tutorial goes over how to setup a signalflip testbench for a counter. <br />
First you need to install the prerequisites <br />
- [Verilator (4.0 or above)](https://www.veripool.org/projects/verilator/wiki/Installing) <br />
- [nvm (node)](https://github.com/creationix/nvm) <br />
- cmake
- gtkwave (for viewing waveforms) <br />
	
## Setup a testbench template
```
git clone https://github.com/ameetgohil/create-signalflip-js-tb.git counter_tb && rm -rf counter_tb/.git
cd counter_tb
nvm use || nvm install
npm i --ignore-scripts
```

## Create the counter.sv file
The counter.sv file can saved anywhere, but for this tutorial, we will create a new folder called verilogsrc and save it there (counter_tb->verilogsrc->counter.sv)
```systemverilog
module counter
  (input wire en,
   output reg [7:0] count,
   input            clk, rstf
   );

   always @(posedge clk or negedge rstf) begin
      if(~rstf)
        count <= 0;
      else
        if(en)
          count <= count + 1;
   end
endmodule
```

## Modify config.json
Point to the .sv file you want simulate and set dut name.
```json
    "dut_file": "./verilogsrc/counter.sv",
    "dut_name": "counter",
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
const {Sim, RisingEdge, FallingEdge} = require('signalflip-js');
//A nice to have utililty to deal with arrays
const _ = require('lodash');
```
Initialize the simulation
```javascript
//first two arguments are standard to pass dut instance and a function to advance time
// the dut.clk argument is a way to generate a clock on the dut.clk signal
const sim = new Sim(dut, dut.eval, dut.clk); 
```

Initialize input signals
```javascript
dut.rstf(1); 
dut.en(0);
```

Create task to drive rstf and en
```javascript
function* DriveSignals() {
	//reset for 10 clock cycles
	for(let i=0; i<10; i++) {
		yield* FallingEdge(clk);
	}
	dut.rstf(0);
	dut.en(1); //enable counter
	// wait for 32 clock cycles
	for(let i=0; i < 32; i++) {
		yield* RisingEdge(clk);
	}
	dut.en(0); //disable counter
}

//Initializes and runs task
sim.addTask(DriveSignals());
```

Run simulation for 100 clock cyles
```javascript
sim.run(100);
```

Final index.js
```javascript
//imports dut that was compiled with verilator wrapped with N-API. All top level signals are accessible via this import
const dut = require('./build/Release/dut.node');
//Sim manages tasks and advances time
//RisingEdge/FallingEdge - wait under rising/falling edge detect on a given signal
const {Sim, RisingEdge, FallingEdge} = require('signalflip-js');
//A nice to have utililty to deal with arrays
const _ = require('lodash';

//first two arguments are standard to pass dut instance and a function to advance time
// the dut.clk argument is a way to generate a clock on the dut.clk signal
const sim = new Sim(dut, dut.eval, dut.clk); 

dut.rstf(1); 
dut.en(0);

function* DriveSignals() {
	//reset for 10 clock cycles
	for(let i=0; i<10; i++) {
		yield* FallingEdge(clk);
	}
	dut.rstf(0);
	dut.en(1); //enable counter
	// wait for 32 clock cycles
	for(let i=0; i < 32; i++) {
		yield* RisingEdge(clk);
	}
	dut.en(0); //disable counter
}

//Initializes and runs task
sim.addTask(DriveSignals());

sim.run(100);
```

## Modify package.json
Since we haven't developed the test using mocha(we will do so in the next tutorial), package.json needs to modified to run index.js and not mocha. Search for "all" and modify that line as shown below
```json
	"all": "npm run compile && npm run build && npm run test"
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
