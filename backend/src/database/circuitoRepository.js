const openDb = require('./config/configDb');

const getAll = async () => {
  const db = await openDb();
  const query = 'SELECT * FROM circuito;';
  const circuitos = await db.all(query);
  
  return circuitos;
};

const post = async (aceleracao, tempoDeViagem, velocidadeInstantanea, distanciaPercorrida, energiaConsumida) => {
  openDb().then((db) => {
    const query = 'INSERT INTO circuito (instant_speed, instant_acceleration, energy_consumed, travelled_distance, travel_time) VALUES (?, ?, ?, ?, ?);';

    db.run(query, [velocidadeInstantanea, aceleracao, energiaConsumida, distanciaPercorrida, tempoDeViagem]);
  });
}

module.exports = {
  getAll,
  post
}