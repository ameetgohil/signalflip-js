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
    topname = "";

	fileContent = fileContent.replace(goodre, function replacer(match, p1, p2, p3) {
        // load and return the replacement file
        // console.log('ben:');
        //console.log(replacePath);
        // console.log(p1);
        // console.log(p2);
        // console.log(p3);
        // console.log(match);
        topname = p1;
        signature = p2;
        return match;
    });

    let inputs = signature.split(",");

    var first = true;

    var returnObj = [];

    for(k in inputs) {
        let val = inputs[k];
        let aslower = val.toLowerCase();
        // console.log(val);

        let foundIn = aslower.search("input") !== -1;
        let foundOut = aslower.search("output") !== -1;


        // console.log('-------');
        // console.log("val: " + val);
        // console.log("   " + foundIn);


        var obj = {};
        if(foundIn) {
            obj["dir"] = "input";
        } else if (foundOut) {
            obj["dir"] = "output";
        } else {
            throw('fixme');
        }

        var findProps = new RegExp(' .*'+obj["dir"]+'[^\\[].*(\\[[^\\]].*\\]) *([^ ]*) *', 'g');

        var findPropsResult = findProps.exec(aslower);
        // console.log(JSON.stringify(findPropsResult));


        if( findPropsResult === null ) {
            obj["dimension"] = {'from':'','to':''};
	    obj['width'] = 1;
            var findName = new RegExp(' .*'+obj["dir"]+' *([^ ]*) *', 'g');
            var findNameResult = findName.exec(aslower);
//	    console.log(obj, val);
            obj["name"] = findNameResult[1];
	    
            // console.log(JSON.stringify(findNameResult));

        } else {

            obj["name"] = findPropsResult[2];
            let dimString = findPropsResult[1];

            // console.log(dimString);

            var findDim = new RegExp(' *(\\d*) *: *(\\d*)');
            var findDimResult = findDim.exec(dimString);
//            console.log(JSON.stringify(findDimResult));

            obj["dimension"] = {'from':findDimResult[1], 'to':findDimResult[2]};
	    obj['width'] = parseInt(findDimResult[1])-parseInt(findDimResult[2])+1;
        }
        
        // console.log(JSON.stringify(obj));

        returnObj.push(obj);

        // console.log("");
        // console.log("");



        first = false;
    }


    // console.log("");
    // console.log("");
    // console.log("");
    
    console.log(JSON.stringify(returnObj));
    // console.log("");
    // console.log("");

    // console.log(signature);
    // console.log(fileContent);
    return returnObj;
}

module.exports = replace;
