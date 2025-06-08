const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sinapsis SMS Marketing API',
            version: '1.0.0',
            description: 'API RESTful para gestionar campañas de mensajería SMS, clientes, usuarios y reportes de marketing',
            contact: {
                name: 'Equipo de Desarrollo',
                email: 'dev@sinapsis.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? process.env.PROD_API_URL || 'https://dev.sinapsis.test.com'
                    : `http://localhost:${process.env.PORT || 3000}`,
                description: process.env.NODE_ENV === 'production' ? 'Servidor de Producción' : 'Servidor de Desarrollo'
            }
        ],
        components: {
            schemas: {
                // === MODELOS PRINCIPALES ===
                Customer: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        id: { type: 'integer', example: 1, description: 'ID único del cliente' },
                        name: { type: 'string', example: 'Youfeed', description: 'Nombre del cliente' },
                        deleted: { type: 'boolean', example: false, description: 'Indica si el cliente está eliminado' }
                    }
                },
                User: {
                    type: 'object',
                    required: ['customer_id', 'username'],
                    properties: {
                        id: { type: 'integer', example: 1, description: 'ID único del usuario' },
                        customer_id: { type: 'integer', example: 6, description: 'ID del cliente al que pertenece' },
                        username: { type: 'string', example: 'minsall0', description: 'Nombre de usuario' },
                        deleted: { type: 'boolean', example: false, description: 'Indica si el usuario está eliminado' }
                    }
                },
                Campaign: {
                    type: 'object',
                    required: ['user_id', 'name'],
                    properties: {
                        id: { type: 'integer', example: 1, description: 'ID único de la campaña' },
                        user_id: { type: 'integer', example: 7, description: 'ID del usuario que creó la campaña' },
                        name: { type: 'string', example: 'CITIZENS BUSINESS BANK', description: 'Nombre de la campaña' },
                        process_date: { type: 'string', format: 'date', example: '2025-01-23', description: 'Fecha de procesamiento' },
                        process_hour: { type: 'string', format: 'time', example: '07:05:57', description: 'Hora de inicio del procesamiento' },
                        total_records: { type: 'integer', example: 100, description: 'Total de mensajes en la campaña' },
                        total_sent: { type: 'integer', example: 75, description: 'Total de mensajes enviados exitosamente' },
                        total_error: { type: 'integer', example: 10, description: 'Total de mensajes con error' },
                        process_status: {
                            type: 'integer',
                            enum: [1, 2],
                            example: 2,
                            description: '1: Pendiente (tiene mensajes pendientes), 2: Finalizada (sin mensajes pendientes)'
                        },
                        final_hour: { type: 'string', format: 'time', example: '18:30:45', description: 'Hora del último mensaje procesado' }
                    }
                },
                Message: {
                    type: 'object',
                    required: ['campaign_id', 'phone', 'text'],
                    properties: {
                        id: { type: 'integer', example: 1, description: 'ID único del mensaje' },
                        campaign_id: { type: 'integer', example: 6, description: 'ID de la campaña' },
                        phone: {
                            type: 'string',
                            example: '2087415062',
                            description: 'Número de teléfono (10 dígitos)',
                            pattern: '^[0-9]{10}$'
                        },
                        text: {
                            type: 'string',
                            example: 'Tu mensaje promocional aquí',
                            maxLength: 160,
                            description: 'Contenido del mensaje SMS (máx. 160 caracteres)'
                        },
                        shipping_status: {
                            type: 'integer',
                            enum: [1, 2, 3],
                            example: 1,
                            description: '1: Pendiente, 2: Enviado con éxito, 3: Error en envío'
                        },
                        shipping_hour: { type: 'string', format: 'time', example: '11:46:30', description: 'Hora de envío del mensaje' }
                    }
                },

                // === RESPUESTAS ESTÁNDAR ===
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true, description: 'Indica si la operación fue exitosa' },
                        message: { type: 'string', example: 'Operación completada correctamente', description: 'Mensaje descriptivo de la respuesta' },
                        data: { type: 'object', description: 'Datos de respuesta específicos del endpoint' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false, description: 'Indica que la operación falló' },
                        message: { type: 'string', example: 'Error en la operación', description: 'Mensaje descriptivo del error' },
                        error_code: { type: 'integer', example: 404, description: 'Código de error HTTP' },
                        timestamp: { type: 'string', format: 'date-time', example: '2025-01-23T10:30:00.000Z' }
                    }
                },

                // === MODELOS ESPECÍFICOS DE RESPUESTA ===
                CampaignTotalsResponse: {
                    type: 'object',
                    properties: {
                        campaign: { $ref: '#/components/schemas/Campaign' },
                        totals: {
                            type: 'object',
                            properties: {
                                total_records: { type: 'integer', example: 100, description: 'Total de mensajes en la campaña' },
                                total_sent: { type: 'integer', example: 75, description: 'Total de mensajes enviados' },
                                total_error: { type: 'integer', example: 10, description: 'Total de mensajes con error' }
                            }
                        }
                    }
                },
                CampaignStatusResponse: {
                    type: 'object',
                    properties: {
                        campaign: { $ref: '#/components/schemas/Campaign' },
                        status: {
                            type: 'object',
                            properties: {
                                process_status: { type: 'integer', enum: [1, 2], example: 2 },
                                status_description: { type: 'string', example: 'Campaña finalizada' },
                                pending_messages: { type: 'integer', example: 0 },
                                sent_messages: { type: 'integer', example: 75 },
                                error_messages: { type: 'integer', example: 10 }
                            }
                        }
                    }
                },
                CustomerWithMessages: {
                    type: 'object',
                    properties: {
                        customer_id: { type: 'integer', example: 1 },
                        customer_name: { type: 'string', example: 'Youfeed' },
                        successful_messages: { type: 'integer', example: 150, description: 'Total de mensajes exitosos en el rango de fechas' },
                        campaigns_in_range: { type: 'integer', example: 5, description: 'Número de campañas en el rango de fechas' }
                    }
                },
                UserParticipation: {
                    type: 'object',
                    properties: {
                        user_id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'minsall0' },
                        successful_messages: { type: 'integer', example: 45, description: 'Mensajes exitosos del usuario' },
                        total_campaigns: { type: 'integer', example: 3, description: 'Total de campañas del usuario' },
                        participation_percentage: {
                            type: 'number',
                            format: 'float',
                            example: 30.5,
                            description: 'Porcentaje de participación basado en mensajes exitosos'
                        }
                    }
                }
            },

            // === PARÁMETROS REUTILIZABLES ===
            parameters: {
                CampaignId: {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer', minimum: 1 },
                    description: 'ID único de la campaña',
                    example: 1
                },
                CustomerId: {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer', minimum: 1 },
                    description: 'ID único del cliente',
                    example: 1
                },
                StartDate: {
                    in: 'query',
                    name: 'startDate',
                    required: true,
                    schema: { type: 'string', format: 'date' },
                    description: 'Fecha inicial en formato YYYY-MM-DD',
                    example: '2025-01-01'
                },
                EndDate: {
                    in: 'query',
                    name: 'endDate',
                    required: true,
                    schema: { type: 'string', format: 'date' },
                    description: 'Fecha final en formato YYYY-MM-DD (debe ser >= startDate)',
                    example: '2025-03-31'
                }
            },

            // === RESPUESTAS REUTILIZABLES ===
            responses: {
                Success: {
                    description: 'Operación exitosa',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ApiResponse' }
                        }
                    }
                },
                NotFound: {
                    description: 'Recurso no encontrado',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                message: 'Recurso no encontrado',
                                error_code: 404,
                                timestamp: '2025-01-23T10:30:00.000Z'
                            }
                        }
                    }
                },
                BadRequest: {
                    description: 'Solicitud incorrecta - Datos de entrada inválidos',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                message: 'Datos de entrada inválidos',
                                error_code: 400,
                                timestamp: '2025-01-23T10:30:00.000Z'
                            }
                        }
                    }
                },
                InternalError: {
                    description: 'Error interno del servidor',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                message: 'Error interno del servidor',
                                error_code: 500,
                                timestamp: '2025-01-23T10:30:00.000Z'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: [
        './src/routes/*.js',      // Documentación en archivos de rutas
        './src/controllers/*.js', // Documentación adicional en controladores si es necesario
        './index.js'              // Documentación general en el archivo principal
    ]
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
    explorer: true,
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customSiteTitle: "Sinapsis SMS API - Documentación",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
        url: '/api-docs.json',
        persistAuthorization: true,
        displayOperationId: true,
        filter: true,
        tryItOutEnabled: true,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        docExpansion: 'list'
    }
};

module.exports = {
    swaggerUi,
    specs,
    swaggerOptions
};