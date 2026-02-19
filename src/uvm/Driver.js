const Component = require('./Component');
const { RisingEdge } = require('../Sim');

class Driver extends Component {
    constructor(name, parent, intf) {
        super(name, parent);
        this.intf = intf;
        this.reqQ = [];
        this.rspQ = [];
    }

    *run() {
        this.log('Starting driver loop...');
        while (true) {
            const tr = this.getNextItem(); // synchronous for now or need a way to wait
            if (tr) {
                yield* this.drive(tr);
            } else {
                yield* RisingEdge(this.intf.clk); // Wait for clock if no item
                // break; 
            }
        }
    }

    getNextItem() {
        return this.reqQ.shift();
    }

    *drive(tr) {
        throw new Error("drive() must be implemented by subclass");
    }
}

module.exports = Driver;
