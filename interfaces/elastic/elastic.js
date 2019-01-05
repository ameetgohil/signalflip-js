const RisingEdge = require('../../clock.js').RisingEdge;
const TARGET = 0;
const INITIATOR = 1;


function elastic(sim, type, clk, data, valid, ready) {
    this.TARGET = 0;
    this.INITIATOR = 1;

    this.txArray = [];
    this.rxArray = [];
    this.TYPE = type;
    this.data = data;
    this.valid = valid;
    this.ready = ready;
    this.sim = sim;
    
    this.driver = function* () {
	console.log('type: ', this.TYPE);
	if(this.TYPE == this.TARGET) {
	    while(true) {
		//console.log('start');
		yield* RisingEdge(clk);
		//console.log('here');
		yield () => { return this.txArray.length > 0; };
		let txn = this.txArray[0];
		this.txArray.shift();
		data(txn);
		valid(1);
		yield () => { return ready() };
		valid(this.txArray.length > 0 ? 1:0);
	    }
	}
	else {
	    ready(1);
	}
    }

    this.monitor = function* () {
	while(true) {
	    yield* RisingEdge(clk);
	    yield () => { return valid() == 1 && ready() == 1 };
	    this.rxArray.push(data());
	}
    }

    this.init = () => {
	this.txArray = [];
	this.rxArray = [];
	//console.log('init: ',this.txArray.length, this.rxArray);
	sim.addTask(this.driver());
	sim.addTask(this.monitor());
    }
}

module.exports = elastic;
