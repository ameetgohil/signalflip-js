const EventEmitter = require('events').EventEmitter;
const util = require('util');

function clock(dut, signal, eval) {
    EventEmitter.call(this);
    this.setMaxListeners(Infinity);
    this.signal = signal;
    
    this.tick  = () => { signal(signal() ? 0 : 1) };

    this.tasks = [];
    this.taskreturn = [];

    this.taskmanager = () => {
	this.tasks.forEach((task, i) => {
	    //	    console.log(task.next);
//	    console.log(this.taskreturn[i].done);
//	    console.log(this.taskreturn[i].value);
	    if(!this.taskreturn[i].done && this.taskreturn[i].value()) {
		
		this.taskreturn[i] = task.next();
	    }
	});
    };

    this.addTask = (task) => {
	let t = task();
	this.tasks.push(t);
	this.taskreturn.push(t.next());
    }
    
    this.run = (iter) => {
	for(i = 0; i < iter; i++) {

	    this.tick();
	    this.emit('tickevent', 'clockevent');
	    this.emit('posedge');
	    eval();
	    this.taskmanager();
	    this.tick();
	    this.emit('tickevent', 'clockevent');
	    this.emit('negedge');
	    eval();
	}
	console.log("finish");
	dut.finish();
    };

    this.posedge = () => {
	this.on('tickevent', () => {});
    };

};
util.inherits(clock, EventEmitter);

module.exports = clock;
