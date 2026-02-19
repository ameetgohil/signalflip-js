const _ = require('lodash');

const createBundles = (dut) => {
    const keys = Object.keys(dut);
    keys.forEach(key => {
        if (typeof dut[key] === 'function' && key.includes('_')) {
            const parts = key.split('_');
            let current = dut;
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
            const lastPart = parts[parts.length - 1];
            // Assign the signal function to the leaf
            // But we need to bind it to the original context?
            // The signal functions are native functions, usually bound to the exports object or independent.
            // Let's assume they are independent or bound.
            current[lastPart] = dut[key];
        }
    });
};

module.exports = { createBundles };
