
const Rubro = require('../models/rubro.model');

exports.listarRubros = async (req, res) => {
    try {
        const categorias = await Rubro.listar();
        res.json(categorias);
    } catch (error) {
        console.error('Error al listar categorías:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};