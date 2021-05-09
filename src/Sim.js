//const EventEmitter = require('events').EventEmitter;
//const util = require('util');
const _ = require('lodash');
const { Clock, Tick } = require('./sim-utils');

function* RisingEdge(sig) {
  //console.log('clk: ',sig());
  yield () => { return sig() == 0; };
  //console.log('clk: ',sig());
  yield () => { return sig() == 1; };
}

function* RisingEdges(sig, count) {
  for(let i of _.range(count)) {
    yield* RisingEdge(sig);
  }
}


function* FallingEdge(sig) {
  yield () => { return sig() == 1; };
  yield () => { return sig() == 0; };
}

function* FallingEdges(sig, count) {
  for(let i of _.range(count)) {
    yield* FallingEdge(sig);
  }
}

function* Edge(sig) {
  let val = sig();
  yield () => { return sig() != val; };
}

function* Edges(sig, count) {
  for(let i of _.range(count)) {
    yield* Edge(sig);
  }
}

function* Fork(tasks, join =  'JOIN', sim = null) {
  if(join != 'JOIN' && join != 'JOIN_ANY') {
    throw "fork should have value of 'JOIN' OR 'JOIN_ANY'";
  }
  let tasksReturn = [];
  tasks.forEach((task) => {
    //tasks();
    tasksReturn.push({done: false, value: () => { return true; }});
  });

  let done = false;
  while(!done) {
    if(join == 'JOIN') {
      done = true;
    } else {
      done = false;
    }
    tasks.forEach((task, i) => {
      /*if(i == 0) {
	console.log('i: ' + i);
	console.log(tasksReturn[i].done);
	console.log(tasksReturn[i].value());
      }*/
      while(!tasksReturn[i].done && tasksReturn[i].value()) {
	//console.log('next');
	tasksReturn[i] = task.next();
	//console.log(tasksReturn[i].value());
	/*if(taskReturn[i].done && join == 'JOIN_ANY') {
	  break;
	  }*/
      }
    });
    tasksReturn.forEach((tr) => {
      if(join == 'JOIN' && !tr.done) {
	done = false;
      }
      if(join == 'JOIN_ANY' && tr.done) {
	done = true;
      }
    });
    //console.log('done: ' + done);
    //yield () => { return done; };
    if(!done)
      yield* Tick();
    //console.log('passed tick');
  }
  if(join == 'JOIN_ANY') {
    tasks.forEach((task, i) => {
      if(!tasksReturn[i].done) {
	sim.forkTasks.push(task);
	sim.forkTasksReturn.push(tasksReturn[i]);
      }
    });
  }
}


