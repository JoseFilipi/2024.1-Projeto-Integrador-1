const repository = require('../database/circuitoRepository')

const getAll = () => {
    repository.getAll();
}

module.exports = {
    getAll
}