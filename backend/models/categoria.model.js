const db = require('../config/db');

const Categoria = {
    listar: async () => {
        const [rows] = await db.query('SELECT * FROM Categorias');
        return rows;
    }
};

module.exports = Categoria;
