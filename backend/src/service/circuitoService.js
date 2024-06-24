const repository = require('../database/circuitoRepository');

const getAll = async () => {
    return await repository.getAll();
}

const post = async (fileContent) => {
    const tempos = [];
    const velocidades = [];
    let aceleracao = 0;
    let velocidadeInstantanea = 0;
    let distanciaPercorrida = 0;
    let tempoDeViagem = 0;
    let energiaConsumida = 0;

    // Tratando os dados do arquivo csv
    const csvToArray = fileContent.split(',').map((item) => {
        const match = item.match(/\d+/); // Procura por sequências de dígitos
        return match ? parseInt(match[0]) : null; // Converte para número inteiro se encontrado
    }).filter((numero) => numero !== null);

    for (let i = 0; i < csvToArray.length; i += 3) {
        tempos.push(csvToArray[i]);

        const rotacaoMotorA = csvToArray[i+1];
        const rotacaoMotorB = csvToArray[i+2];
        const pi = Math.PI;
        const raioRoda = 0.033;
        const velocidadeMotorA = 2*pi*raioRoda*rotacaoMotorA;
        const velocidadeMotorB = 2*pi*raioRoda*rotacaoMotorB;

        velocidades.push((velocidadeMotorA+velocidadeMotorB)/2);
    }

    const variacaoDoVelocidade = velocidades[velocidades.length-1] - velocidades[0];
    const variacaoDoTempo = (tempos[tempos.length-1] - tempos[0]) / 1000;   // dividindo por mil para converter de milisegundo para segundos
    aceleracao = variacaoDoVelocidade/variacaoDoTempo;
    tempoDeViagem = (tempos[tempos.length-1]) / 1000;
    velocidadeInstantanea = velocidades[0] + (aceleracao*tempoDeViagem);
    distanciaPercorrida = velocidadeInstantanea * tempoDeViagem;
    energiaConsumida = csvToArray[csvToArray.length - 1];

    console.log(`Aceleração: ${aceleracao} m/s²`);
    console.log(`Tempo de Viagem: ${tempoDeViagem} s`);
    console.log(`Velocidade Instantânea: ${velocidadeInstantanea} m/s`);
    console.log(`Distância Percorrida: ${distanciaPercorrida} m`);
    console.log(`Energia Consumida:  ${energiaConsumida}`);

    await repository.post(aceleracao, tempoDeViagem, velocidadeInstantanea, distanciaPercorrida, energiaConsumida);
}

module.exports = {
    getAll,
    post
}