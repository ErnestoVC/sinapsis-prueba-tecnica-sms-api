# SMS Marketing API - Prueba Técnica Sinapsis

API RESTful desarrollada para la prueba técnica de Soporte TI de Sinapsis, implementando un sistema de gestión de campañas SMS con análisis de métricas y reportes.

## 🎯 Objetivo de la Prueba

Sistema que permite a los clientes programar campañas de marketing enviando mensajes publicitarios a través de SMS, con funcionalidades de seguimiento, análisis y reportes automatizados.

## 🗄️ Modelo de Base de Datos

El sistema maneja las siguientes entidades principales:

- **customers**: Clientes del sistema
- **users**: Usuarios asociados a cada cliente
- **campaigns**: Campañas de marketing creadas por usuarios
- **messages**: Mensajes individuales de cada campaña

### Estados de Mensajes (shipping_status)
- `1`: Mensaje pendiente
- `2`: Mensaje enviado con éxito
- `3`: Mensaje con error

### Estados de Campañas (process_status)
- `1`: Campaña pendiente (tiene mensajes en estado 1)
- `2`: Campaña finalizada (no tiene mensajes en estado 1)

## 🚀 Funcionalidades Implementadas

### ✅ Endpoints Desarrollados

1. **Cálculo de Totales de Campaña**
   - Calcula `total_records`, `total_sent`, `total_error`
   - Actualiza automáticamente las columnas respectivas

2. **Identificación de Estado de Campaña**
   - Determina si una campaña está pendiente o finalizada
   - Actualiza `process_status` y `final_hour` automáticamente

3. **Reporte de Mensajes Exitosos por Cliente**
   - Lista clientes con total de mensajes exitosos en rango de fechas
   - Filtrado por fecha inicial y final

4. **Análisis de Participación de Usuarios**
   - Lista usuarios de un cliente específico
   - Calcula porcentaje de participación de cada usuario
   - Fórmula: `(mensajes exitosos del usuario / mensajes exitosos del cliente) * 100`

### 🛠️ Características Técnicas

- **Runtime**: Node.js 20.x con Express 5.x
- **Base de Datos**: MySQL con cliente mysql2
- **Validación**: Joi para validación de esquemas
- **Documentación**: Swagger UI integrada
- **Arquitectura**: Serverless ready (AWS Lambda)
- **Hot Reload**: Nodemon para desarrollo
- **CORS**: Habilitado para integración frontend

## 📋 Requisitos Previos

- Node.js (versión 20.x recomendada)
- MySQL 5.7 o superior
- npm o yarn
- Archivo `db.sql` para restaurar la base de datos

## 🛠️ Instalación

1. **Clona el repositorio**
```bash
git clone <tu-repositorio>
cd sms-marketing-api
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
Copia el archivo `.env.example` a `.env` y configura tus valores:

```bash
cp .env.example .env
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Configuración de base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=sms_marketing
DB_PORT=3306

# Configuración del servidor
PORT=3000
NODE_ENV=development

# Swagger
SHOW_DOCS=true
```

4. **Restaura la base de datos**
```bash
# Importa el archivo db.sql proporcionado en la prueba técnica
mysql -u tu_usuario -p sms_marketing < db.sql
```

**Nota**: Asegúrate de tener el archivo `db.sql` del reto técnico en tu directorio de trabajo.

## 🚀 Uso

### Desarrollo Local

```bash
# Iniciar servidor en modo desarrollo con hot reload
npm run dev
```

```bash
# Iniciar servidor en modo producción
npm start
```

```bash
# Iniciar en modo serverless offline
npm run serverless:dev
```

El servidor se ejecutará en `http://localhost:3000`

### Endpoints Principales

- **Documentación API**: `http://localhost:3000/api-docs`
- **Estado de salud**: `http://localhost:3000/health`
- **Información del API**: `http://localhost:3000/`

### Endpoints de la Prueba Técnica

#### 1. Calcular Totales de Campaña
```
PUT /api/campaigns/:id/calculate-totals
```
Calcula y actualiza `total_records`, `total_sent`, `total_error` de una campaña específica.

#### 2. Actualizar Estado de Campaña
```
PUT /api/campaigns/:id/update-status
```
Identifica y actualiza el estado de la campaña (`process_status`). Si está finalizada, actualiza también `final_hour`.

#### 3. Reporte de Clientes por Rango de Fechas
```
GET /api/reports/customers-success-messages?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```
Retorna lista de clientes con total de mensajes exitosos en el rango especificado.

