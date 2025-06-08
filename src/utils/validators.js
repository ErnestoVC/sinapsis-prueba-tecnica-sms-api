const Joi = require('joi');

// Esquemas de validación para diferentes endpoints
const validateCampaignId = Joi.object({
  campaignId: Joi.number().integer().positive().required()
});

const validateDateRange = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
});

const validateCustomerId = Joi.object({
  customerId: Joi.number().integer().positive().required()
});

// Función para validar datos de entrada
const validateInput = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

module.exports = {
  validateCampaignId,
  validateDateRange,
  validateCustomerId,
  validateInput
};