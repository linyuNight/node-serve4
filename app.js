var express = require('express');
var app = require('express')();
var ejs = require('ejs');// 后台模板库
var http = require('http').Server(app);
var io = require('socket.io')(http);
var compression = require('compression');//开启gzip
app.use(compression());//开启gzip

app.set('views', './public/www');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static('public/www'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/www/index.html');
  // res.render("index",{title:'header'});
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});