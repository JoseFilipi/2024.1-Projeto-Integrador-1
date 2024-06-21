const service = require('../service/service')

const getAll = async (req, res) => {
    /*
        #swagger.tags = ['Circuito']
        #swagger.description = 'Dados sobre o circuito'
        #swagger.summary = 'Trás todas as informações sobre os circuitos realizados pelo carrinho.'
    */
   service.getAll();
   res.status(200).json({msg: 'ola'});
}

module.exports = {
    getAll
}