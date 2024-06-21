const repository = require('../database/circuitoRepository')

const getAll = async () => {
    repository.getAll();
}

const post = async (fileContent) => {
    // Tratando os dados do arquivo csv
    const array = fileContent.split(',').map((item) => {
        const match = item.match(/\d+/); // Procura por sequências de dígitos
        return match ? parseInt(match[0]) : null; // Converte para número inteiro se encontrado
    }).filter((numero) => numero !== null);
    console.log(array);

    for (let i = 0; i < array.length; i += 3) {
        console.log('Tempo: ', array[i]);
        console.log('Motor A: ', array[i+1]);
        console.log('Motor B: ', array[i+2]);
    }
}

module.exports = {
    getAll,
    post
}