const _ = require('lodash');
const fs = require('fs');

function getsignals(fileStr) {
    const data = JSON.parse(fileStr);
    const sigs = [];
    
    // Find the top module
    // The modules are in modulesp. We look for one that is marked as top or by name.
    const modules = data.modulesp || [];
    let topModule = modules.find(m => m.level === 2); // Verilator tree often has top at level 2
    if (!topModule) topModule = modules[0];
    
    if (!topModule || !topModule.stmtsp) {
        return sigs;
    }

    // Build type table for easy lookup
    const typeTable = {};
    if (data.miscsp && data.miscsp[0] && data.miscsp[0].typesp) {
        data.miscsp[0].typesp.forEach(t => {
            typeTable[t.addr] = t;
        });
    }

    topModule.stmtsp.forEach(stmt => {
        if (stmt.type === 'VAR' && stmt.direction && stmt.direction !== 'NONE') {
            const obj = {};
            obj.name = stmt.name;
            obj.dir = stmt.direction.toLowerCase();
            
            // Determine width
            let width = 1;
            const type = typeTable[stmt.dtypep];
            if (type && type.range) {
                const match = type.range.match(/(\d+):(\d+)/);
                if (match) {
                    width = parseInt(match[1]) - parseInt(match[2]) + 1;
                }
            }
            obj.width = width;
            sigs.push(obj);
        }
    });

    return sigs;
}

function GenerateWrapper(file, dut_name, waveform_format, isTest = false) {
    var fileStr = fs.readFileSync(file, 'utf8');
    let sigs;
    
    if (file.endsWith('.json')) {
        sigs = getsignals(fileStr);
    } else {
        // Fallback or legacy support for header parsing if needed, but we prefer JSON
        console.warn('Warning: Using legacy header parsing. Move to JSON for better results.');
        // Re-implementing old getsignals logic briefly for fallback if someone uses it
        let sigs_re = /VL_([a-zA-Z0-9]*)[\(]*\&?([a-zA-Z][_a-zA-Z0-9]*)\)*,([0-9]*),([0-9]*)/g;
        sigs = [];
        let m;
        while ((m = sigs_re.exec(fileStr)) !== null) {
            let obj = { name: m[2], width: parseInt(m[3]) - parseInt(m[4]) + 1 };
            if (m[1].includes('INOUT')) obj.dir = 'inout';
            else if (m[1].includes('IN')) obj.dir = 'input';
            else if (m[1].includes('OUT')) obj.dir = 'output';
            else continue;
            sigs.push(obj);
        }
    }
    
    console.log('Signals found:', sigs.map(s => `${s.name}(${s.dir}, ${s.width})`).join(', '));

    const val = {
        'sigs': sigs,
        'dutName': dut_name,
        'waveform_format': waveform_format,
    };

    let sigs_header_file;
    if (isTest)
        sigs_header_file = fs.readFileSync('./templates/signals.h');
    else
        sigs_header_file = fs.readFileSync('./node_modules/signalflip-js/templates/signals.h');
    let sigs_header_compiled = _.template(sigs_header_file)(val);

    let sigs_src_file;
    if (isTest)
        sigs_src_file = fs.readFileSync('./templates/signals.cpp');
    else
        sigs_src_file = fs.readFileSync('./node_modules/signalflip-js/templates/signals.cpp');
    let sigs_src_compiled = _.template(sigs_src_file)(val);

    console.log('----------Creating signals.cpp and signals.h------------');
    fs.writeFileSync('./cppsrc/signals.h', sigs_header_compiled);
    fs.writeFileSync('./cppsrc/signals.cpp', sigs_src_compiled);
    console.log('--------------------Done--------------------------------');
    return 0;
}

module.exports = GenerateWrapper;
