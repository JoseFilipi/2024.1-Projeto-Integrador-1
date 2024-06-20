const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger_output.json');

const app = express();
const PORT = 3000;

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`)
});