#### 4. Participación de Usuarios por Cliente
```
GET /api/reports/customer/:id/users-participation
```
Retorna lista de usuarios del cliente con su porcentaje de participación.

### Endpoints Adicionales

- `/api/test` - Rutas de prueba y testing
- `/api/campaigns` - CRUD completo de campañas
- `/api/customers` - CRUD completo de clientes

## 📚 Documentación

## 📊 Lógica de Negocio

### Cálculo de Totales de Campaña
- `total_records`: Cuenta total de mensajes en la campaña
- `total_sent`: Mensajes con `shipping_status = 2`
- `total_error`: Mensajes con `shipping_status = 3`

### Determinación de Estado de Campaña
- **Pendiente (1)**: La campaña tiene mensajes con `shipping_status = 1`
- **Finalizada (2)**: La campaña no tiene mensajes pendientes
- `final_hour`: Se actualiza con el mayor `shipping_hour` de todos los mensajes

### Cálculo de Participación de Usuario
```
% participación = (mensajes exitosos del usuario / mensajes exitosos del cliente) × 100
```

Donde:
- **Mensajes exitosos del usuario**: Suma de mensajes con `shipping_status = 2` de campañas del usuario
- **Mensajes exitosos del cliente**: Suma total de mensajes con `shipping_status = 2` de todos los usuarios del cliente

## ✅ Checklist de Requerimientos

- [x] **Restaurar backup**: Importación del archivo `db.sql`
- [x] **Endpoint cálculo de totales**: Actualiza `total_records`, `total_sent`, `total_error`
- [x] **Endpoint estado de campaña**: Actualiza `process_status` y `final_hour`
- [x] **Endpoint reporte por fechas**: Lista clientes con mensajes exitosos en rango
- [x] **Endpoint participación usuarios**: Lista usuarios con porcentaje de participación
- [x] **Desarrollo en Node.js**: Implementado con Express y MySQL2
- [x] **Serverless Framework**: Configurado para AWS Lambda
- [x] **Documentación Swagger**: Interfaz interactiva disponible

## 🚀 Despliegue y Entrega

### Despliegue Local
```bash
npm run dev
```

# Modo desarrollo local
npm run serverless:dev
```

**Nota**: El directorio `undefined/` es creado automáticamente por Serverless Framework para mantener la autenticación y configuraciones temporales. Es normal y no debe ser eliminado durante el desarrollo.

### Entrega del Proyecto
Una vez completado, enviar la URL del repositorio a: **elbin.flores@sinapsiscorp.com**

## 🏗️ Estructura del Proyecto

```
sms-marketing-api/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración MySQL
│   │   ├── environment.js       # Variables de entorno
│   │   └── swagger.js           # Configuración Swagger
│   ├── controllers/             # Lógica de negocio
│   │   ├── campaignController.js
│   │   └── customerController.js
│   ├── middlewares/
│   │   └── errorHandler.js      # Manejo centralizado de errores
│   ├── routes/                  # Definición de rutas
│   │   ├── campaignRoutes.js
│   │   ├── customerRoutes.js
│   │   └── testRoutes.js
│   ├── services/                # Servicios de base de datos
│   │   └── reportService.js
│   └── utils/                   # Utilidades y helpers
│       ├── helpers.js
│       └── validators.js        # Esquemas de validación Joi
├── temp/                        # Archivos temporales
├── undefined/                   # Directorio de autenticación Serverless
├── .env                         # Variables de entorno
├── index.js                     # Punto de entrada principal
├── package.json                 # Dependencias y scripts
├── package-lock.json           # Lock file de dependencias
├── README.md                   # Documentación del proyecto
└── serverless.yml              # Configuración Serverless Framework
```

### Descripción de Directorios

- **`src/config/`**: Configuraciones de la aplicación (DB, Swagger, entorno)
- **`src/controllers/`**: Controladores con la lógica de negocio de cada módulo
- **`src/middlewares/`**: Middlewares personalizados (manejo de errores, validaciones)
- **`src/routes/`**: Definición de rutas y endpoints de la API
- **`src/services/`**: Servicios para operaciones complejas y reportes
- **`src/utils/`**: Utilidades, helpers y validadores Joi
- **`temp/`**: Directorio para archivos temporales del sistema
- **`undefined/`**: Directorio creado por Serverless Framework para autenticación

## 🛡️ Middleware y Características

### Validación de Datos
Utiliza **Joi** para validación robusta de esquemas de datos en requests.

### CORS
Habilitado para todas las rutas con configuración permisiva.

### Parsing de JSON
- Límite de 10MB para requests JSON y form-data
- Soporte para URL encoding extendido

### Base de Datos
- **MySQL2**: Cliente MySQL optimizado con soporte para promesas
- Connection pooling automático
- Manejo de reconexión automática

### Manejo de Errores
Middleware centralizado para manejo consistente de errores.

### Rutas 404
Manejo automático de endpoints no encontrados con respuesta JSON estructurada.

## 🔍 Monitoreo y Salud

### Endpoint de Salud
```
GET /health
```
Respuesta:
```json
{
  "status": "OK",
  "service": "SMS Marketing API"
}
```

### Información del Sistema
```
GET /
```
Respuesta:
```json
{
  "message": "API funcionando correctamente",
  "version": "1.0.0",
  "timestamp": "2025-06-08T10:30:00.000Z",
  "enviroment": "development",
  "documentation": "/api-docs"
}
```

## 🐛 Debugging

### Logs del Sistema
El servidor muestra información importante al iniciar:
- Versión de Node.js
- Entorno de ejecución
- Estado de conexión a la base de datos
- URL del servidor
- URL de documentación Swagger

### Testing de Conexión
La aplicación verifica automáticamente la conexión a la base de datos al iniciar.

## 📝 Scripts Disponibles

```json
{
  "start": "node index.js",
  "dev": "nodemon index.js",
  "test": "echo \"Error: no test specified\" && exit 1",
  "serverless:dev": "serverless offline start"
}
```

### Comandos NPM

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor con hot reload usando Nodemon  
- `npm test` - Ejecuta las pruebas (pendiente implementación)
- `npm run serverless:dev` - Inicia el servidor en modo serverless offline

## 🧪 Testing

Actualmente el proyecto no tiene pruebas configuradas. Para implementar testing se recomienda:

```bash
# Instalar dependencias de testing
npm install --save-dev jest supertest

