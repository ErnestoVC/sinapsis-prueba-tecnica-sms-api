/**
 * Formatea respuestas exitosas de la API
 * @param {*} data - Datos a retornar
 * @param {string} message - Mensaje descriptivo
 * @param {number} statusCode - Código de estado HTTP
 */
const successResponse = (data, message = 'Operación exitosa', statusCode = 200) => {
    return {
        success: true,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};

/**
 * Formatea respuestas de error de la API
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP
 * @param {*} details - Detalles adicionales del error
 */
const errorResponse = (message, statusCode = 500, details = null) => {
    return {
        success: false,
        statusCode,
        message,
        details,
        timestamp: new Date().toISOString()
    };
};

/**
 * Valida si una fecha está en formato válido
 * @param {string} dateString - Fecha en formato string
 */
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

/**
 * Convierte fecha a formato MySQL
 * @param {string} dateString - Fecha en formato string
 */
const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

/**
 * Calcula porcentaje con precisión decimal
 * @param {number} part - Parte del total
 * @param {number} total - Total
 * @param {number} decimals - Número de decimales
 */
const calculatePercentage = (part, total, decimals = 2) => {
    if (total === 0) return 0;
    return Number(((part / total) * 100).toFixed(decimals));
};

/**
 * Valida si un ID es un número entero positivo
 * @param {*} id - ID a validar
 */
const isValidId = (id) => {
    const numId = parseInt(id);
    return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
};

module.exports = {
    successResponse,
    errorResponse,
    isValidDate,
    formatDateForMySQL,
    calculatePercentage,
    isValidId
};