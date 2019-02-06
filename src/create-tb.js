const fs = require('fs');

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
};

const name = process.argv[2];

const copy = (src_dir,src,dest_dir) => {
    fs.copyFile(src_dir + src, name + '/' + dest_dir + src, (err) => {
	if (err) throw err;
	console.log(src_dir + src, ' was copied to ', name + '/' + dest_dir + src);
    });
};

/*process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    });*/



console.log(name);
mkdirSync(name);

const bin_files = [ 'Makefile',
		    'Makefile_obj',
		    'package.json',
		    'binding.gyp',
		    'getsignature.js',
		    'gensigs.js',
		    'config.json',
		    'input.vc',
		    'index.js'
		  ];

bin_files.map((e) => {
    console.log(e);
    copy('bin/',e, '');
});

mkdirSync(name + '/cppsrc');
copy('cppsrc/', 'main.cpp', 'cppsrc/');
copy('src/','getconfig.js', '');
