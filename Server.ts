///<reference path="Game/build/node.d.ts"/>
///<reference path="Game/build/express.d.ts"/>
///<reference path="Game/build/socket.io.d.ts"/>
///<reference path="Game/build/serve-static.d.ts"/>

import express = require("express");
import serveStatic = require('serve-static')
import stat = require("express");
import http = require("http");
import socketio = require("socket.io");

var app = express();
var http_server = http.createServer(app);
var sio = socketio.listen(http_server);

app.use('/Game', express.static(__dirname + '/Game'));
app.use('/img', express.static(__dirname + '/Game/img'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

/**
 * Created by Paha on 8/10/2015.
 */
class Server{
    playerList:string[] = [];
    playerCounter:number = 0;

    constructor(){
        var port = process.env.PORT || 3000;
        http_server.listen(port, '127.0.0.1');
        console.log('Server started on 127.0.0.1:'+port);

        sio.on('connection', socket => {
            console.log('Someone connected!');
            var playerName = 'player'+this.playerCounter++;
            this.playerList.push(playerName);
            socket.emit('connected', {playerName:playerName, ID:this.playerCounter-1});

            socket.on('created', data => console.log('I have some data created! '+data));
        });
    }
}

var server:Server = new Server();