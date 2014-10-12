// http://expressjs.com/guide.html
// http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4

var spawn = require('child_process').spawn;
var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'jade')


// middleware

var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');

function trouble (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Trouble');
}

// app.use(serveStatic('static')).use(serveIndex('static',{'icons': true}))
app.use(serveStatic('static'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(trouble);


// routing

function root (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
}

function graph (req, res) {
    function respond (data) {
        res.send({graph: data})
    }
    dot = spawn('dot', ['-Tsvg'])
    dot.stdin.write(req.param('source'));
    dot.stdin.end();
    dot.stdout.setEncoding('utf8');
    dot.stdout.on('data', respond);
    dot.stderr.on('data', respond);
}

function api (req, res) {
    res.json({message: 'hello'})
}

app.get('/', root);
app.post('/graph', graph);

var router = express.Router();
router.get('/', api);
app.use('/api',router);


// server

var server;

function ready () {
    console.log('Listening on port %d', server.address().port);
}

server = app.listen(4000,ready);