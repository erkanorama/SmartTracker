// Import required modules
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load "air.proto" file
const airProtoPath = path.join(__dirname, 'air', 'air.proto');
const packageDefinition = protoLoader.loadSync(airProtoPath);
const air_proto = grpc.loadPackageDefinition(packageDefinition).air;

// To implement gRPC server method for GetAirQuality
function getAirQuality(call, callback) {
  // Dummy implementation for demonstration purposes
  const airQualityData = {
    pm25: 15,
    pm10: 20,
    co2: 400,
    no2: 10,
  };

  // Define acceptable ranges and risk levels for each parameter
  const parameterInfo = {
    pm25: { range: { min: 0, max: 12 }, messages: ['No danger', 'Getting risky', 'Very dangerous'] },
    pm10: { range: { min: 0, max: 25 }, messages: ['No danger', 'Getting risky', 'Very dangerous'] },
    co2: { range: { min: 0, max: 400 }, messages: ['No danger', 'Getting risky', 'Very dangerous'] },
    no2: { range: { min: 0, max: 40 }, messages: ['No danger', 'Getting risky', 'Very dangerous'] },
  };

  // Evaluate air quality parameters against acceptable ranges and risk levels
  const messages = {};
  for (const param in airQualityData) {
    const value = airQualityData[param];
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

  // To respond with air quality data and messages
  callback(null, { air_quality: airQualityData, messages });
}

// To create a new gRPC server
const server = new grpc.Server();

// This line adds the service along with its implementation to the gRPC server. 
// It allows the server to handle incoming requests for this specific service 
// by mapping each RPC method to its corresponding implementation function.
server.addService(air_proto.AirPollutionService.service, {
  GetAirQuality: getAirQuality,
});

// To Link the server to the port and start it
const PORT = process.env.PORT || 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Error starting server:', err);
    return;
  }
  console.log(`Server started, listening on port ${port}`);
  server.start();
});
