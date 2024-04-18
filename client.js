// Import required modules
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load "air.proto" file
const AIR_PROTO_PATH = path.join(__dirname, '..', 'server', 'air', 'air.proto'); 
const airPackageDefinition = protoLoader.loadSync(AIR_PROTO_PATH);
const air_proto = grpc.loadPackageDefinition(airPackageDefinition).air;

// Load "sea.proto" file
const SEA_PROTO_PATH = path.join(__dirname, '..', 'server', 'sea', 'sea.proto'); 
const seaPackageDefinition = protoLoader.loadSync(SEA_PROTO_PATH);
const sea_proto = grpc.loadPackageDefinition(seaPackageDefinition).sea;

// Load "water.proto" file
const WATER_PROTO_PATH = path.join(__dirname, '..', 'server', 'water', 'water.proto'); 
const waterPackageDefinition = protoLoader.loadSync(WATER_PROTO_PATH);
const water_proto = grpc.loadPackageDefinition(waterPackageDefinition).water;

// Create gRPC clients for each service
const airClient = new air_proto.AirPollutionService('localhost:50051', grpc.credentials.createInsecure());
const seaClient = new sea_proto.SeaPollutionService('localhost:50051', grpc.credentials.createInsecure());
const waterClient = new water_proto.WaterPollutionService('localhost:50051', grpc.credentials.createInsecure());

// Call gRPC service methods for each client

// For airClient
const airRequest = {
  // Populate with data according to the message structure in air.proto
};
airClient.GetAirQuality(airRequest, (error, response) => {
  if (error) {
    console.error('Air Error:', error);
    return;
  }
  console.log('Air Response:', response);
});

// For seaClient
const seaRequest = {
  // Populate with data according to the message structure in sea.proto
};
seaClient.GetSeaPollutionData(seaRequest, (error, response) => {
  if (error) {
    console.error('Sea Error:', error);
    return;
  }
  console.log('Sea Response:', response);
});

// For waterClient
const waterRequest = {
  // Populate with data according to the message structure in water.proto
};
waterClient.GetWaterQuality(waterRequest, (error, response) => {
  if (error) {
    console.error('Water Error:', error);
    return;
  }
  console.log('Water Response:', response);
});