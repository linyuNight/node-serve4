var express = require('express');
var app = require('express')();
var ejs = require('ejs');// 后台模板库
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql=require('mysql'); 
var compression = require('compression');//开启gzip
app.use(compression());//开启gzip

app.set('views', './public/www');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static('public/www'));


var connection = mysql.createConnection({
 host   : '172.18.199.227',
 // host   : '127.0.0.1',
 user   : 'root',
 password : 'root',
 database : 'mysql'
 // database : 'chat'
});
connection.connect();
// connection.query("select * from chat_content" , function selectTable(err, rows, fields){
//  if (err){
//   throw err;
//  }
//  if (rows){
//   for(var i = 0 ; i < rows.length ; i++){
//    console.log("%s\t%s\t%s", rows[i].zzzz,rows[i].age,rows[i].age2);
//   }
//  }
// });
// connection.query('insert into chat_content (name ,content) values ("lupeng" , "123456")');
 
// connection.end();



app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/www/index.html');
  // res.render("index",{title:'header'});
});

var chatlist = [];
app.get('/chatdata', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
	connection.query("select * from chat_content" , function selectTable(err, rows, fields){
		if (err){
			throw err;
		}
		if (rows){
			chatlist = []
			for(var i = 0 ; i < rows.length ; i++){
				chatlist.push(rows[i])
			}
			res.json({chatlist: chatlist});
		}
	});
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	connection.query('insert into chat_content (name ,content) values ("'+msg[0]+'" , "'+msg[1]+'")',function(err,result){
  		if (err){
			throw err;
		}else{
    		io.emit('chat message', msg);
		}
  	});
    // console.log(msg);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});