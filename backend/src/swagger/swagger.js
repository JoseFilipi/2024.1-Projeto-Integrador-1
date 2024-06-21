const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        openapi: "1.0.0",
        language: "pt-BR",
        title: "API do projeto de PI1",
        description: "REST API Node do projeto de PI1",
        version: "1.0.0"
    },
    host: "localhost:3000",
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local",
        }
    ],
    definitions: {
        description: {
            title: "string",
            description: "string",
        },
    },
};

const outputFile = './swagger_output.json';

const entryPoint = [
    '../routes/circuitoRoutes.js'
];

swaggerAutogen(outputFile, entryPoint, doc);