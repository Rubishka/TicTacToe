#!/usr/bin/env node


var app = require('./server/app');
var debug = require('debug')('passport-mongo');

app.set('port', process.env.PORT || 3000);


var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

//-------------------------
var io = require('socket.io')(server);
io.on('connection', function(client) {
    // playerturn
    client.on('PlayerTurn', function(data) {
        io.emit('PlayerTurnEmit', data);
    });
    // game over
    client.on('GameOver', function(data) {
        io.emit('GameOverEmit', data);
    });
    // game over cat
    client.on('GameOverCat', function(data) {
        io.emit('GameOverCatEmit', data);
    });
    // button disabled
    client.on('PlayerButtonDisabled', function(data) {
        io.emit('PlayerButtonDisabledEmit', data);
    });
    console.log("Number of player connected to the server: " + io.engine.clientsCount);

    //Useful to know when someone connects
    console.log(client.user);
    console.log('\t socket.io:: player ' + client + ' connected');


    //When this client disconnects
    client.on('disconnect', function() {
        //Useful to know when someone disconnects
        console.log('\t socket.io:: client disconnected ' + client.username);
        io.emit("disconnected", client.username);
    }); //client.on disconnect

}); //io.sockets.on connection
app.set('socketio', io); // set socketio here so can use in express route file
server.listen(process.env.PORT || 3000);

//========================================