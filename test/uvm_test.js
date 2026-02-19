const dut = require('../build/Release/dut.node');
const { Sim, SimUtils, RisingEdge, FallingEdge } = require('../');
const { Clock } = SimUtils;
const { createBundles } = require('../src/sim-utils/Bundle');
const Driver = require('../src/uvm/Driver');
const Monitor = require('../src/uvm/Monitor');
const assert = require('assert');

// 1. Define Protocol-Specific Driver/Monitor
class ElasticDriver extends Driver {
    constructor(name, parent, intf) {
        super(name, parent, intf);
    }

    *drive(tr) {
        // Drive data
        this.intf.data(tr.data);
        this.intf.valid(1);

        while (true) {
            yield* RisingEdge(this.intf.clk);
            if (this.intf.ready() === 1) break;
        }

        // Handshake done at Rising Edge.
        // Wait for FallingEdge to drop signals, to ensure Monitors see it
        // and to simulate hold time.
        yield* FallingEdge(this.intf.clk);
        this.intf.valid(0);
    }
}

class ElasticMonitor extends Monitor {
    *run() {
        this.log('Monitor active');
        while (true) {
            yield* RisingEdge(this.intf.clk);
            if (this.intf.valid() === 1 && this.intf.ready() === 1) {
                const tr = { data: this.intf.data() };
                this.publish(tr);
                this.log(`Monitored: ${tr.data}`);
            }
        }
    }
}

// 2. Setup Test
dut.init("uvm_test");
createBundles(dut);
const sim = new Sim(dut);
const clk = new Clock(dut.clk, 1);
sim.addClock(clk);

// 3. Instantiate Components
const env = {};
env.driver = new ElasticDriver('drv', null, {
    clk: dut.clk,
    data: dut.t0.data,
    valid: dut.t0.valid,
    ready: dut.t0.ready
});

env.monitor = new ElasticMonitor('mon', null, {
    clk: dut.clk,
    data: dut.t0.data,
    valid: dut.t0.valid,
    ready: dut.t0.ready
});

// 4. Drive stimulus
env.driver.reqQ.push({ data: 0xDEADBEEF });
env.driver.reqQ.push({ data: 0xCAFEBABE });

// 5. Connect Monitor
const monitoredData = [];
env.monitor.subscribe(tr => monitoredData.push(tr));

// 6. Run
sim.addTask(function* () {
    dut.rstf(0);
    yield* RisingEdge(dut.clk);
    dut.rstf(1);

    // dut.t0.ready(1); // t0_ready is an output from DUT
    dut.i0.ready(1); // Drain the egress so ingress can flow

    // Fork driver and monitor
    // In strict UVM these would be in their run_phase.
    // Here we manually add their tasks to Sim.

    // We can use Sim.addTask for the generators
}.call(), 'RESET');

sim.addTask(env.driver.run()); // This adds the generator
sim.addTask(env.monitor.run());

sim.run(20);

// 7. Verify
console.log("Monitored items:", monitoredData.length);
assert.strictEqual(monitoredData.length, 2);
assert.strictEqual(monitoredData[0].data, 0xDEADBEEF);
assert.strictEqual(monitoredData[1].data, 0xCAFEBABE);
console.log("SUCCESS: UVM-Lite Driver/Monitor verification passed.");
