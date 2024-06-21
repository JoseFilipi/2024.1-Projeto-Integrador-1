const openDb = require('./config/configDb');

const getAll = async () => {
    openDb().then((db) => {
        db.each('SELECT * FROM car', (err, row) => {
            if (err) {
              console.error(err.message);
            }
            console.log(row);
          });
    });
}

module.exports = {
    getAll
}