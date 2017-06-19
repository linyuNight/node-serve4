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

//数据库
var connection = mysql.createConnection({
 host   : '172.18.199.227',
 // host   : '127.0.0.1',
 user   : 'root',
 password : 'root',
 database : 'mysql'
 // database : 'chat'
});
connection.connect();

//主页面
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/www/index.html');
  // res.render("index",{title:'header'});
});

app.get('/data', function(req, res){
  res.json([
		    {
		        "_id":"440000198010314985","thumb":"https://dummyimage.com/1200x600/b0832a)","title":"测试内容8ymt","video":"blob:http://www.imooc.com/af8edce6-fa77-4e0c-9135-72538ce5cf1f"
		    }
		    ,
		    {
		        "_id":"54000020170223727X","thumb":"https://dummyimage.com/1200x600/652f2f)","title":"测试内容8ymt","video":"blob:http://www.imooc.com/af8edce6-fa77-4e0c-9135-72538ce5cf1f"
		    }
		    ,
		    {
		        "_id":"630000198206032344","thumb":"https://dummyimage.com/1200x600/5dddc5)","title":"测试内容8ymt","video":"blob:http://www.imooc.com/af8edce6-fa77-4e0c-9135-72538ce5cf1f"
		    }
		    ,
		    {
		        "_id":"210000198208117335","thumb":"https://dummyimage.com/1200x600/3694f6)","title":"测试内容8ymt","video":"blob:http://www.imooc.com/af8edce6-fa77-4e0c-9135-72538ce5cf1f"
		    }
		    ,
		    {
		        "_id":"500000197805284849","thumb":"https://dummyimage.com/1200x600/d54486)","title":"测试内容8ymt","video":"blob:http://www.imooc.com/af8edce6-fa77-4e0c-9135-72538ce5cf1f"
		    }
		    ,
		    {
		        "_id":"630000199603197024","thumb":"https://dummyimage.com/1200x600/675de4)","title":"测试内容8ymt","video":"blob:http://www.imooc.com/af8edce6-fa77-4e0c-9135-72538ce5cf1f"
		    }
		    ,
		    {
		        "_id":"650000198609184709","thumb":"https://dummyimage.com/1200x600/0a2206)","title":"测试内容8ymt","video":"blob:http://www.imooc.com/af8edce6-fa77-4e0c-9135-72538ce5cf1f"
		    }
      ]);
});

//加载数据
var datalength = 20;
var chatlist = [];
app.get('/chatdata', function(req, res){
	var pathname = url.parse(req.url).query;
	var num = pathname.split('=');

	res.header("Access-Control-Allow-Origin", "*");
	connection.query("select * from chat_content order by id desc limit " + (parseInt(num[1])*datalength) + "," + datalength , function selectTable(err, rows, fields){
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