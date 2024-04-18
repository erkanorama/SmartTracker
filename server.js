// Import required modules
const grpc = require('@grpc/grpc-js'); // To import gRPC module
const protoLoader = require('@grpc/proto-loader'); // To import proto loader module
const path = require('path'); // To import path module

// Load the protobuf files
const airProtoPath = path.join(__dirname, 'air', 'air.proto'); // To define the path to the air.proto file
const waterProtoPath = path.join(__dirname, 'water', 'water.proto'); // To define the path to the water.proto file
const seaProtoPath = path.join(__dirname, 'sea', 'sea.proto'); // To define the path to the sea.proto file

const airDefinition = protoLoader.loadSync(airProtoPath); // To load the air.proto file using proto loader
const waterDefinition = protoLoader.loadSync(waterProtoPath); // To load the water.proto file using proto loader
const seaDefinition = protoLoader.loadSync(seaProtoPath); // To load the sea.proto file using proto loader

// Load the package definitions
const airPackageDefinition = grpc.loadPackageDefinition(airDefinition).air; // To load the air proto definition
const waterPackageDefinition = grpc.loadPackageDefinition(waterDefinition).water; // To load the water proto definition
const seaPackageDefinition = grpc.loadPackageDefinition(seaDefinition).sea; // To load the sea proto definition

// Implement gRPC server methods for air pollution service

// Method to get air quality data
function getAirQuality(call, callback) {
  // Dummy implementation for demonstration purposes
  const airQualityData = {
    pm25: 15,
    pm10: 20,
    co2: 400,
    no2: 10,
  };
  callback(null, airQualityData); // To respond with air quality data
}

// Implement gRPC server methods for water pollution service

// Method to get water quality data
function getWaterQuality(call, callback) {
  // Dummy implementation for demonstration purposes
  const waterQualityData = {
    pH: 7.5,
    dissolved_oxygen: 8.2,
    turbidity: 15,
  };
  callback(null, waterQualityData); // To respond with water quality data
}

// Implement gRPC server methods for sea pollution service

// Method to get sea quality data
function getSeaQuality(call, callback) {
  // Dummy implementation for demonstration purposes
  const seaQualityData = {
    mercury_level: 0.1,
    lead_level: 0.05,
    arsenic_level: 0.02,
  };
  callback(null, seaQualityData); // To respond with sea quality data
}

// Create a new gRPC server
const server = new grpc.Server();

// Add the services with their implementations to the server
server.addService(airPackageDefinition.AirPollutionService.service, {
  GetAirQuality: getAirQuality, // To add method for getting air quality
});

server.addService(waterPackageDefinition.WaterPollutionService.service, {
  GetWaterQuality: getWaterQuality, // To add method for getting water quality
});

server.addService(seaPackageDefinition.SeaPollutionService.service, {
  GetSeaPollutionData: getSeaQuality, // To add method for getting sea quality
});

// Bind the server to the port and start it
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Error starting server:', err);
    return;
  }
  console.log(`Server started, listening on port ${port}`);
  server.start();
});
