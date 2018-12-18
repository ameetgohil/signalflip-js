const EventEmitter = require('events');

function clock(signal) {
    this.signal = signal;
    
    this.tick  = () => { signal() ? 0 : 1 };

    this.run = () => {
    };
}



module.exports = clock;
