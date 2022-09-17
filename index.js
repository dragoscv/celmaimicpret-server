
console.log("If module not found, install express globally `npm i express -g`!");
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 8765;
var express = require('express');
var Gun = require('gun');
const { v4 } = require('uuid');
require('axe');

var app = express();
app.use(Gun.serve);
app.use(express.static(__dirname));

var server = app.listen(port);
var gun = Gun({ file: 'data', web: server });

global.Gun = Gun; /// make global to `node --inspect` - debug only
global.gun = gun; /// make global to `node --inspect` - debug only

console.log('Server started on port ' + port + ' with /gun');

app.get('/api', (req, res) => {
    const path = `/api/item/${v4()}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
    const { slug } = req.params;
    res.end(`Item: ${slug}`);
});

module.exports = app;