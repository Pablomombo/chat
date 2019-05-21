var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ent = require('ent');
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket, pseudo){

    socket.on('new client', function(pseudo){
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.emit('message', 'you are connected');
        socket.broadcast.emit('new client', pseudo);
    });

    socket.on('message', function(msg){
        msg = ent.encode(msg);
        console.log(socket.pseudo + ' is typing ' + msg);
        socket.broadcast.emit('message', msg);
    });
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});