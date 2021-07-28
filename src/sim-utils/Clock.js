const _ = require('lodash');
const Tick = require('./Tick');

function Clock(sig, halfPeriod) {
    this.enable = 1;
    //let enable 
    //this.timeToToggle = halfPeriod;
    this.clk = function* () {
	let delta = 0;
	let timeToToggle = halfPeriod;
	let value = false;
	sig(value ? 1:0);
	while(true) {
	    //for(i of _.range(halfPeriod)) {
		//console.log('post clock:---: ', delta, timeToToggle);
		delta = yield timeToToggle;
		//console.log(delta);
		timeToToggle -= delta
		//console.log('pre clock:---: ', delta, timeToToggle);
		
	    //}
	    if(timeToToggle == 0) {// && this.enable) {
		value = !value;
		sig(value ? 1:0);
		timeToToggle = halfPeriod;
		//console.log('RRRRRRRR', halfPeriod);
	    }
	}
    }
}

module.exports = Clock;

