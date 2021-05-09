const RisingEdge = require('../../Sim.js').RisingEdge;
const FallingEdge = require('../../Sim.js').FallingEdge;
const TARGET = 0;
const INITIATOR = 1;


function elastic(sim, type, clk, data, valid, ready, last = null, bigint = false) {
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
    this.print = false;
    this.randomizeValid = ()=>{ return Math.round(Math.random()*15) };
    this.randomizeReady = ()=>{ return Math.round(Math.random()) };
    
    this.driver = function* () {
	///console.log('TYPE::: ', this.TYPE);
	if(this.TYPE == this.TARGET) {
	    if(this.print) {
            console.log('TYPE:::', this.TYPE, 'RANDOMIZE::: ', this.randomize == 1 ? true:false);
        }
	    while(true) {
		//console.log(sim.time + ' start');
		yield* RisingEdge(clk);
		valid(0);//this.txArray.length > 0 ? 1:0);
		yield () => { return this.txArray.length > 0; };
//		console.log(this.txArray);
		//console.log('here');
		let txn = this.txArray[0];
		this.txArray.shift();
		data(txn.data);
		if( this.randomize ) {
		    while(this.randomizeValid() != 0)
			yield* RisingEdge(clk);
		}
		valid(1);
		if ( last != null )
		    last(txn.isLast ? 1:0) //this.txArray.length == 0 ? 1:0);
		yield* FallingEdge(clk);
		while( ready() != 1 ) {
		    yield* FallingEdge(clk);
		}
	    }
	}
	else {
        if( this.print ) {
    	    console.log('TYPE:::', this.TYPE, 'RANDOMIZE::: ', this.randomize == 1 ? true:false);
        }
	    ready(0);
	    yield* RisingEdge(clk);
	    while(true) {
		if(this.randomize) {
		    ready(this.randomizeReady() ? 1:0);
		} else {
		    ready(1);
		}
		yield* RisingEdge(clk);
		//console.log('ready: ', ready());
	    }
	}
    }

    this.monitor = function* () {
	while(true) {
	    yield* FallingEdge(clk);
	    if(valid() == 1 && ready() == 1) {
		if(this.print) {
		    console.log("Time: " + sim.time +  " Data: " + data());
		}
		this.rxArray.push({data: data(), isLast: last == null ? false:last() ? true:false});
	    }
	}
    }

    this.init = () => {
	//this.txArray = [];
	//this.rxArray = [];
      //console.log('init: ',this.txArray.length, this.rxArray);
        if(this.TYPE == this.TARGET) {
            if(bigint) {
	              data(0n);
            } else {
                data(0);
            }
	valid(0);
      } else {
	ready(0);
      }
	sim.addTask(this.driver());
	sim.addTask(this.monitor());
    }
}

module.exports = elastic;