function Sim(dut) {

  this.phase = null;

  this.phases = ['PRE_RUN', 'RESET', 'RUN', 'POST_RUN'];

    this.time = 0;
    this.deltaTime = 1;
    this.nextDeltaTime = 1;
    
    
  this.clocks = [];
  
  this.addClock = (clock) => {
    this.clocks.push(clock.clk());
  };

    this.clockmanager = () => {
	/*let minTimeAdv = this.clocks[0].timeToToggle;
	for(let clock of this.clocks) {
	    if(minTimeAdv > this.clocks[0].timeToToggle)
		minTimeAdv = clock.timeTopToggle;
		}*/
	let delta = 0;//this.clocks[0].timeToToggle;
	this.clocks.forEach((clock, i) => {
	    //console.log('Clock: ' + i);
	    clockRetVal = clock.next(this.nextDeltaTime);
	    if(i == 0) {
		delta = clockRetVal.value;
		//console.log('i == 0', delta);
	    }
	    
	    //console.log(delta);
	    delta = Math.min(clockRetVal.value, delta);
	 
	});
	this.deltaTime = this.nextDeltaTime;
	this.nextDeltaTime = delta;
  };

  this.forkTasks = [];
  this.forkTasksReturn = [];
  
  this.tasksPhase = [];
  this.tasks = [];
  this.taskreturn = [];

  this.finishTasks = [];

  this.preTasks = [];
  this.preTasksPhase = [];

  this.postTasks = [];
  this.postTasksPhase = [];
  
  this.taskmanager = () => {
    let phase_complete = true;
    this.tasks.forEach((task, i) => {
      //	    console.log(task.next);
      //console.log(this.taskreturn[i].done);
      //console.log(this.taskreturn[i].value);
      if(this.tasksPhase[i] == this.phase) {
	//console.log('here');
	//let d = !this.taskreturn[i].done;
	//let val = this.taskreturn[i].value();
	while(!this.taskreturn[i].done && this.taskreturn[i].value()) {
	  //if(!this.taskreturn[i].done && this.taskreturn[i].value()) {
	    //console.log('----------------');
	    //console.log(this.taskreturn[i].value());
	    //console.log(this.taskreturn[i].value);
	    //console.log(this.taskreturn[i].done);
	    //console.log('----------------');
	    this.taskreturn[i] = task.next();
	  //}
	}

	if(!this.taskreturn[i].done) {
	  phase_complete = false;
	}
      }
    });
    if(phase_complete && !this.phases[this.phase+1].startsWith('POST_')) {
      this.phase++;
    }
    // append orphaned tasks from 'JOIN_ANY' fork
    if(this.forkTasks.length > 0) {
      //console.log('forktask length: ' + this.forkTasks.length);
      this.forkTasks.forEach((task, i) => {
	this.tasks.push(task);
	this.taskreturn.push(this.forkTasksReturn[i]);
	this.tasksPhase.push(this.phase);
      });
      this.forkTasks = [];
      this.forkTasksReturn = [];
    }
  };

  this.addTask = (task, phase = 'RUN') => {
    if(phase.startsWith('PRE_')) {
      if(typeof task != 'function') {
	throw "PRE_ task needs to be a function (NOT a generator). If it is a function, make sure the function is not already called and passed into addTask with ()";
      }
      this.preTasks.push(task);
      this.preTasksPhase.push(this.phases.indexOf(phase));
    } else if(phase.startsWith('POST_')) {
      if(typeof task != 'function') {
	throw "POST_ task needs to be a function (NOT a generator). If it is a function, make sure the function is not already called and passed into addTask with ()";
      }
      this.postTasks.push(task);
      this.postTasksPhase.push(this.phases.indexOf(phase));
    } else {
      this.tasks.push(task);
      this.taskreturn.push({done: false, value: () => { return true; }});//task.next());
      this.tasksPhase.push(this.phases.indexOf(phase));
    }
  };
  
  this.finishTask = (task) => {
    //console.log(task);
    this.finishTasks.push(task);
  };
  

  this.preTaskManager = () => {
    this.phases.forEach((phase) => {
      //console.log(phase);
      if(phase.startsWith('PRE_')) {
	this.phase++;
	this.preTasks.forEach((task,i) => {
	  if(preTasksPhase[i] == phase) {
	    task();
	  }
	});
      }
    });
    //this.phase++;
    //console.log(this.phase);
  };
  
  this.tick = () => {
    if(this.phase != null) {
      this.clockmanager();
	this.time += this.deltaTime;//++;
	//console.log(this.deltaTime, this.time);
      dut.eval(this.time);
      this.taskmanager();
    } else {
      this.phase = 0;
      this.preTaskManager();
    }
  };
  
  this.run = (iter, finish = true) => {
    for(let i = 0; i < iter; i++) {
      this.tick();
    }
    if(finish) {
      this.phase++;
      this.finish();
    }
  };

  this.runUntil = (condition) => {
    while(!condition()) {
      this.tick();
    }
  };

  this.finish = () => {
    this.finishTasks.forEach((task) => {
      task();
    });
    while(this.phase < this.phases.length) {
      this.postTasks.forEach((task,i) => {
	//console.log(this.postTasksPhases[i]
	if(this.phase == this.postTasksPhase[i]) {
	  task();
	}
      });
      this.phase++;
    }
    dut.finish();
  };

};

module.exports = {RisingEdge, RisingEdges, FallingEdge, FallingEdges, Edge, Edges, Fork, Sim};
