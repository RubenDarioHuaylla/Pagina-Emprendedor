const db = require('../config/db');

const Rubro = {
    listar: async () => {
        const [rows] = await db.query('SELECT * FROM Rubros');
        return rows;
    }
};

module.exports = Rubro;
