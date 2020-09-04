const RisingEdge = require('../../Sim.js').RisingEdge;
const RisingEdges = require('../../Sim.js').RisingEdges;
const FallingEdge = require('../../Sim.js').FallingEdge;
const _ = require('lodash');


function APB3(sim, pclk, presetn, psel, penable, paddr, pwrite, pwdata, prdata, pready, pslverr) {
    this.sim = sim;
    this.pclk = pclk;
    this.presetn = presetn;
    this.penable = penable;
    this.paddr = paddr;
    this.pwrite = pwrite;
    this.pwdata = prdata;
    this.prdata = prdata;
    this.pready = pready;
    this.pslverr = pslverr;

    this.dTxnArray = [];
    this.mTxnArray = [];
    

    this.reset = function* (resetCycles) {
	presetn(0);
	psel(0);
	penable(0);
	paddr(0);
	pwrite(0);
	yield* RisingEdges(pclk, resetCycles);
	presetn(1);
	yield* RisingEdge(pclk);
    }
    
    this.driver = function* () {
	yield* this.reset(5);
	while(true) {
	    yield* RisingEdge(pclk);
	    psel(0);
	    penable(0);
	    paddr(0);
	    pwrite(0);
	    yield () => { return this.dTxnArray.length > 0; }
	    //console.log("1");
	    let txn =  this.dTxnArray[0];
	    this.dTxnArray.shift();
	    psel(1);
	    penable(1);
	    paddr(txn.addr);
	    pwrite(txn.type == 'WRITE' ? 1:0);
	    pwdata(txn.type == 'WRITE' ? txn.wdata:0);
	    yield* FallingEdge(pclk);
	    //console.log(pready());
	    
	    while(pready() != 1)
		yield* FallingEdge(pclk);
	    //console.log("here");
	}

    }

    this.monitor = function* () {
	while(true) {
	    yield* FallingEdge(pclk);
	    if(psel() == 1 && penable() == 1 && pready() == 1) {
		this.mTxnArray.push({addr: paddr(), type: pwrite() == 1 ? 'WRITE':'READ', wdata: pwdata(), rdata: prdata()});
	    }
	}
    }


    this.init = () => {
	//pclk(0);
	presetn(1);
	psel(0);
	penable(0);
	paddr(0);
	pwrite(0);
	sim.addTask(this.driver());
	sim.addTask(this.monitor());
    }
}

module.exports = APB3;
