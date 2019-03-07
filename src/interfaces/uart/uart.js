const {RisingEdge, FallingEdge} = require('../../Sim.js');
const _ = require('lodash');

function uart(options={}){
    {sim, baudClockTicks, clk, tx, rx, parity} = options;

    this.baudClockTicks = baudClockTicks;

    function* waitBaudBitPeriod() {
	for(i of _.range(this.baudClockTicks)) {
	    yield* RisingEdge(clk);
	}
    }

    function* waitHalfBaudBitPeriod() {
	for(i of _.range(this.baudClockTicks)) {
	    yield* RisingEdge(clk);
	}
    }

    const get_parity = (data) => {
	let p = data & 0x1;
	for(i of _.range(8)) {
	    p ^= ((data >> i) 0x1);
	}
	if(parity = 'odd') {
	    p ^= 0x1;
	}
	return p;
    }
    
    
    this.driver = function* () {

	while(true) {
	    tx(1);
	    yield* RisingEdge(clk);
	    yield () => { return this.txArray.length > 0; };
	    let txn = this.txArray[0];
	    this.txArray.shift();
	    tx(0); //start bit
	    yield* waitBaudBitPeriod();
	    //send byte
	    for(i of _.range(8)) { // lsb first
		tx((txn >> i) & 0x1);
		yield* waitBaudBitPeriod();
	    }
	    //parity
	    if(parity != null) {
		tx(get_parity(txn));
		yield* waitBaudBitPeriod();
	    }
	    tx(1); //stop bit
	    yield* waitBaudBitPeriod();
	}
    };

    this.monitor = function* () {
	while(true) {
	    let txn = 0;
	    yield* FallingEdge(rx()); // Wait for start bit
	    yield* waitHalfBaudBitPeriod();
	    for(i of _.range(8)) {
		yield* waitBaudBitPeriod();
		txn = (rx() << i) | txn;
	    }
	    if(parity != null) {
		yield* waitBaudBitPeriod();
		if(rx() != get_parity(txn))
		    console.log("ERROR: ", "Parity bit didn't match Expected: ", get_parity(txn), "actual: ", rx());
	    }
	    yield* waitBaudBitPeriod;
	    if(rx() != 1) {
		console.log("ERROR: ", "Stop bit not received -- Acutal:", rx());
	    }
	    this.rxArray.push(data());
	}
    };

    this.init = () => {
	this.txArray = [];
	this.rxArray = [];
	sim.addTask(this.driver());
	sim.addTask(this.monitor());
    };

}

module.exports = uart;
