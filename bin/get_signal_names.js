var str = `
module test(
input wire[7:0] data,
input wire valid,
input wire ready
);
`;

let str2 = `[ sdlk ]`;
let re = /\(([^)]+)\,/;

let re2 = /\(([^)]+)\)/;

let re3 = /\(([^ ]+) (.|\n)\s/m;

let between_parentheses = / *\(([^\)]*)\)/;



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
    let s = port_str.split(", ");
    console.log(s);
}

