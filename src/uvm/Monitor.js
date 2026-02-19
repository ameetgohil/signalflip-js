const Component = require('./Component');

class Monitor extends Component {
    constructor(name, parent, intf) {
        super(name, parent);
        this.intf = intf;
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    publish(tr) {
        this.listeners.forEach(cb => cb(tr));
    }

    *run() {
        this.log('Starting monitor loop...');
        // Monitor loop implementation depends on the specific protocol
        // yield* RisingEdge(this.intf.clk);
    }
}

module.exports = Monitor;
