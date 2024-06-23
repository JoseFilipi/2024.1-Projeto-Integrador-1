const service = require('../service/circuitoService')

const getAll = async (req, res) => {
    /*
        #swagger.tags = ['Circuito']
        #swagger.description = 'Dados sobre o circuito'
        #swagger.summary = 'Trás todas as informações sobre os circuitos realizados pelo carrinho.'
    */
    try {
        const circuitos = await service.getAll();
        res.status(200).json(circuitos);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Erro ao buscar os circuitos' });
    }
};

const post = async (req, res) => {
    /*
        #swagger.tags = ['Circuito']
        #swagger.description = 'Insere os dados de um circuito'
        #swagger.summary = 'Recebe um arquivo .csv com os dados do circuito e insere no nosso banco de dados'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['file'] = {
            in: 'formData',
            type: 'file',
            required: true,
            description: 'Arquivo para upload'
        }
    */

    if (!req.file) {
        return res.status(400).json({ error: 'Arquivo não encontrado' });
    }

    try {
        const fileContent = req.file.buffer.toString('utf-8');
        await service.post(fileContent);
        res.status(201).json({ msg: 'Dados inseridos com sucesso' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Erro ao inserir os dados do circuito' });
    }
};

module.exports = {
    getAll,
    post
}