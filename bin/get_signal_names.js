var str = `
module test(
input wire[7:0] data,
input wire valid,
input wire ready,
output wire sig1,
output reg[31.0] sig2
);
`;

let str2 = `[ sdlk ]`;
let re = /\(([^)]+)\,/;

let re2 = /\(([^)]+)\)/;

let re3 = /\(([^ ]+) (.|\n)\s/m;

let last_word = /\b(\w+)$/g;

let brackets = /\[([^\]]+)]/;

let between_parentheses = / *\(([^\)]*)\)/;

let get_width = /\d+/g;///^[0-9]+(,[0-9]+)*$/;

let modulere = /module *([^ ]*) *\(([^\)]*)\)/g;
//let first_sig_re = /((.*?)\,/g;
console.log(str);
console.log(str.search(modulere));
//console.log(goodre.exec(str)[0]);
if(str.search(modulere) > 0) {
    let module = modulere.exec(str)[0];
    let port_str = between_parentheses.exec(module)[1];

    //console.log(str);
    //console.log(first_sig_re.exec(module));
    //console.log(re3.exec("input ( dsd wire"));
    console.log(module);
    console.log(port_str);
    //console.log(re4.exec(module));
    //console.log(module);
    let port_str_one_line = port_str.replace(/\n/g, ' ');
    let s = port_str_one_line.split(",");
    let remove_new_line = /\n/g;
    console.log('::::::::::::::::S::::::::::::');
    console.log(s);
    s.map((e) => {
	let width = 1;
	console.log(e);
	//console.log(e.search('input'));
	if(e.search('input') > 0) {
	    console.log('input');
	}
	if(e.search(brackets) > 0) {
	    console.log('brackets');
	    let vector = brackets.exec(e)[1];
	    let vector_array = vector.match(get_width);
	    console.log(vector_array);
	    width = parseInt(vector_array[0])-parseInt(vector_array[1]);
	    console.log(vector_array[0]);
	    console.log(parseInt(vector_array[0]));
	}
	//console.log(e);
	//console.log(':::last: ', (e.replace(remove_new_line)).match(last_word));
	//console.log(':::last: ', " output reg[31.0] sig2\n".match(last_word));
	console.log(':::last: ', (e.trim()).match(last_word));
	//console.log(e.localeCompare(" output reg[31.0] sig2"));
	//console.log(e);
	console.log(" output reg[31.0] sig2");
	console.log('width: ', width);
	//console.log(brackets.exec(e));
	//console.log("[32:3] sig2".match(/\d+/g)); //get_width.exec("32 3"));
    });

}

