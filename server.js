//A Server File, all console.log() will be printed in terminal window


//Server setup
var express = require('express'),
    app = express(),    //simply one line var app = require('express')();
    server = require('http').createServer(app),
    usersNames = {},
    io = require('socket.io').listen(server);

server.listen(3000, function(){ console.log('listening port 3000')});

//Express Routing as soon as we go to http://host:port this page will be served
// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });
app.use(express.static('public'));

//listen on events coming from client side
io.on('connection', function(socket) {
    //user enters onto chat
    socket.on('new user', function(data, callback){
        if(data in usersNames) { callback(false); }
        else {
          callback(true);
          // we store the username in the socket session for this client
          socket.userName = data
          // add the client's username to the global list
          usersNames[socket.userName] = socket;  //userName is key : socket
          updateUsersNames();
        }
    });
    //usersNames object keys updated
    function updateUsersNames() {
          io.sockets.emit('usernames', Object.keys(usersNames));
    }
    //if user leaves chat, then username removed from UsersNames{}
    socket.on('disconnect', function(data){
        if(!socket.userName) return; //if there s no username simply return
	       // remove the username from global usernames list
        delete usersNames[socket.userName];
        updateUsersNames();
    });


    // when the user sends a private message to a user.. perform this
  	socket.on('send message', function(data) {
  		console.log("From user: "+socket.userName);
  		console.log("To user: "+data.client);
  		console.log(usersNames);
      socket.to(usersNames[data.client]).emit('new message', //username, msg);
          {
            'sender': socket.userName,
            'message': data.msg,
            'client': data.client
          });
      });






/*
    //user sends message from clientside
    socket.on('send message', function(data){
      console.log(data.client);//prints message receiver's name
      console.log(usersNames);
      var receiver = data.client;
      console.log(receiver);
      io.sockets.connected[receiver].emit('new message', {
        //  io.sockets.emit('new message', {
          sender: socket.userName,
          message: data.msg,
          client: data.client
        });
    });
*/


    socket.on('typing message', function(data){
        socket.broadcast.emit('typing message', socket.userName); //server sends msg to all excluding me
    });
});