# Crear estructura de pruebas
mkdir __tests__
```

## 📦 Dependencias Principales

### Producción
- **express**: Framework web para Node.js
- **cors**: Middleware para CORS
- **dotenv**: Carga variables de entorno
- **joi**: Validación de esquemas
- **mysql2**: Cliente MySQL para Node.js
- **serverless-http**: Adaptador para AWS Lambda
- **swagger-jsdoc**: Generación de documentación Swagger
- **swagger-ui-express**: Interfaz web para Swagger

### Desarrollo
- **nodemon**: Hot reload para desarrollo
- **serverless-offline**: Emulador local para Serverless
- **@types/swagger-jsdoc**: Tipos TypeScript para Swagger JSDoc
- **@types/swagger-ui-express**: Tipos TypeScript para Swagger UI

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]

## 👥 Información del Proyecto

- **Prueba Técnica**: Soporte TI - Sinapsis
- **Objetivo**: Sistema de gestión de campañas SMS con análisis y reportes
- **Contacto de Entrega**: elbin.flores@sinapsiscorp.com
- **Framework**: Node.js + Express + MySQL
- **Arquitectura**: Serverless ready

## 🆘 Troubleshooting

### Problemas Comunes

1. **Error de conexión a base de datos**
   - Verificar credenciales en `.env`
   - Asegurar que MySQL esté ejecutándose
   - Confirmar que la base de datos existe

2. **Tablas no encontradas**
   - Importar el archivo `db.sql`: `mysql -u usuario -p base_datos < db.sql`

3. **Puerto en uso**
   - Cambiar `PORT` en `.env` o cerrar proceso en puerto 3000

4. **Errores de validación**
   - Revisar esquemas Joi en la documentación Swagger
   - Verificar formato de fechas (YYYY-MM-DD)

### Verificación de Funcionalidad

1. **Test de conexión**: `GET /health`
2. **Documentación**: `GET /api-docs`
3. **Test de endpoints**: Usar ejemplos en Swagger UI

### Notas Importantes

- El directorio `undefined/` es generado por Serverless Framework para autenticación
- No eliminar `temp/` ni `undefined/` durante el desarrollo
- Los archivos de configuración están centralizados en `src/config/`
- Los validadores Joi están organizados en `src/utils/validators.js`

---

**Prueba Técnica Sinapsis - SMS Marketing API** 🚀  
*Desarrollado para demostrar competencias en Node.js, MySQL y arquitectura serverless*