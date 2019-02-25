const fs = require('fs');
const _ = require('lodash');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

//const replace = require('./getsignature.js');
const get_signal_names = require('./get_signal_names');

const dut_file = require('./config.json').dut_file;
const dut_name = require('./config.json').dut_name;
const waveform_format = require('./config.json').waveform_format;

async function get_pinlist(options={}) {
    const { topfile } = options;

    const { stdout, stderr } = await exec('verilator -E -P ' + topfile);
    //console.log(get_signal_names(stdout));
    return get_signal_names(stdout);
}
//const getsig = replace(dut_file);
async function  gen() {
    let sigs = await get_pinlist({ topfile: dut_file });
    console.log(sigs);
    const val = {'sigs': sigs, //['in_quad', 'fastclk', 'clk', 'reset_l'],
		 'dutName': dut_name,
		 'waveform_format': waveform_format};

    const mkdirSync = function (dirPath) {
	try {
	    fs.mkdirSync(dirPath)
	} catch (err) {
	    if (err.code !== 'EEXIST') throw err
	}
    };

    let sigs_header_file = fs.readFileSync('./node_modules/signalflip-js/templates/signals.h');
    let sigs_header_compiled = _.template(sigs_header_file)(val);

    let sigs_src_file = fs.readFileSync('./node_modules/signalflip-js/templates/signals.cpp');
    let sigs_src_compiled = _.template(sigs_src_file)(val);

    console.log('----------Creating signals.cpp and signals.h------------');
    fs.writeFile('cppsrc/signals.h',sigs_header_compiled, (err) => {
	if(err) {
	    return console.log(err);
	}
    });

    fs.writeFile('cppsrc/signals.cpp',sigs_src_compiled, (err) => {
	if(err) {
	    return console.log(err);
	}
    });

    console.log('--------------------Done--------------------------------');
    //replace('./src/top.sv');

}

gen();
