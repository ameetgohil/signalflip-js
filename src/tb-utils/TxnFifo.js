function TxnFifo() {
    this.fifo = [];
    this.write = (txn) => { this.txnFifo.push(txn) };
}

modules.exports = {TxnFifo};
