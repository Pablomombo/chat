var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/dist'));

let users = {};

getUsers = () => {
    return Object.keys(users).map(function(key){
        return users[key].username
    });
};

createSocket = (user) => {
    let cur_user = users[user.id],
        updated_user = {
            [user.id] : Object.assign(cur_user, {sockets : [...cur_user.sockets, user.socket_id]})
        };
    users = Object.assign(users, updated_user);
};

createUser = (user) => {
    users = Object.assign({
        [user.id] : {
            username : user.username,
            id : user.id,
            sockets : [user.socket_id]
        }
    }, users);
};

removeSocket = (socket_id) => {
    let uid = '';
    Object.keys(users).map(function(key){
        let sockets = users[key].sockets;
        if(sockets.indexOf(socket_id) !== -1){
            uid = key;
        }
    });
    let user = users[uid];
    if(user.sockets.length > 1){
        // Remove socket only
        let index = user.sockets.indexOf(socket_id);
        let updated_user = {
            [uid] : Object.assign(user, {
                sockets : user.sockets.slice(0,index).concat(user.sockets.slice(index+1))
            })
        };
        users = Object.assign(users, updated_user);
    }else{
        // Remove user by key
        let clone_users = Object.assign({}, users);
        delete clone_users[uid];
        users = clone_users;
    }
};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    let query = socket.request._query,
        user = {
            username : query.username,
            id : query.id,
            socket_id : socket.id
        };

    if(users[user.uid] !== undefined){
        createSocket(user);
        socket.emit('updateUsersList', getUsers());
    }
    else{
        createUser(user);
        io.emit('updateUsersList', getUsers());
    }

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('message', {
            username : data.username,
            message : data.message,
            id : data.id
        });
    });

    socket.on('disconnect', () => {
        removeSocket(socket.id);
        io.emit('updateUsersList', getUsers());
    });
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});