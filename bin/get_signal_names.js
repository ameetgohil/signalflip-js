var test_str = `
module test(
input wire[7:0] data,
input wire valid,
input wire ready,
output wire sig1,
output reg[31.0] sig2,
input clk, rst
);
`;

//let str2 = `[ sdlk ]`;
//let re = /\(([^)]+)\,/;
//let re2 = /\(([^)]+)\)/;
//let re3 = /\(([^ ]+) (.|\n)\s/m;

//console.log(str);
//console.log(first_sig_re.exec(module));
//console.log(re3.exec("input ( dsd wire"));

//console.log(re4.exec(module));
//console.log(module);

//console.log(e);
//console.log(':::last: ', (e.replace(remove_new_line)).match(last_word));
//console.log(':::last: ', " output reg[31.0] sig2\n".match(last_word));

//console.log(e.localeCompare(" output reg[31.0] sig2"));
//console.log(e);

//console.log(brackets.exec(e));
//console.log("[32:3] sig2".match(/\d+/g)); //get_width.exec("32 3"));

function get_signal_names(str) {
    let last_word = /\b(\w+)$/g;
    let brackets = /\[([^\]]+)]/;
    let between_parentheses = / *\(([^\)]*)\)/;
    let get_width = /\d+/g;///^[0-9]+(,[0-9]+)*$/;
    let modulere = /module *([^ ]*) *\(([^\)]*)\)/g;
    let remove_new_line = /\n/g;

    let returnObj = [];
    if(str.search(modulere) > 0) {
	let module = modulere.exec(str)[0];
	let port_str = between_parentheses.exec(module)[1];

	//console.log(module);
	//console.log(port_str);
	let port_str_one_line = port_str.replace(/\n/g, ' ');
	let s = port_str_one_line.split(",");
	
	let width;
	let name;
	let dir;
	s.map((e) => {
	    let obj = {};
	    //console.log(e);
	    if(e.search('input') > 0) {
		dir = 'input';
		width = 1;
	    } else if(e.search('output') > 0) {
		dir = 'output';
		width = 1;
	    } else if(e.search('inout') > 0) {
		dir = 'inout';
		width = 1;
	    }
	    if(e.search(brackets) > 0) {
		let vector = brackets.exec(e)[1];
		let vector_array = vector.match(get_width);
		width = parseInt(vector_array[0])-parseInt(vector_array[1]) + 1;
		//console.log(vector_array[0]);
		//console.log(parseInt(vector_array[0]));
	    }
	    name = e.trim().match(last_word)[0];
	    /*console.log(':::last: ', (e.trim()).match(last_word));
	      console.log(" output reg[31.0] sig2");
	      console.log('width: ', width);*/
	    console.log(name, width, dir);
	    obj['name'] = name;
	    obj['width'] = width;
	    obj['dir'] = dir;
	    returnObj.push(obj);
	});
	return returnObj;

    }
}

console.log(get_signal_names(test_str));

module.exports = get_signal_names;
