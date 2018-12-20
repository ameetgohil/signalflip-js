var fs = require('fs');

function replace(path) {
    var fileContent = fs.readFileSync(path, 'utf8');

    var stripDoubleSlash = new RegExp('//.*', 'g');

	// var myArray = stripDoubleSlash.exec(fileContent);
	//console.log(JSON.stringify(myArray));

    fileContent = fileContent.replace(stripDoubleSlash, function replacer(match, replacePath) {
        return "";
    });

    var stripNl = new RegExp('\n', 'gm');

	fileContent = fileContent.replace(stripNl, function replacer(match, replacePath) {
        return " ";
    });


	// this looks for a module name and pair of ()

    //        module   foo      (         )
    goodre = /module *([^ ]*) *\(([^\)]*)\)/g;

    signature = "";

	fileContent = fileContent.replace(goodre, function replacer(match, p1, p2, p3) {
        // load and return the replacement file
        // console.log('ben:');
        //console.log(replacePath);
        // console.log(p1);
        // console.log(p2);
        // console.log(p3);
        // console.log(match);

        signature = p2;
        return match;
    });

    console.log("");
    console.log("");
    console.log("");

    console.log(signature);
    // console.log(fileContent);
}

replace('./src/top.sv');
