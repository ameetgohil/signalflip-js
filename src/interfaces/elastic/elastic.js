const RisingEdge = require('../../Sim.js').RisingEdge;
const FallingEdge = require('../../Sim.js').FallingEdge;
const TARGET = 0;
const INITIATOR = 1;


function elastic(sim, type, clk, data, valid, ready, last = null) {
    this.TARGET = 0;
    this.INITIATOR = 1;

    this.txArray = [];
    this.rxArray = [];
    this.TYPE = type;
    this.data = data;
    this.valid = valid;
    this.ready = ready;
    this.sim = sim;
    this.randomize = 0;
    
    this.driver = function* () {
	///console.log('TYPE::: ', this.TYPE);
	if(this.TYPE == this.TARGET) {
	    console.log('TYPE:::', this.TYPE, 'RANDOMIZE::: ', this.randomize == 1 ? true:false);
	    while(true) {
		//console.log('start');
		yield* RisingEdge(clk);
		//console.log('here');
		valid(0);//this.txArray.length > 0 ? 1:0);
		yield () => { return this.txArray.length > 0; };
		let txn = this.txArray[0];
		this.txArray.shift();
		data(txn);
		if(this.randomize ) {
		    while(Math.round(Math.random()*15) != 0)
			yield* RisingEdge(clk);
		}
		valid(1);
		if (last != null)
		    last(this.txArray.length == 0 ? 1:0);
		while(ready() != 1) {
		    yield* FallingEdge(clk);
		}
	    }
	}
	else {
	    console.log('TYPE:::', this.TYPE, 'RANDOMIZE::: ', this.randomize == 1 ? true:false);
	    while(true) {
		if(this.randomize) {
		    ready(Math.round(Math.random()));
		} else {
		    ready(1);
		}
		//console.log('ready: ', ready());
		yield* RisingEdge(clk);
	    }
	}
    }

    this.monitor = function* () {
	while(true) {
	    yield* RisingEdge(clk);
	    if(valid() == 1 && ready() == 1)
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
