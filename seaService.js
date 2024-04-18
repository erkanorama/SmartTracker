// Import required modules
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load "sea.proto" file
const seaProtoPath = path.join(__dirname, 'sea', 'sea.proto');
const packageDefinition = protoLoader.loadSync(seaProtoPath);
const sea_proto = grpc.loadPackageDefinition(packageDefinition).sea;

// Implement gRPC server method for GetSeaPollutionData
function getSeaPollutionData(call, callback) {
  // Dummy implementation for demonstration purposes
  const seaPollutionData = {
    mercury_level: 0.1,
    lead_level: 0.05,
    arsenic_level: 0.02,
  };

  // Define acceptable ranges and risk levels for each parameter
  const parameterInfo = {
    mercury_level: { range: { min: 0, max: 0.1 }, messages: ['No danger', 'Getting risky', 'Very dangerous'] },
    lead_level: { range: { min: 0, max: 0.1 }, messages: ['No danger', 'Getting risky', 'Very dangerous'] },
    arsenic_level: { range: { min: 0, max: 0.1 }, messages: ['No danger', 'Getting risky', 'Very dangerous'] },
  };

  // Evaluate sea pollution parameters against acceptable ranges and risk levels
  const messages = {};
  for (const param in seaPollutionData) {
    const value = seaPollutionData[param];
    const range = parameterInfo[param].range;
    const levelMessages = parameterInfo[param].messages;
    if (value <= range.max) {
      messages[param] = levelMessages[0]; // No danger
    } else if (value <= 2 * range.max) {
      messages[param] = levelMessages[1]; // Getting risky
    } else {
      messages[param] = levelMessages[2]; // Very dangerous
    }
  }

  // To respond with sea pollution data and messages
  callback(null, { sea_pollution: seaPollutionData, messages });
}

// Create a new gRPC server
const server = new grpc.Server();

// Add the service along with its implementation to the gRPC server
server.addService(sea_proto.SeaPollutionService.service, {
  GetSeaPollutionData: getSeaPollutionData,
});

// Link the server to the port and start it
const PORT = process.env.PORT || 50053;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Error starting server:', err);
    return;
  }
  console.log(`Sea server started, listening on port ${port}`);
  server.start();
});
