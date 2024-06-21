const Router = require('express');
const controller = require('../controller/circuitoController')
const multer = require('multer');

const upload = multer();

const circuitoRouter = Router();

circuitoRouter.get('/circuito', controller.getAll);
circuitoRouter.post('/circuito', upload.single('file'), controller.post)

module.exports = circuitoRouter;