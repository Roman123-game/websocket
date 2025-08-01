const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const PORT = 3001;
const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Client connected');

  // Add message listener exactly once per connection
  ws.on('message', message => {
    console.log('Received:', message);

    // Broadcast to other clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

wss.clients.forEach(client => {
  client.on('message', handler);  // BAD — adds listener to same client many times
});


server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

