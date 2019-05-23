var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ent = require('ent');
var port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/dist'));

let users = {};

getUsers = () => {
    return Object.keys(users).map(function(key){
        return users[key].username
    });
};

createSocket = (user) => {
    let cur_user = users[user.uid],
        updated_user = {
            [user.uid] : Object.assign(cur_user, {sockets : [...cur_user.sockets, user.socket_id]})
        };
    users = Object.assign(users, updated_user);
};

createUser = (user) => {
    users = Object.assign({
        [user.uid] : {
            username : user.username,
            uid : user.uid,
            sockets : [user.socket_id]
        }
    }, users);
};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    let query = socket.request._query,
        user = {
            username : query.username,
            uid : query.uid,
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
            uid : data.uid
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