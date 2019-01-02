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

    this.init = () => {
	sim.addTask(this.driver);
	sim.addTask(this.monitor);
    }
    this.driver = function* {
	if(this.TYPE == this.TARGET) {
	    while(true) {
		yield () => { return this.txn.length > 0 };
		let txn = txArray[0];
		txArray.shift();
		data(txn);
		valid(1);
		yield () => { return ready() };
		valid(this.txn.length > 0 ? 1:0);
	    }
	}
	else {
	    ready(1);
	}
    }

    this.monitor = function* {
	while(true) {
	    yield () => { return valid() == 1 && ready() == 1 };
	    rxArray.push(data());
	}
    }
}

module.exports = elastic;
