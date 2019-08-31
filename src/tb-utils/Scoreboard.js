function Scoreboard() {
    this.exp = [];
    
    this.act_write = (txn) => {
	if(txn != this.exp[0]) {
	    console.log('Acutal:');
	    console.log(txn);
	    console.log('Expected:');
	    console.log(this.exp[0]);
	}
	this.exp.shift();
    }

    this.exp_write = (txn) => {
	this.exp.push(txn);
    }

}

	
