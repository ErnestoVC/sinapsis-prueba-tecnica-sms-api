const { errorResponse } = require('../utils/helpers');

// Middleware para manejo centralizado de errores
const errorHandler = (err, req, res, next) => {
    console.error('Error capturado:', err);

    // Error de validación de Joi
    if (err.message.includes('ValidationError') || err.message.includes('"')) {
        return res.status(400).json(
            errorResponse('Datos de entrada inválidos', 400, err.message)
        );
    }

    // Error de base de datos
    if (err.code) {
        switch (err.code) {
            case 'ER_NO_SUCH_TABLE':
                return res.status(500).json(
                    errorResponse('Tabla no encontrada en la base de datos', 500)
                );
            case 'ER_BAD_FIELD_ERROR':
                return res.status(500).json(
                    errorResponse('Campo no válido en la consulta', 500)
                );
            case 'ECONNREFUSED':
                return res.status(500).json(
                    errorResponse('No se puede conectar a la base de datos', 500)
                );
            default:
                return res.status(500).json(
                    errorResponse('Error de base de datos', 500, err.message)
                );
        }
    }

    // Error genérico
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json(errorResponse(message, statusCode));
};

module.exports = errorHandler;