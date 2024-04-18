// Import required modules
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load "water.proto" file
const waterProtoPath = path.join(__dirname, 'water', 'water.proto');
const packageDefinition = protoLoader.loadSync(waterProtoPath);
const water_proto = grpc.loadPackageDefinition(packageDefinition).water;

// Implement gRPC server method for GetWaterQuality
function getWaterQuality(call, callback) {
  // Dummy implementation for demonstration purposes
  const waterQualityData = {
    pH: 7.5,
    dissolved_oxygen: 8.2,
    turbidity: 15,
  };

  // Define acceptable ranges and risk levels for each parameter
  const parameterInfo = {
    pH: { range: { min: 6, max: 8 }, messages: ['No danger', 'Getting risky', 'Very dangerous'] },
    dissolved_oxygen: { range: { min: 5, max: 10 }, messages: ['No danger', 'Getting risky', 'Very dangerous'] },
    turbidity: { range: { min: 0, max: 20 }, messages: ['No danger', 'Getting risky', 'Very dangerous'] },
  };

  // Evaluate water quality parameters against acceptable ranges and risk levels
  const messages = {};
  for (const param in waterQualityData) {
    const value = waterQualityData[param];
    const range = parameterInfo[param].range;
    const levelMessages = parameterInfo[param].messages;
    if (value >= range.min && value <= range.max) {
      messages[param] = levelMessages[0]; // No danger
    } else if (value <= 2 * range.max) {
      messages[param] = levelMessages[1]; // Getting risky
    } else {
      messages[param] = levelMessages[2]; // Very dangerous
    }
  }

  // To respond with water quality data and messages
  callback(null, { water_quality: waterQualityData, messages });
}

// Create a new gRPC server
const server = new grpc.Server();

// Add the service along with its implementation to the gRPC server
server.addService(water_proto.WaterPollutionService.service, {
  GetWaterQuality: getWaterQuality,
});

// Link the server to the port and start it
const PORT = process.env.PORT || 50052;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Error starting server:', err);
    return;
  }
  console.log(`Water server started, listening on port ${port}`);
  server.start();
});
