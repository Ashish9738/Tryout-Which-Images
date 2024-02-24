const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 8080;

const readModelData = () => {
  try {
    const data = fs.readFileSync('models.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading models.json:', error);
    return [];
  }
};

const wss = new WebSocket.Server({ port: 8082 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('close', function() {
    console.log('Client disconnected');
  });

  ws.on('error', function(error) {
    console.error('WebSocket error:', error);
  });
});

const sendModelData = () => {
  const models = readModelData();
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(models));
    }
  });
};

app.use(cors());

app.get('/model', (req, res) => {
  const models = readModelData();
  res.json(models);
});

const server = app.listen(port, () => {
  console.log(`Server listening at http://192.168.43.47:${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit('connection', socket, request);
  });
});

fs.watch('models.json', (eventType, filename) => {
  console.log(`File ${filename} changed. Reloading model data...`);
  sendModelData(); 
});
