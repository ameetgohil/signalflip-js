class Component {
    constructor(name, parent = null) {
        this.name = name;
        this.parent = parent;
        this.children = {};
        if (parent) {
            parent.addChild(this);
        }
    }

    addChild(child) {
        this.children[child.name] = child;
    }

    build() {
        for (const child of Object.values(this.children)) {
            child.build();
        }
    }

    connect() {
        for (const child of Object.values(this.children)) {
            child.connect();
        }
    }

    *run() {
        // Run all children in parallel using the Sim's fork/join mechanism if possible,
        // or just yield.
        // For Sim.js, we usually add tasks to the scheduler.
        // So this run() might just be a task itself.
        // But to run children in parallel, we need to fork them.
        // This base class might not need to do much other than exist.
    }

    log(msg) {
        console.log(`[${this.name}] ${msg}`);
    }
}

module.exports = Component;
