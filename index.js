require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const { testConnection } = require('./src/config/database');
const { swaggerUi, specs, swaggerOptions } = require('./src/config/swagger');

const app = express();

// === CONFIGURACIONES Y MIDDLEWARES ===
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const isServerless = !!process.env.IS_OFFLINE || !!process.env.LAMBDA_TASK_ROOT;
const swaggerPrefix = isServerless ? '/dev' : ''; // Prefix en Serverless local

// === SWAGGER DOCS ===
if (process.env.NODE_ENV !== 'production' || process.env.SHOW_DOCS === 'true') {
    app.use(`${swaggerPrefix}/api-docs`, swaggerUi.serve, swaggerUi.setup(null, {
        ...swaggerOptions,
        swaggerUrl: `${swaggerPrefix}/api-docs.json`
    }));

    app.get(`${swaggerPrefix}/api-docs.json`, (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
}

// === RUTAS PRINCIPALES ===
app.use('/api', require('./src/routes/testRoutes'));
app.use('/api', require('./src/routes/campaignRoutes'));
app.use('/api', require('./src/routes/customerRoutes'));

// === RUTA DE INICIO ===
app.get('/', (req, res) => {
    res.json({
        message: 'API funcionando correctamente',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        enviroment: process.env.NODE_ENV || 'development',
        documentation: process.env.SHOW_DOCS === 'true' ? `${swaggerPrefix}/api-docs` : 'Documentación deshabilitada'
    });
});

// === RUTA DE SALUD ===
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Sinapsis SMS API' });
});

// === MANEJO DE ERRORES ===
app.use(require('./src/middlewares/errorHandler'));

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        timestamp: new Date().toISOString()
    });
});

// === EXPORTACIÓN PARA SERVERLESS ===
module.exports.handler = serverless(app);

// === INICIO LOCAL ===
if (require.main === module) {
    const startServer = async () => {
        try {
            console.log(`Node.js: ${process.version}`);
            console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
            await testConnection();

            const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => {
                console.log(`Servidor corriendo: http://localhost:${PORT}`);
                console.log(`Swagger docs: http://localhost:${PORT}${swaggerPrefix}/api-docs`);
            });
        } catch (error) {
            console.error('Error al iniciar servidor:', error);
            process.exit(1);
        }
    };

    startServer();
}
