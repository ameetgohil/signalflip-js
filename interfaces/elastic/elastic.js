const TARGET = 0;
const INITIATOR = 1;


function elastic(sim, type, data, valid, ready) {
    this.TARGET = 0;
    this.INITIATOR = 1;

    this.txArray = [];
    this.rxArray = [];
    this.TYPE = this.TARGET;
    this.data = data;
    this.valid = valid;
    this.ready = ready;
    this.sim = sim;
    
    function* driver(intf) {
	console.log('type: ', intf.TYPE);
	if(this.TYPE == this.TARGET) {
	    while(true) {
		yield () => { console.log("here: ", this.txArray); return this.txArray.length > 0; };
		let txn = this.txArray[0];
		txArray.shift();
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

    function* monitor() {
	while(true) {
	    yield () => { return valid() == 1 && ready() == 1 };
	    this.rxArray.push(data());
	}
    }

    this.init = () => {
	this.txArray = [];
	this.rxArray = [];
	console.log('init: ',this.txArray.length, this.rxArray);
	this.sim.addTask(driver(this));
	this.sim.addTask(monitor(this));
    }
}

module.exports = elastic;
