var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
    usernames=[];

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
port = Number(process.env.PORT || 8081)
server.listen(port);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html')
});

io.sockets.on('connection',function(socket){
    socket.on('new user',function(data,callback){
        if(usernames.indexOf(data) != -1){
            callback(false);
        } else{
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            io.sockets.emit('usernames',usernames);
        }
    });

    socket.on('send message',function(data){
        io.sockets.emit('new message',{message:data,username:socket.username});
    });

    socket.on('disconnect',function(data){
        if(!socket.username) return;
        usernames.splice(usernames.indexOf(socket.username),1);
    });
});