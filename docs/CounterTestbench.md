# Counter Testbench Tutorial
This tutorial goes over how to setup a signalflip testbench for a counter. <br />
First you need to install the prerequisites <br />
- [Verilator (4.0 or above)](https://www.veripool.org/projects/verilator/wiki/Installing) <br />
- [nvm (node)](https://github.com/creationix/nvm) <br />
- cmake
- gtkwave (for viewing waveforms) <br />

Implemented tutorial for reference https://github.com/ameetgohil/basic-signalflip-example
	
## Setup a testbench template
```
> git clone https://github.com/ameetgohil/create-signalflip-js-tb.git counter-signalflip && rm -rf counter-signalflip/.git
> cd counter-signalflip
> nvm use || nvm install
> npm i
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
Add the following to sim/basic.js import useful functions such as RisingEdge, FallingEdge, Sim, ...
```javascript
//imports dut that was compiled with verilator wrapped with N-API. All top level signals are accessible via this import
const dut = require('../build/Release/dut.node');
//Sim manages tasks and advances time
//RisingEdge/FallingEdge - wait under rising/falling edge detect on a given signal
const {Sim, SimUtils, RisingEdge, RisingEdges, FallingEdge, FallingEdges, Edge, Edges, Interfaces} = require('signalflip-js');
const { Clock, Intf } = SimUtils;
//A nice to have utililty to deal with arrays
const _ = require('lodash');
```
Initialize the simulation
```javascript
//set up the environment
let sim;

//set up the environment
let sim;

describe('Test', () => {
	let setup = (name) => {
		dut.init(name); // Init dut	
		const sim = new Sim(dut); 
	};
});
```

Initialize input signals and create clock
```javascript
describe('Test', () => {
	let setup = (name) => {
		dut.init(name); // Init dut	
		const sim = new Sim(dut); 
		
		//Create Clock
		let clk = new Clockk(dut.clk, 1);
		sim.addClock(clk);
	
		// Initialize input signals
		dut.rstf(1); 
		dut.en(0);
	};
});
```

Add reset task
```javascript
describe('Test', () => {
	let setup = (name) => {
		dut.init(name); // Init dut	
		const sim = new Sim(dut); 
		
		//Create Clock
		let clk = new Clockk(dut.clk, 1);
		sim.addClock(clk);
	
		// Initialize input signals
		dut.rstf(1); 
		dut.en(0);

	    // RESET task -- assert reset for 5 clock cycles
		sim.addTask(function* () {
			dut.rstf(0);
			yield* RisingEdges(dut.clk, 5);
			dut.rstf(1);
			yield* RisingEdge(dut.clk);
			}(), 'RESET');
	};
});
```

Create test wher en is enabled for 10 clock cycles and disabled after that
```javascript
describe('Test', () => {
  let setup = (name) => {
    // set up the environment
    dut.init(name); // Init dut
    sim = new Sim(dut);

    // TODO: Create clock
    let clk = new Clock(dut.clk, 1)
    sim.addClock(clk)

    // Init input signals
    dut.rstf(0);
    dut.en(0);
    
    // RESET task -- assert reset for 5 clock cycles
    sim.addTask(function* () {
      dut.rstf(0);
      yield* RisingEdges(dut.clk, 5);
      dut.rstf(1);
      yield* RisingEdge(dut.clk);
    }(), 'RESET');

    // TODO: Add post_run tasks (test checking)
    // sim.addTask(() => { /* post_run function */}, 'POST_RUN'});

  };
  it('Test 1', function () {
    this.timeout(10000); // Set timeout to expected run time of the test in ms
    setup('top_test1');
    function* drive() {
      dut.en(1);
      yield* RisingEdges(dut.clk, 10);
      dut.en(0);
    }
    sim.addTask(drive());
    // Run simulation for 50 ticks
    sim.run(50); //run for 50 ticks
  });
});
```

## Run the simulation
To run through all the steps - generate wrapper, build N-API, and run test
```
make
```
Any time the port definitions change for the top-level dut, the following command needs to be run to generate a new wrapper for the dut.
```
make verilate lib gen
```
To build N-API wrapper
```
make build
```
To run the the simulation
```
make test
```
To view the waveform
```
gtkwave logs/top_test1.vcd
```

NOTE: For this simulation we wrote a single test sim/basic.js using mocha. The next tutorial we will enable regression testing and randomization using jsverify.

## Add a second test

```javascript
//imports dut that was compiled with verilator wrapped with N-API. All top level signals are accessible via this import
const dut = require('../build/Release/dut.node');
//Sim manages tasks and advances time
//RisingEdge/FallingEdge - wait under rising/falling edge detect on a given signal
const {Sim, SimUtils, RisingEdge, RisingEdges, FallingEdge, FallingEdges, Edge, Edges, Interfaces} = require('signalflip-js');
const { Clock, Intf } = SimUtils;
//A nice to have utililty to deal with arrays
const _ = require('lodash');

let sim;

describe('Test', () => {
  let setup = (name) => {
    // set up the environment
    dut.init(name); // Init dut
    sim = new Sim(dut);

    // TODO: Create clock
    let clk = new Clock(dut.clk, 1)
    sim.addClock(clk)

    // Init input signals
    dut.rstf(0);
    dut.en(0);
    
    // RESET task -- assert reset for 5 clock cycles
    sim.addTask(function* () {
      dut.rstf(0);
      yield* RisingEdges(dut.clk, 5);
      dut.rstf(1);
      yield* RisingEdge(dut.clk);
    }(), 'RESET');

    // TODO: Add post_run tasks (test checking)
    // sim.addTask(() => { /* post_run function */}, 'POST_RUN'});

  };
  it('Test 1', function () {
    this.timeout(10000); // Set timeout to expected run time of the test in ms
    setup('top_test1');
    function* drive() {
      dut.en(1);
      yield* RisingEdges(dut.clk, 10);
      dut.en(0);
    }
    sim.addTask(drive());
    // Run simulation for 50 ticks
    sim.run(50); //run for 50 ticks
  });

  it('Test 2', function () {
    this.timeout(10000);
    setup('top_test2');
    function* drive() {
      dut.en(1);
      yield* RisingEdges(dut.clk, 5);
      dut.en(0);
      yield* RisingEdges(dut.clk, 5);
      dut.en(1);
    }
    sim.addTask(drive());
    // Run simulaltion for 50 ticks
    sim.run(50); //run for 50 ticks
  });
});

```

Run the simulation
```bash
make
```

Inspect waveform for Test 1
```bash
gtkwave logs/top_test1.vcd
```

Inspect waveform for Test 2
```bash
gtkwave logs/top_test2.vcd
```
