const pinlist = require('pinlist');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function GenerateWrapper(options={}) {
    const { topfile } = options;
    
    const { stdout, stderr } = await exec('verilator -E -P ' + topfile);
    const p = pinlist();
    const pinst = p(stdout);
    console.log(stdout);
    console.log(pinst);
    return pinst;
}

//GenerateWrapper({topfile: '../verilog_src/top_elastic.sv'});

module.exports = GenerateWrapper;



