//const EventEmitter = require('events').EventEmitter;
//const util = require('util');
const _ = require('lodash');
const { Clock, Tick } = require('./sim-utils');

function* RisingEdge(sig) {
    //console.log('clk: ',sig());
    yield () => { return sig() == 0 };
    //console.log('clk: ',sig());
    yield () => { return sig() == 1 };
}

function* RisingEdges(sig, count) {
    for(let i of _.range(count)) {
	yield* RisingEdge(sig);
    }
}
    

function* FallingEdge(sig) {
    yield () => { return sig() == 1 };
    yield () => { return sig() == 0 };
}

function* FallingEdges(sig, count) {
    for(let i of _.range(count)) {
	yield* FallingEdge(sig);
    }
}

function* Fork(tasks) {
    
}


function Sim(dut, eval) { 

    this.clocks = [];
    
    this.addClock = (clock) => {
	this.clocks.push(clock.clk());
    };

    this.clockmanager = () => {
	this.clocks.forEach((clock, i) => {
	    clock.next();
	});
    };
    
    this.tasks = [];
    this.taskreturn = [];

    this.finishTasks = [];

    
    this.taskmanager = () => {
	this.tasks.forEach((task, i) => {
	    //	    console.log(task.next);
//	    console.log(this.taskreturn[i].done);
	    //	    console.log(this.taskreturn[i].value);
	    while(!this.taskreturn[i].done && this.taskreturn[i].value()) {
		if(!this.taskreturn[i].done && this.taskreturn[i].value()) {
		    //console.log('----------------');
		    //console.log(this.taskreturn[i].value());
		    //console.log(this.taskreturn[i].value);
		    //console.log(this.taskreturn[i].done);
		    //console.log('----------------');
		this.taskreturn[i] = task.next();
	    }
	}
	});
    };

    this.addTask = (task) => {
	//console.log(task);
	//let t = task();
	this.tasks.push(task);
	this.taskreturn.push(task.next());
    }

    this.finishTask = (task) => {
	//console.log(task);
	this.finishTasks.push(task);
    }
    
    this.time = 0;

    this.tick = () => {
	this.clockmanager();
	eval();
	this.time++;
	this.taskmanager();
    }
    
    this.run = (iter, finish = true) => {
	for(let i = 0; i < iter; i++) {
	    this.tick();
	}
	this.finish();
    };

    this.runUntil = (condition) => {
	while(!condition()) {
	    this.tick();
	}
    }

    this.finish = () => {
	this.finishTasks.forEach((task) => {
	    task();
	});
	dut.finish();
    };

};

module.exports = {RisingEdge, RisingEdges, FallingEdge, FallingEdges, Sim};
