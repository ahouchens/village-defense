"use strict";

var util = require('./utils.js');

var WebSocketServer = require('websocket').server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
const path = require('path');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wsServer = new WebSocketServer({
  httpServer: server
});

/**
 * Global variables
 */
// latest 100 messages
var history = [];
// list of currently connected clients (users)
var clients = [];

let playerCharacters = [];
let currentPlayerCharacter = {};

// Array with some colors
var colors = [ '#FFCECE', '#CACAFF', '#D6F8DE', '#FFF7B7', '#A5FEE3', '#FFE2C8', '#DCEDEA' ];
// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );


// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');
  var connection = request.accept(null, request.origin); 
  // we need to know client index to remove them on 'close' event
  var index = clients.push(connection) - 1;
  var userName = false;
  var userColor = false;
  console.log((new Date()) + ' Connection accepted.');
  
  // send back chat history
  if (history.length > 0) {
    connection.sendUTF(
        JSON.stringify({ type: 'history', data: history} ));
  }

  if (playerCharacters.length > 0) {
    for (var i=0; i < playerCharacters.length; i++) {
      connection.sendUTF(
        JSON.stringify(
          Object.assign({...playerCharacters[i]}, { type: 'invoke-character' })  
        ));
    }
  }

  // user sent some message
  connection.on('message', function(message) {

    if (message.type === 'utf8') { // accept only text
    // first message sent by user is their name
     if (userName === false) {
      var messageObj = JSON.parse(message.utf8Data);
        // remember user name
        userName = util.htmlEntities(messageObj.data);
        // get random color and send it back to the user
        userColor = colors.shift();
        connection.sendUTF(
            JSON.stringify({
              type:'color', 
              data: userColor,
              userName: userName
        }));

        let playerCharacter = {
          userName: userName,
          leftPosition: 32,
          topPosition: 32,
          color: userColor,
          id: (new Date()).getTime()
        };
        util.broadcastMessage(clients, Object.assign({...playerCharacter}, { type: 'invoke-character' }));
        util.sendMessage(connection, Object.assign({...playerCharacter}, { type: 'current-player-character' }))
        currentPlayerCharacter = playerCharacter;
        playerCharacters.push(playerCharacter);

        console.log((new Date()) + ' User is known as: ' + userName
                    + ' with ' + userColor + ' color.');
      } else { // log and broadcast the message
        var messageObj = JSON.parse(message.utf8Data);

        console.log((new Date()) + ' Received Message from '
                    + userName + ': ' + message.utf8Data);
        
        if (messageObj.type === 'chat-message') {
          // we want to keep history of all sent messages
          var obj = {
            time: (new Date()).getTime(),
            text: util.htmlEntities(messageObj.data),
            author: userName,
            color: userColor
          };
          history.push(obj);
          history = history.slice(-100);

          util.broadcastMessage(clients, { 
            type:'message', 
            data: obj 
          }); 
        }

        if (messageObj.type === 'update-character') {
          console.log('update-character', messageObj);

          let playerCharacter = {
            userName: messageObj.userName,
            leftPosition: messageObj.leftPosition,
            topPosition: messageObj.topPosition,
            color: messageObj.color,
            id: messageObj.id
          };
          
          let characterToUpdateIndex = playerCharacters.findIndex((character) => {
            return character.id === messageObj.id;
          });

          Object.assign(playerCharacters[characterToUpdateIndex], playerCharacter);

          util.broadcastMessage(clients, Object.assign({...playerCharacter}, { type: 'update-character' }));
        }

      }
    }
  });
  // user disconnected
  connection.on('close', function(connection) {
    if (userName !== false && userColor !== false) {
      console.log((new Date()) + " Peer "
          + connection.remoteAddress + " disconnected.");
      // remove user from the list of connected clients
      clients.splice(index, 1);
      // push back user's color to be reused by another user
      colors.push(userColor);

      // delete player character
      let playerCharacterIndex = playerCharacters.findIndex((character) => {
        return character.id === currentPlayerCharacter.id;
      });
      util.broadcastMessage(clients, Object.assign({...playerCharacters[playerCharacterIndex]}, { type: 'remove-character' }));
      playerCharacters.splice(playerCharacterIndex, 1);

    }
  });
});