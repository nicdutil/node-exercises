var https = require("https");
var unirest = require('unirest');

var loc_service = {
    host: 'freegeoip.net',
    path: '/json'
}
var mashape_key = "3hBdaIHGwpmshFPt6hqA18t1NIaqp1zW3Apjsnj8uzRLC2kcU1";

var express = require('express'),
    app = express();
var compressor = require('node-minify');


new compressor.minify({
    type: 'gcc',
    fileIn: ['public/js/vendor/jquery.easing.1.3.js', 'public/js/vendor/bootstrap.js'],
    fileOut: 'public/js-dist/base-min.js',
    callback: function(err, min) {
        console.log(err);
    }
});
new compressor.minify({
    type: 'clean-css',
    fileIn: ['public/css/bootstrap.css', 'public/css/main.css'],
    fileOut: 'public/css/base-min.css',
    callback: function(err, min) {
        console.log(err);
    }
});

app.use(express.logger());

app.set('title', 'Facebook App');

var oneDay = 86400000;

app.use(express.compress());


app.use(express.static(__dirname + '/public'));

function get_geoloc(ip, complete) {

    unirest.get("https://worldtimeiofree.p.mashape.com/ip?ipaddress=" + '176.31.255.0')
        .header("X-Mashape-Key", mashape_key)
        .end(function(result) {
        	var body = result.body;
        	if (result.status != "200") {
        		theme = 'day';
        		console.log('ERROR WITH WORLD TIME SERVICE: ' + result.status);
        	} else {
			  var datetime = body['summary'].local;
			  var time = datetime.split(' ')[1];
			  var hour = parseInt(time.split(":")[0]);

			  console.log('DATE TIME:' + datetime);
			  console.log('HOUR:' + hour);
			  if ((hour > 20) || (hour < 6)) {
			  	theme = 'night';
			  } else {
			  	theme = 'day';
			  }
			  console.log('THEME:' + theme);
			  complete(theme);
        	}
        });
}

app.get('/fr', function(req,res) {
    res.sendfile('index.html');
});

app.get('/', function(req, res) {
    var ip = req.headers['X-Forwarded-For'];
    console.log('USER IP:' + ip);
    res.sendfile('index.html');
});



app.use(function(req,res) {
    res.status(404);
    res.render('404.jade', {title_en: 'File Not Found', title_fr: 'Page non trouvée '});
});
app.use(function(error,req,res,next) {
    res.status(500);
    res.render('500.jade', {title:'500: Internal Server Error', error: error});
});


var server = app.listen(process.env.PORT, '192.168.1.6', function() {
    console.log(__dirname);
    console.log('Express server started on port %s', process.env.PORT);
});
