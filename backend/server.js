const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

const readModelData = () => {
  try {
    const data = fs.readFileSync('./models/models.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading models.json:', error);
    return [];
  }
};

const readQuestionsData = () => {
  try {
    const data = fs.readFileSync('./models/questions.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading questions.json:', error);
    return [];
  }
};

// Setting up the WebSocket Connection
const wss = new WebSocket.Server({ port: 8082 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  //console logging the feedback from the response of the feedback
  ws.on('message', function incoming(message) {
    console.log('Received feedback:', message.toString('utf8'));
  });
  

  const models = readModelData();
  ws.send(JSON.stringify(models));

  const questions = readQuestionsData();
  ws.send(JSON.stringify(questions));

  ws.on('close', function() {
    console.log('Client disconnected');
  });

  ws.on('error', function(error) {
    console.error('WebSocket error:', error);
  });
});

app.use(cors());

// Routes for fetching
app.get('/model', (req, res) => {
  const models = readModelData();
  res.json(models);
});

app.get('/questions', (req, res) => {
  const questions = readQuestionsData();
  res.json(questions);
});

const server = app.listen(port, () => {
  console.log(`Server listening at http://192.168.43.47:${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit('connection', socket, request);
  });
});

// Watch for changes in the Model data
fs.watch('./models/models.json', (eventType, filename) => {
  console.log(`File ${filename} changed. Reloading model data...`);
  const models = readModelData();
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(models));
    }
  });
});
