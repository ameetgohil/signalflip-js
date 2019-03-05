const _ = require('lodash');
var test_str = `
module test
  (
input wire[7:0] data,
input wire valid,
input wire ready,
output wire sig1,
output reg[31.0] sig2,
input clk, rst
);
`;

var test_str2 = `
module top_elastic
  (
   input [31:0] t0_data,
   input        t0_valid,
   output       t0_ready,
   output [31:0] i0_data,
   output        i0_valid,
   input        i0_ready,
   input        clk,
   input        rstf
   );

   wire         t0_ready;
   
   reg [31:0]   i0_data;
   
   reg          i0_valid;
   

   logic      data_en;
   assign t0_ready = ~rstf ? 0:~i0_valid | i0_ready;

   assign data_en = t0_valid & t0_ready;

   always @(posedge clk or negedge rstf) begin
      if(!rstf) begin
         i0_data <= 0;
         i0_valid <= 0;
      end
      else begin
         if(data_en)
           i0_data <= t0_data<<2;
         i0_valid <= ~t0_ready | t0_valid;
      end
   end
endmodule
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
    let modulere       = /module *([^ ]*) *\(([^\)]*)\)/g;
    let modulereParams = /module *([^ ]*)\s*#\s*\(([^\)]*)\)\s*\(([^\)]*)\)/g;


    
    let remove_new_line = /\n/g;

    let returnObj = [];
    //console.log(modulere.exec(str));
    //console.log(_.isEqual(str, test_str2));
    //console.log(_.differenceWith(str, test_str2, _.isEqual));
    //console.log(str.search(between_parentheses));
    //console.log(str.search(modulere));
    
    let module_arr = modulere.exec(str);
    // let module_name_index = 0;

    if(module_arr === null) {
      console.log('Trying params version');
      module_arr = modulereParams.exec(str);
      // console.log(module_arr);
      // module_name_index = 3;
    }

    if(module_arr !== null) {
	let port_str = module_arr[module_arr.length-1];
	// let port_str = between_parentheses.exec(module)[1];

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
	    }
	    name = e.trim().match(last_word)[0];
	    obj['name'] = name;
	    obj['width'] = width;
	    obj['dir'] = dir;
	    returnObj.push(obj);
	});
	//console.log(returnObj);
	return returnObj;

    } else {
    	console.log("problem parsing module name, are you using parameters?");
    }
}

// console.log(get_signal_names(test_str2));

module.exports = get_signal_names;
