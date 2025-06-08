const { executeQuery } = require('../config/database');
const { successResponse, errorResponse, isValidDate, formatDateForMySQL, calculatePercentage } = require('../utils/helpers');
const { validateInput, validateDateRange, validateCustomerId } = require('../utils/validators');

/**
 * Endpoint 3: Reporte de clientes por rango de fechas
 * Retorna lista de clientes con total de mensajes exitosos
 */
const getCustomersByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = validateInput(validateDateRange, req.query);

    const query = `
      SELECT 
        c.id as customer_id,
        c.name as customer_name,
        COUNT(CASE WHEN m.shipping_status = 2 THEN 1 END) as successful_messages
      FROM customers c
      INNER JOIN users u ON c.id = u.customer_id AND u.deleted = 0
      INNER JOIN campaigns camp ON u.id = camp.user_id 
        AND camp.process_date BETWEEN ? AND ?
      INNER JOIN messages m ON camp.id = m.campaign_id AND m.shipping_status = 2
      WHERE c.deleted = 0
      GROUP BY c.id, c.name
      ORDER BY successful_messages DESC, c.name ASC
    `;

    const customers = await executeQuery(query, [startDate, endDate]);
    const totalSuccessfulMessages = customers.reduce((sum, c) => sum + c.successful_messages, 0);

    res.json(successResponse(
      {
        date_range: { start_date: startDate, end_date: endDate },
        summary: {
          total_customers: customers.length,
          total_successful_messages: totalSuccessfulMessages
        },
        customers
      },
      `${customers.length} clientes con mensajes exitosos encontrados`
    ));


  } catch (error) {
    next(error);
  }
};

/**
 * Endpoint 4: Porcentaje de participación por usuario
 * Retorna usuarios de un cliente con su porcentaje de participación
 */
const getUserParticipation = async (req, res, next) => {
  try {
    const { customerId } = validateInput(validateCustomerId, req.params);

    // Verificar que el cliente existe
    const customerExists = await executeQuery(
      'SELECT id, name FROM customers WHERE id = ? AND deleted = 0',
      [customerId]
    );

    if (customerExists.length === 0) {
      return res.status(404).json(
        errorResponse('Cliente no encontrado', 404)
      );
    }

    // 1. Obtener el total de mensajes exitosos del cliente
    const [clientTotal] = await executeQuery(`
      SELECT COUNT(*) as total_successful_messages
      FROM users u
      INNER JOIN campaigns camp ON u.id = camp.user_id
      INNER JOIN messages m ON camp.id = m.campaign_id
      WHERE u.customer_id = ? AND u.deleted = 0 AND m.shipping_status = 2
    `, [customerId]);

    const totalClientSuccessful = parseInt(clientTotal.total_successful_messages) || 0;

    // 2. Obtener usuarios con sus estadiscas individuales
    const usersQuery = `
      SELECT 
        u.id as user_id,
        u.username,
        COUNT(CASE WHEN m.shipping_status = 2 THEN 1 END) as successful_messages,
        COUNT(CASE WHEN m.shipping_status = 1 THEN 1 END) as pending_messages,
        COUNT(CASE WHEN m.shipping_status = 3 THEN 1 END) as error_messages,
        COUNT(DISTINCT camp.id) as total_campaigns,
        COUNT(m.id) as total_messages
      FROM users u
      LEFT JOIN campaigns camp ON u.id = camp.user_id
      LEFT JOIN messages m ON camp.id = m.campaign_id
      WHERE u.customer_id = ? AND u.deleted = 0
      GROUP BY u.id, u.username
      ORDER BY successful_messages DESC, u.username ASC
    `;

    const users = await executeQuery(usersQuery, [customerId]);

    // 3. Calcular porcentaje de participación
    const calculatePercentage = (userMessages, totalMessages) => {
      if (!totalMessages || totalMessages === 0) return 0;
      return Math.round((userMessages / totalMessages) * 10000) / 100; // 2 decimales
    };

    const usersWithParticipation = users.map(user => ({
      user_id: parseInt(user.user_id),
      username: user.username,
      successful_messages: parseInt(user.successful_messages) || 0,
      pending_messages: parseInt(user.pending_messages) || 0,
      error_messages: parseInt(user.error_messages) || 0,
      total_campaigns: parseInt(user.total_campaigns) || 0,
      total_messages: parseInt(user.total_messages) || 0,
      participation_percentage: calculatePercentage(
        parseInt(user.successful_messages) || 0,
        totalClientSuccessful
      )
    }));

    // 4. Verificar los proncentajes deben sumar 100%
    const totalPercentage = usersWithParticipation.reduce(
      (sum, user) => sum + user.participation_percentage, 0
    );

    // 5. Verificar tototal de mensajes exitosos debe ser igual al total del cliente
    const calculatedTotal = usersWithParticipation.reduce(
      (sum, user) => sum + user.successful_messages, 0
    );

    res.json(successResponse(
      {
        customer: {
          customer_id: parseInt(customerExists[0].id),
          customer_name: customerExists[0].name,
          total_successful_messages: totalClientSuccessful
        },
        summary: {
          total_users: users.length,
          users_with_successful_messages: usersWithParticipation.filter(u => u.successful_messages > 0).length,
          users_without_activity: usersWithParticipation.filter(u => u.successful_messages === 0).length,
          total_successful_messages: totalClientSuccessful,
          calculated_total_check: calculatedTotal, // Para verificar que coincide
          total_percentage_check: Math.round(totalPercentage * 100) / 100 // Debe ser ~100%
        },
        users: usersWithParticipation
      },
      `Participación de ${users.length} usuarios calculada correctamente`
    ));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomersByDateRange,
  getUserParticipation
};