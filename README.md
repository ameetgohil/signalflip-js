[![npm version](https://badge.fury.io/js/signalflip-js.svg)](https://badge.fury.io/js/signalflip-js)
[![Build Status](https://travis-ci.com/ameetgohil/signalflip-js.svg?branch=master)](https://travis-ci.com/ameetgohil/signalflip-js)

# signalflip-js
verilator testbench w/ Javascript using N-API

## Dependencies
- [Verilator (version 4.0 or above)](https://www.veripool.org/projects/verilator/wiki/Installing)
- [nvm](https://github.com/creationix/nvm)
- cmake
- gtkwave (optional)

## Instructions to run
```
> git clone https://github.com/ameetgohil/create-signalflip-js-tb.git testbench_name && rm -rf testbench_name/.git
> cd testbench_name
> nvm use || nvm install
> npm i --ignore-scripts
> npm run gen
> npm run all
```
### Examples
[Basic testbench example](./BasicTestbench.md)

### Example sim init

The code below shows how to initialize dut and import useful functions such as RisingEdge, FallingEdge, Sim, and interfaces.
```javascript
const dut = require('./build/Release/dut.node');
const {Sim, RisingEdge, FallingEdge, Interfaces} = require('signalflip-js');
const {Elastic} = Interfaces;
const _ = require('lodash');


const sim = new Sim(dut, dut.eval, dut.clk); //dut.clk argument creates a clock on clk signal
dut.init();
```

### Access and manipulate signals
```javascript
const rdata = dut.t0_data(); //Reads data on t0_data signal
dut.t0_data(30); //Writes the value 30 to t0_data
```

### Example Task
```javascript
// Task reads t0_data when t0_valid is high on falling edge of the clock
function* read_t0_data() {
    yield* FallingEdge(dut.clk)
    if(dut.t0_valid() == 1)
        console.log('t0_data: ' + dut.t0_data());
}

sim.addTask(read_t0_data()); //initializes task
```

### Example Task waits until t0_data is equal to 64
```javascript
function* wait_for_64() {
    yield () => {return dut.t0_data == 64 };
    console.log('t0_data reached the value 64');
}

sim.addTask(wait_for64()); //initializes task
```

NOTE: function* means that it is a generator. yield* is used when you want to call another task within a task. yield is used when it you are calling a function that returns a boolean; yield will stop the task until that boolean condition is met.

### Run simulation
```javascript
sim.run(1000); // runs simulation for 1000 clock cycles
```

## Show graph
```
gtkwave logs/vlt_dump.vcd
```
