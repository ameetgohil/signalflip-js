const fs = require('fs');
const _ = require('lodash');
const replace = require('./getsignature.js');

const getsig = replace('./src/top_elastic.sv');


const val = {'sigs': getsig, //['in_quad', 'fastclk', 'clk', 'reset_l'],
	     'dutName': 'top_elastic'};


var sigs_header_file = fs.readFileSync('./templates/signals.h');
var sigs_header_compiled = _.template(sigs_header_file)(val);

var sigs_src_file = fs.readFileSync('./templates/signals.cpp');
var sigs_src_compiled = _.template(sigs_src_file)(val);

console.log('----------Creating signals.cpp and signals.h------------');

fs.writeFile('cppsrc/signals.h',sigs_header_compiled, (err) => {
    if(err) {
	return console.log(err);
    }
});

fs.writeFile('cppsrc/signals.cpp',sigs_src_compiled, (err) => {
    if(err) {
	return console.log(err);
    }to
});

console.log('--------------------Done--------------------------------');
//replace('./src/top.sv');

