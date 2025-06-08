// src/routes/customerRoutes.js - VERSIÓN CORREGIDA
const express = require('express');
const router = express.Router();
const { getCustomersByDateRange, getUserParticipation } = require('../controllers/customerController');

/**
 * @swagger
 * tags:
 *   - name: Customers
 *     description: Operaciones para clientes, usuarios y reportes
 */

/**
 * @swagger
 * /api/customers/report:
 *   get:
 *     summary: Obtener reporte de clientes por rango de fechas
 *     description: |
 *       Retorna una lista de clientes con sus totales de mensajes exitosos
 *       en un rango de fechas específico. Solo incluye clientes que tuvieron
 *       al menos un mensaje exitoso (shipping_status = 2) en el período.
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial en formato YYYY-MM-DD
 *         example: "2025-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final en formato YYYY-MM-DD (debe ser >= startDate)
 *         example: "2025-03-31"
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "5 clientes con mensajes exitosos encontrados"
 *                 data:
 *                   type: object
 *                   properties:
 *                     date_range:
 *                       type: object
 *                       properties:
 *                         start_date:
 *                           type: string
 *                           format: date
 *                           example: "2025-01-01"
 *                         end_date:
 *                           type: string
 *                           format: date
 *                           example: "2025-03-31"
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total_customers:
 *                           type: integer
 *                           example: 5
 *                         total_successful_messages:
 *                           type: integer
 *                           example: 1250
 *                     customers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           customer_id:
 *                             type: integer
 *                             example: 1
 *                           customer_name:
 *                             type: string
 *                             example: "Youfeed"
 *                           successful_messages:
 *                             type: integer
 *                             example: 200
 *                           campaigns_in_range:
 *                             type: integer
 *                             example: 8
 *       400:
 *         description: Parámetros de fecha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Formato de fecha inválido"
 *                 error_code:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 *                 error_code:
 *                   type: integer
 *                   example: 500
 */
router.get('/customers/report', getCustomersByDateRange);

/**
 * @swagger
 * /api/customers/{id}/users/participation:
 *   get:
 *     summary: Obtener participación de usuarios de un cliente
 *     description: |
 *       Retorna la lista de usuarios de un cliente específico con su
 *       porcentaje de participación basado en mensajes exitosos.
 *       Porcentaje = (mensajes_exitosos_usuario / total_mensajes_exitosos_cliente) * 100
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del cliente
 *         example: 1
 *     responses:
 *       200:
 *         description: Participación de usuarios calculada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Participación de 3 usuarios calculada correctamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer:
 *                       type: object
 *                       properties:
 *                         customer_id:
 *                           type: integer
 *                           example: 1
 *                         customer_name:
 *                           type: string
 *                           example: "Youfeed"
 *                         total_successful_messages:
 *                           type: integer
 *                           example: 200
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total_users:
 *                           type: integer
 *                           example: 3
 *                         users_with_successful_messages:
 *                           type: integer
 *                           example: 2
 *                         total_successful_messages:
 *                           type: integer
 *                           example: 200
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                             example: 2
 *                           username:
 *                             type: string
 *                             example: "bsidgwick1"
 *                           successful_messages:
 *                             type: integer
 *                             example: 120
 *                           total_campaigns:
 *                             type: integer
 *                             example: 5
 *                           participation_percentage:
 *                             type: number
 *                             format: float
 *                             example: 60.0
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cliente no encontrado"
 *                 error_code:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 *                 error_code:
 *                   type: integer
 *                   example: 500
 */
router.get('/customers/:customerId/users/participation', getUserParticipation);

module.exports = router;