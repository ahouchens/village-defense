module.exports = {
  sendMessage: function(client, messageObj) {
    this.broadcastMessage([client], messageObj);
  },
  broadcastMessage: function(clients, messageObj) {
    for (var i=0; i < clients.length; i++) {
      clients[i].sendUTF(JSON.stringify(messageObj));
    }
  },
  htmlEntities: function(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
