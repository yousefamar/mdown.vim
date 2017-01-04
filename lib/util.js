var async = require('async');
var open = require('open');
var tinylr = require('tiny-lr');

exports.getBufferContent = getBufferContent;
exports.openBrowser = openBrowser;
exports.createServer = createServer;
exports.changed = changed;
exports.setHtml = setHtml;

function getBufferContent(nvim, done) {
  async.waterfall([function(next) {
    nvim.getCurrentBuffer(next);
  }, function(buffer, next) {
    buffer.getNumber(next);
  }, function(num, next) {
    nvim.eval('join(getbufline(' + num + ', 1, "$"), "\n")', next);
  }], function (err, content) {
    done(null, content);
  });
}

function openBrowser(done) {
  var outfile = 'http://localhost:35729/markdown';
  debug('... Opening ...', outfile);
  open(outfile);
  done();
}

var server;
var html;
function createServer(done) {
  debug('Creater server');

  var port = 35729;

  if (server) return done();

  debug('Listening server');

  server = tinylr();

  server.on('GET /markdown', function(req, res) {
    res.end(html);
  });

  server.listen(port, function(err) {
    if (err) return done(err);
    debug('... Listening on %s ...', port);
  });

  done();
  return server;
}

function changed(file, done) {
  if (!server) return done();
  server.changed(file, done);
}

function setHtml(body) {
  html = body;
}
