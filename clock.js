const EventEmitter = require('events').EventEmitter;
const util = require('util');

function clock(signal, eval) {
    EventEmitter.call(this);
    this.setMaxListeners(Infinity);
    this.signal = signal;
    
    this.tick  = () => { signal(signal() ? 0 : 1) };

    this.run = (iter) => {
	for(i = 0; i < iter; i++) {
	    this.tick();
	    this.emit('tickevent', 'clockevent');
	    this.emit('posedge');
	    eval();
	    this.tick();
	    this.emit('tickevent', 'clockevent');
	    this.emit('negedge');
	    eval();
	}
	
    };

    this.posedge = () => {
	this.on('tickevent', () => {});
    };

};
util.inherits(clock, EventEmitter);

module.exports = clock;
