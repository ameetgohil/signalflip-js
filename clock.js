const EventEmitter = require('events').EventEmitter;
const util = require('util');

function clock(signal) {
    EventEmitter.call(this);
    this.setMaxListeners(Infinity);
    this.signal = signal;
    
    this.tick  = () => { signal(signal() ? 0 : 1) };

    this.run = (iter) => {
	for(i = 0; i < iter; i++) {
	    this.tick();
	    this.emit('tickevent', 'clockevent');
	}
    };
}

util.inherits(clock, EventEmitter);

//clock

module.exports = clock;
