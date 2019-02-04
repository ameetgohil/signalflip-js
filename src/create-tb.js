const fs = require('fs');

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
};

const name = process.argv[2];

const copy = (src) => {
    fs.copyFile(src, name + '/' + src, (err) => {
	if (err) throw err;
	console.log(src, ' was copied to ', name + '/' + src);
    });
};

/*process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    });*/



console.log(name);
mkdirSync(name);

const files = [ 'Makefile',
		'Makefile_obj',
		'package.json',
		'binding.gyp',
		'config.json',
		'input.vc'
	      ];
		
files.map((e) => {
    copy(e);
});
