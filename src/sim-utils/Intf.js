const _ = require('lodash');

function Intf(args) {

//    console.log(args);
//    let keys = Object.keys(args);
    let handler = {
	get: (target, name) => {
	    return args[name]();
	},
	set: function(obj, prop, value) {
	    args[prop](value);
	    //return true;
	}
    };

    return new Proxy({}, handler);
};

    
module.exports = Intf;
