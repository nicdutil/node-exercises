var http = require('http');
var https = require('https');

var express = require('express'),
    app = express();

app.use(express.logger());

app.set('title', 'Facebook App Redirect');

var halfHour = 1800000;  // cache control for shared and private caches

app.use(express.compress());

app.use(express.static(__dirname + '/public', { maxAge: halfHour }));


app.all('/', function(req, res) {
//    var ip = req.headers['X-Forwarded-For'];
    var html;
    var options = {
        host: 'www.barnabemazda.com',
        path: '/used-inventory/index.htm?reset=InventoryListing',
    };

    var x = "";
    var req = http.get(options, function(response) {
        response.setEncoding('binary');

        response.on('data', function(d) {
             x += d.toString();
          });
        response.on('end', function() {
          res.send(x);            
        });
    }); 
    req.on('error', function(e) {
        console.log('ERROR:' + e.message);
    });
});


app.use(function(req,res) {
    res.status(404);
    res.render('404.jade', {title_en: 'File Not Found', title_fr: 'Page non trouvée '});
});
app.use(function(error,req,res,next) {
    res.status(500);
    res.render('500.jade', {title:'500: Internal Server Error', error: error});
});

var server = app.listen(process.env.PORT, function() { 
 console.log(__dirname);
 console.log('Express server started on port %s', process.env.PORT);
});



