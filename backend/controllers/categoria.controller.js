
const Categoria = require('../models/categoria.model');

exports.listarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.listar();
        res.json(categorias);
    } catch (error) {
        console.error('Error al listar categorías:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};