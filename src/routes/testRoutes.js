const express = require('express');
const router = express.Router();

// Ruta Simple sin parámetros
router.get('/test', (req, res) => {
    res.json({
        message: 'Ruta de prueba funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Ruta con parámetros Simples
router.get('/test/:id', (req, res) => {
    const { id } = req.params;
    res.json({
        message: `Ruta de prueba con ID ${id} funcionando correctamente`,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;