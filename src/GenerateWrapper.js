const _ = require('lodash');
const fs = require('fs');

const testString = `
    // Begin mtask footprint  all: 
    VL_INOUT8(y,2,0);
    VL_IN16(abc,10,0);
    VL_OUTW(x,127,0,4);

`;

function getsignals(str) {
    //let sigs_re = /VL_([^\(]*)\(*\?*([^\,\)]*)\)*,([^\D]*),([^\D]*)/g;
    let sigs_re = /VL_([a-zA-Z0-9]*)[\(]*\&?([a-zA-Z][_a-zA-Z0-9]*)\)*,([0-9]*),([0-9]*)/g;
    let sigs = [];
    let m;
    do {
	m = sigs_re.exec(str);
	if(m) {
	    let obj = {};
	    let isPort = true;
      /*if(m[2].substring(0,1).localeCompare('?') )
	        obj['name'] = m[2].substring(1);
      else*/
          obj['name'] = m[2];
	    obj['width'] = parseInt(m[3])-parseInt(m[4])+1;
	    if(m[1].includes('INOUT')) {
		obj['dir'] = 'inout';
	    } else if(m[1].includes('IN')) {
		obj['dir'] = 'input';
	    } else if(m[1].includes('OUT')) {
		obj['dir'] = 'output';
	    }
	    else {
		isPort = false;
	    }
	    if(isPort) {
		sigs.push(obj);
	    }
	    //console.log(m[1], isPort);
	}
    } while(m);

    
    //let module_arr = signals.exec(str);
    return sigs;
}

function GenerateWrapper(file, dut_name, waveform_format, isTest = false) {
    var fileStr = fs.readFileSync(file,'utf8');
    //console.log(fileStr.split('\n'));
    let sigs = getsignals(fileStr);
    console.log(sigs);
    //let dut_name = dut_name;
    //let waveform_format = waveform_format;
    const val = {'sigs': sigs, //['in_quad', 'fastclk', 'clk', 'reset_l'],
		 'dutName': dut_name,
		 'waveform_format': waveform_format,
		 };

    const mkdirSync = function (dirPath) {
	try {
	    fs.mkdirSync(dirPath)
	} catch (err) {
	    if (err.code !== 'EEXIST') throw err
	}
    };

    let sigs_header_file;
    if(isTest)
	sigs_header_file = fs.readFileSync('./templates/signals.h');
    else
	sigs_header_file = fs.readFileSync('./node_modules/signalflip-js/templates/signals.h');
    let sigs_header_compiled = _.template(sigs_header_file)(val);

    let sigs_src_file;
    if(isTest)
	sigs_src_file = fs.readFileSync('./templates/signals.cpp');
    else
	sigs_src_file = fs.readFileSync('./node_modules/signalflip-js/templates/signals.cpp');
    let sigs_src_compiled = _.template(sigs_src_file)(val);

    console.log('----------Creating signals.cpp and signals.h------------');
    fs.writeFile('./cppsrc/signals.h',sigs_header_compiled, (err) => {
	if(err) {
	    return console.log(err);
	}
    });

    fs.writeFile('./cppsrc/signals.cpp',sigs_src_compiled, (err) => {
	if(err) {
	    return console.log(err);
	}
    });

    console.log('--------------------Done--------------------------------');
    return 0;
}

//console.log(get_signal_names(testString));

module.exports = GenerateWrapper;
