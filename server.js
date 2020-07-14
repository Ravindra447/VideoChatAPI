const express = require('express');
const app = express();
const cors = require('cors');
var http = require('http');
var server = http.createServer(app);

var io = require('socket.io')(server);
var port = 3001;
// const whitelist = ['http://localhost:4200'];
// const corsOptions = {
//     credentials: true, // This is important.
//     origin: (origin, callback) => {
//         if (whitelist.includes(origin))
//             return callback(null, true)

//         callback(new Error('Not allowed by CORS'));
//     }
// }
app.use(cors());
app.get('/api/:pid', (req, res) => {
    console.log(req.body, '==', req.params)
    res.send('<h1>Hey Socket.io</h1>');

});
// listen on the connection event for incoming sockets
io.on('connection', (socket) => { //two arguments *name of the event and a callback
    console.log('A new client connected');

    //join to particular rm
    socket.on('join', (data) => {
        socket.join(data.room);
        console.log(data.user + " joined in the room : " + data.room);
        // send msg except us
        socket.broadcast.to(data.room).emit('new user joined', { user: data.user, msg: ' has joined this room.' })
    });
    //leave to particular rm
    socket.on('leave', (data) => {
        console.log(data.user + " left the room : " + data.room);
        // send msg except us
        socket.broadcast.to(data.room).emit('left room', { user: data.user, msg: ' has left this room.' });
        socket.leave(data.room);
    });

    //send msg including all
    socket.on('message', (data) => {

        io.in(data.room).emit('new message', { user: data.user, msg: data.msg });
    });

    // For message passing
    // socket.on('message', function(data) {    
    //     console.log(data)
    //         // io.sockets.to(data.toUsername).emit('message', data.data);
    // });

    // To listen for a client's disconnection from server and intimate other clients about the same
    // socket.on('disconnect', function(data) {
    //     socket.broadcast.emit('disconnected', onlineUsers[socket.id].username);

    //     delete onlineUsers[socket.id];
    //     socket.broadcast.emit('onlineUsers', onlineUsers);
    // });
});
io.on('new-message', (message) => {
    io.emit(message);
});


// Create an eventEmitter object
// var eventEmitter = new events.EventEmitter();
// eventEmitter.on('a', () => {
//     console.log("llll");
//     eventEmitter.emit('a');
// })
// eventEmitter.emit('a');
// var a = new Buffer('a');
// var b = new Buffer('a');
// console.log('a');
// setImmediate(() => {
//     console.log('b');

// })
// console.log('c');






server.listen(port, () => {
    console.log('Server listening on *: ', port);
})