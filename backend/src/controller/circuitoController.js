const service = require('../service/circuitoService')

const getAll = async (req, res) => {
    /*
        #swagger.tags = ['Circuito']
        #swagger.description = 'Dados sobre o circuito'
        #swagger.summary = 'Trás todas as informações sobre os circuitos realizados pelo carrinho.'
    */
    service.getAll();
    res.status(200).json({ msg: 'ola' });
}

const post = async (req, res) => {
    /*
        #swagger.tags = ['Circuito']
        #swagger.description = ''
        #swagger.summary = ''
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['file'] = {
            in: 'formData',
            type: 'file',
            required: true,
            description: 'Arquivo para upload'
        }
    */

    if (req.file) {
        const fileContent = req.file.buffer.toString('utf-8');
        console.log(fileContent);
    }

    res.status(200).json({ msg: 'ola' });
}

module.exports = {
    getAll,
    post
}