const dut = require('../build/Release/dut.node');
const {Sim, SimUtils, RisingEdge, RisingEdges, FallingEdge, FallingEdges, Interfaces, Fork} = require('../');
const { Clock, Intf } = SimUtils;
const {Elastic} = Interfaces;
const _ = require('lodash');
const jsc = require('jsverify');
const assert = require('assert');

let sim;
let target, initiator;

describe('Fork', () => {
  let setup = (name) => {
    // set up the environment
    dut.init(name); // Init dut
    sim = new Sim(dut);

    // TODO: Create clock
    let clk = new Clock(dut.clk, 1);
    sim.addClock(clk);

  };
  
  it('Fork - JOIN', function () {
    this.timeout(6000);
    setup('fork_join');
    let task1_val = false;
    let task2_val = false;
    let task_parent_val = false;
    function* fork_task1() {
      let i = 0;
      //console.log(i);
      i++;
      //console.log(dut.clk());
      yield* RisingEdges(dut.clk, 10);
      //console.log('task1 complete');
      task1_val = true;
    }
    function* fork_task2() {
      yield* RisingEdges(dut.clk, 20);
      //console.log('task2 complete');
      task2_val = true;
    }
    sim.addTask(function* () {
      //Fork([fork_task1(), fork_task2()], 'JOIN', sim);
      yield* Fork([fork_task1(), fork_task2()], 'JOIN', sim);
      task_parent_val = true;
    }());

    sim.addTask(function () {
      //console.log('Checker');
      //console.log(task1_val);
      //console.log(task2_val);
      //console.log(task_parent_val);
      try {
	assert(task1_val && task2_val && task_parent_val);
      } catch(e) {
	dut.finish();
	throw(e);
      }
    }, 'POST_RUN');
      
    sim.run(100);
  });

  it('Fork - JOIN Incomplete', function () {
    this.timeout(6000);
    setup('fork_join_incomplete');
    let task1_val = false;
    let task2_val = false;
    let task_parent_val = false;
    function* fork_task1() {
      let i = 0;
      //console.log(i);
      i++;
      //console.log(dut.clk());
      yield* RisingEdges(dut.clk, 10);
      //console.log('task1 complete');
      task1_val = true;
    }
    function* fork_task2() {
      yield* RisingEdges(dut.clk, 300);
      //console.log('task2 complete');
      task2_val = true;
    }
    sim.addTask(function* () {
      //Fork([fork_task1(), fork_task2()], 'JOIN', sim);
      yield* Fork([fork_task1(), fork_task2()], 'JOIN', sim);
      task_parent_val = true;
    }());

    sim.addTask(function () {
      //console.log('Checker 2');
      //console.log(task1_val);
      //console.log(task2_val);
      //console.log(task_parent_val);
      try {
	assert(task1_val && !task2_val && !task_parent_val);
      } catch(e) {
	dut.finish();
	throw(e);
      }
    }, 'POST_RUN');
      
    sim.run(100);
  });

  it('Fork - JOIN ANY', function () {
    this.timeout(6000);
    setup('fork_join_any');
    let task1_val = false;
    let task2_val = false;
    let task_parent_val = false;
    function* fork_task1() {
      let i = 0;
      //console.log(i);
      i++;
      //console.log(dut.clk());
      yield* RisingEdges(dut.clk, 10);
      //console.log('task1 complete');
      task1_val = true;
    }
    function* fork_task2() {
      yield* RisingEdges(dut.clk, 20);
      //console.log('task2 complete');
      task2_val = true;
    }
    sim.addTask(function* () {
      //Fork([fork_task1(), fork_task2()], 'JOIN', sim);
      yield* Fork([fork_task1(), fork_task2()], 'JOIN_ANY', sim);
      task_parent_val = true;
    }());

    sim.addTask(function () {
      //console.log('Checker 3');
      //console.log(task1_val);
      //console.log(task2_val);
      //console.log(task_parent_val);
      try {
	assert(task1_val && task2_val && task_parent_val);
      } catch(e) {
	dut.finish();
	throw(e);
      }
    }, 'POST_RUN');
      
    sim.run(100);
  });

  it('Fork - JOIN ANY Incomplete', function () {
    this.timeout(6000);
    setup('fork_join_any_incomplete');
    let task1_val = false;
    let task2_val = false;
    let task_parent_val = false;
    function* fork_task1() {
      let i = 0;
      //console.log(i);
      i++;
      //console.log(dut.clk());
      yield* RisingEdges(dut.clk, 10);
      //console.log('task1 complete');
      task1_val = true;
    }
    function* fork_task2() {
      //yield* RisingEdges(dut.clk, 400);
      for(let i of _.range(300)) {
	yield* RisingEdge(dut.clk);
	//console.log(i);
	dut.rstf(dut.rstf() == 1 ? 0:1);
      }
      console.log('task2 complete');
      task2_val = true;
    }
    sim.addTask(function* () {
      //Fork([fork_task1(), fork_task2()], 'JOIN', sim);
      yield* Fork([fork_task1(), fork_task2()], 'JOIN_ANY', sim);
      task_parent_val = true;
    }());

    sim.addTask(function () {
      //console.log('Checker 4');
      //console.log(task1_val);
      //console.log(task2_val);
      //console.log(task_parent_val);
      try {
	assert(task1_val && !task2_val && task_parent_val);
      } catch(e) {
	dut.finish();
	throw(e);
      }
    }, 'POST_RUN');
      
    sim.run(100);
  });
  
});

