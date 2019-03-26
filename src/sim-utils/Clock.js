const _ = require('lodash');
const Tick = require('./Tick');

function Clock(sig, halfPeriod) {
    this.enable = 1;
    this.clk = function* () {
	let value = false
	sig(value ? 1:0);
	while(true) {
	    for(i of _.range(halfPeriod)) {
		yield 0;
	    }
	    value = !value;
	    if(this.enable) {
		sig(value ? 1:0);
	    }
	}
    }
}

module.exports = Clock;
