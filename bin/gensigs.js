const fs = require('fs');
const _ = require('lodash');
const replace = require('./getsignature.js');

const dut_file = require('./config.json').dut_file;
const dut_name = require('./config.json').dut_name;
const getsig = replace(dut_file);


const val = {'sigs': getsig, //['in_quad', 'fastclk', 'clk', 'reset_l'],
	     'dutName': dut_name };

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

