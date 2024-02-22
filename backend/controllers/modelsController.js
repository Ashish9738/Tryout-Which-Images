// modelsController.js
const dummyModels = require('../models/dummyModels');

// Controller function to get all models
exports.getAllModels = (req, res) => {
  // Send dummy model data to the client
  res.json(dummyModels);
};
