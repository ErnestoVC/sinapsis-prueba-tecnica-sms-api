const { executeQuery } = require('../config/database');
const { successResponse, errorResponse, isValidId } = require('../utils/helpers');
const { validateInput, validateCampaignId } = require('../utils/validators');

/**
 * Endpoint 1: Calcular totales de una campaña
 * Actualiza total_records, total_sent, total_error
 */
const calculateCampaignTotals = async (req, res, next) => {
  try {
    const { campaignId } = validateInput(validateCampaignId, req.params);

    // Verificar que la campaña existe
    const campaignExists = await executeQuery(
      'SELECT id FROM campaigns WHERE id = ?',
      [campaignId]
    );

    if (campaignExists.length === 0) {
      return res.status(404).json(
        errorResponse('Campaña no encontrada', 404)
      );
    }

    // Calcular totales de la campaña
    const totalsQuery = `
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN shipping_status = 2 THEN 1 ELSE 0 END) as total_sent,
        SUM(CASE WHEN shipping_status = 3 THEN 1 ELSE 0 END) as total_error
      FROM messages 
      WHERE campaign_id = ?
    `;

    const [totals] = await executeQuery(totalsQuery, [campaignId]);

    // Actualizar la campaña con los totales calculados
    const updateQuery = `
      UPDATE campaigns 
      SET 
        total_records = ?,
        total_sent = ?,
        total_error = ?
      WHERE id = ?
    `;

    await executeQuery(updateQuery, [
      totals.total_records,
      totals.total_sent,
      totals.total_error,
      campaignId
    ]);

    // Obtener los datos actualizados
    const updatedCampaign = await executeQuery(
      'SELECT * FROM campaigns WHERE id = ?',
      [campaignId]
    );

    res.json(successResponse(
      {
        campaign: updatedCampaign[0],
        totals: {
          total_records: totals.total_records,
          total_sent: totals.total_sent,
          total_error: totals.total_error
        }
      },
      'Totales de campaña calculados y actualizados correctamente'
    ));

  } catch (error) {
    next(error);
  }
};

/**
 * Endpoint 2: Identificar estado de campaña
 * Actualiza process_status y final_hour
 */
const updateCampaignStatus = async (req, res, next) => {
  try {
    const { campaignId } = validateInput(validateCampaignId, req.params);

    // Verificar que la campaña existe
    const campaignExists = await executeQuery(
      'SELECT id FROM campaigns WHERE id = ?',
      [campaignId]
    );

    if (campaignExists.length === 0) {
      return res.status(404).json(
        errorResponse('Campaña no encontrada', 404)
      );
    }

    // Obtener todos los datos necesarios en una query
    const [campaignData] = await executeQuery(`
      SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN shipping_status = 1 THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN shipping_status = 2 THEN 1 ELSE 0 END) as sent_count,
        SUM(CASE WHEN shipping_status = 3 THEN 1 ELSE 0 END) as error_count,
        MAX(shipping_hour) as final_hour
      FROM messages 
      WHERE campaign_id = ?
    `, [campaignId]);

    const processStatus = campaignData.pending_count > 0 ? 1 : 2;
    
    // Actualizar el estado de la campaña
    await executeQuery(`
      UPDATE campaigns 
      SET 
        process_status = ?,
        final_hour = ?
      WHERE id = ?
    `, [processStatus, campaignData.final_hour, campaignId]);

    // Obtener los datos actualizados
    const [updatedCampaign] = await executeQuery(
      'SELECT * FROM campaigns WHERE id = ?',
      [campaignId]
    );

    res.json(successResponse(
      {
        campaign: updatedCampaign,
        calculations: {
          process_status: processStatus,
          status_description: processStatus === 1 ? 'Campaña pendiente' : 'Campaña finalizada',
          pending_messages: campaignData.pending_count,
          sent_messages: campaignData.sent_count,
          error_messages: campaignData.error_count,
          total_messages: campaignData.total_messages,
          final_hour: campaignData.final_hour
        }
      },
      'Estado de campaña actualizado correctamente'
    ));

  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateCampaignTotals,
  updateCampaignStatus
};