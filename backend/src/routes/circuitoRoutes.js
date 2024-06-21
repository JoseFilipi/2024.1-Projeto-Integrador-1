const Router = require('express');
const circuitoController = require('../controller/circuitoController')

const circuitoRouter = Router();

circuitoRouter.get('/circuito', circuitoController.getAll);

module.exports = circuitoRouter;