function PublishPort() {
    this.subscriberCBs = [];
    this.connect = (cb) => {
	this.SubscriberCBs.push(cb);
    }

    this.publish = (txn) => {
	for(let cb of this.subscriberCBs) {
	    cb(txn);
	}
    }
}

module.exports = {PublishPort};
