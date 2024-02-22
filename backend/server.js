// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const modelsController = require('./controllers/modelsController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

// Serve dummy model data to clients upon connection
io.on('connection', (socket) => {
  console.log('A client connected');

  // Emit dummy model data to the client
  socket.emit('models', require('./models/dummyModels'));

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Routes
app.get('/models', modelsController.getAllModels);
