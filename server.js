var express = require('express');
var path = require('path');
var logger = require('morgan');
var compress = require('compression');

var app = express();

app.set('port', process.env.PORT || 4444);
app.use(compress());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});