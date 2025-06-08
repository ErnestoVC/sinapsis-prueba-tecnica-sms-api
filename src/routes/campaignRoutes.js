// src/routes/campaignRoutes.js - VERSIÓN CORREGIDA
const express = require('express');
const router = express.Router();
const { calculateCampaignTotals, updateCampaignStatus } = require('../controllers/campaignController');

/**
 * @swagger
 * tags:
 *   - name: Campaigns
 *     description: Operaciones para gestionar campañas de mensajería SMS
 */

/**
 * @swagger
 * /api/campaigns/{id}/calculate-totals:
 *   put:
 *     summary: Calcular totales de una campaña
 *     description: |
 *       Calcula y actualiza los totales de una campaña específica:
 *       - total_records: Número total de mensajes
 *       - total_sent: Mensajes enviados exitosamente (status = 2)
 *       - total_error: Mensajes con error (status = 3)
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la campaña
 *         example: 1
 *     responses:
 *       200:
 *         description: Totales calculados y actualizados correctamente
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
 *                   example: "Totales de campaña calculados y actualizados correctamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     campaign:
 *                       $ref: '#/components/schemas/Campaign'
 *                     totals:
 *                       type: object
 *                       properties:
 *                         total_records:
 *                           type: integer
 *                           example: 100
 *                         total_sent:
 *                           type: integer
 *                           example: 75
 *                         total_error:
 *                           type: integer
 *                           example: 10
 *       404:
 *         description: Campaña no encontrada
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
 *                   example: "Campaña no encontrada"
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
router.put('/campaigns/:campaignId/calculate-totals', calculateCampaignTotals);

/**
 * @swagger
 * /api/campaigns/{id}/update-status:
 *   put:
 *     summary: Actualizar estado de campaña
 *     description: |
 *       Identifica y actualiza el estado de una campaña:
 *       - process_status = 1: Campaña pendiente (tiene mensajes con status = 1)
 *       - process_status = 2: Campaña finalizada (sin mensajes pendientes)
 *       - final_hour: Se actualiza SIEMPRE con la hora del último mensaje procesado
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la campaña
 *         example: 3
 *     responses:
 *       200:
 *         description: Estado de campaña actualizado correctamente
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
 *                   example: "Estado de campaña actualizado correctamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     campaign:
 *                       $ref: '#/components/schemas/Campaign'
 *                     calculations:
 *                       type: object
 *                       properties:
 *                         process_status:
 *                           type: integer
 *                           enum: [1, 2]
 *                           example: 2
 *                         status_description:
 *                           type: string
 *                           example: "Campaña finalizada"
 *                         pending_messages:
 *                           type: integer
 *                           example: 0
 *                         sent_messages:
 *                           type: integer
 *                           example: 15
 *                         error_messages:
 *                           type: integer
 *                           example: 5
 *                         final_hour:
 *                           type: string
 *                           format: time
 *                           example: "17:45:30"
 *       404:
 *         description: Campaña no encontrada
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
 *                   example: "Campaña no encontrada"
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
router.put('/campaigns/:campaignId/update-status', updateCampaignStatus);

module.exports = router;