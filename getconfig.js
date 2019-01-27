var fs = require('fs');

var content = fs.readFileSync('config.json');
var jsonContent = JSON.parse(content);
var sources = "'" + jsonContent.sources.join("' ,\n'") + "'";
var libraries = "'" + jsonContent.libraries.join("' ,\n'") + "'";
//console.log(jsonContent.sources);
module.exports = {sources, libraries};
