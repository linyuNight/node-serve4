var express = require('express');
var app = require('express')();
var ejs = require('ejs');// 后台模板库
var http = require('http').Server(app);
var url = require('url');
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

//加载数据
var chatlist = [];
app.get('/chatdata', function(req, res){
	var pathname = url.parse(req.url).query;
	var num = pathname.split('=');

	res.header("Access-Control-Allow-Origin", "*");
	connection.query("select * from chat_content order by id desc limit " + (parseInt(num[1])*10) + "," + 10 , function selectTable(err, rows, fields){
		if (err){
			throw err;
		}
		if (rows){
			chatlist = []
			for(var i = 0 ; i < rows.length ; i++){
				chatlist.unshift(rows[i])
			}
			res.json({chatlist: chatlist,lenght: rows.length});
		}
	});
});

//socket接收和传输
io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		connection.query('insert into chat_content (name ,content ,create_time) values ("'+msg.name+'" , "'+msg.content+'" , UNIX_TIMESTAMP())',function(err,result){
			if (err){
				throw err;
			}else{
				connection.query("select * from chat_content order by id desc limit 1" , function selectTable(err, rows, fields){
					if (err){
						throw err;
					}
					if (rows){
						io.emit('chat message', rows[0]);
					}
				});
			}
		});
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});