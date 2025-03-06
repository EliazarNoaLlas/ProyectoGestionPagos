# Sistema de Gestión de Pagos de Servicios - Backend

API RESTful para el Sistema de Gestión de Pagos de Servicios (SGPS), que proporciona las funcionalidades necesarias para administrar clientes, servicios y pagos.

## Descripción

Este backend proporciona la lógica de negocio y acceso a datos para el Sistema de Gestión de Pagos de Servicios, permitiendo la administración completa de clientes, servicios contratados y el registro de pagos. La aplicación está diseñada para soportar entre 200 y 300 clientes, proporcionando APIs para dos tipos de usuarios: administradores y vendedores.

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB (Mongoose)
- PostgreSQL
- JSON Web Token (JWT)
- Zod (validación de datos)
- bcryptjs (encriptación)

## Estructura del Proyecto

```
src/
├── config/              # Configuración de la aplicación y base de datos
├── controllers/         # Controladores de la API
├── libs/                # Bibliotecas y funciones utilitarias
├── middlewares/         # Middlewares para autenticación y validación
├── models/              # Modelos de datos
├── routes/              # Definición de rutas
├── schemas/             # Esquemas de validación con Zod
├── app.js               # Configuración de Express
└── index.js             # Punto de entrada de la aplicación
```

## Requisitos Previos

- Node.js 18 o superior
- MongoDB o PostgreSQL (según configuración)
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd GestionPagos/backend
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

## Comandos Disponibles

- `npm run dev`: Inicia el servidor con nodemon para desarrollo.
- `npm start`: Inicia el servidor en modo producción.

## API Endpoints

### Autenticación

- `POST /api/auth/register`: Registrar nuevo usuario
- `POST /api/auth/login`: Iniciar sesión
- `GET /api/auth/profile`: Obtener perfil del usuario autenticado

### Clientes

- `GET /api/clients`: Obtener todos los clientes
- `GET /api/clients/:id`: Obtener cliente por ID
- `POST /api/clients`: Crear nuevo cliente
- `PUT /api/clients/:id`: Actualizar cliente
- `DELETE /api/clients/:id`: Eliminar cliente

### Servicios

- `GET /api/services`: Obtener todos los servicios
- `GET /api/services/:id`: Obtener servicio por ID
- `POST /api/services`: Crear nuevo servicio
- `PUT /api/services/:id`: Actualizar servicio
- `DELETE /api/services/:id`: Eliminar servicio

### Servicios de Clientes

- `GET /api/client-services`: Obtener todos los servicios de clientes
- `GET /api/client-services/:id`: Obtener servicio de cliente por ID
- `GET /api/client-services/client/:clientId`: Obtener servicios por cliente
- `POST /api/client-services`: Asignar servicio a cliente
- `PUT /api/client-services/:id`: Actualizar servicio de cliente
- `DELETE /api/client-services/:id`: Eliminar servicio de cliente

### Pagos

- `GET /api/payments`: Obtener todos los pagos
- `GET /api/payments/:id`: Obtener pago por ID
- `GET /api/payments/client/:clientId`: Obtener pagos por cliente
- `POST /api/payments`: Registrar nuevo pago
- `PUT /api/payments/:id`: Actualizar pago
- `DELETE /api/payments/:id`: Eliminar pago

## Modelos de Datos

### Usuario (User)
- id
- username
- email
- password (encriptado)
- role (admin/seller)

### Cliente (Client)
- client_id
- name
- phone
- email
- created_at
- created_by
- delete_at

### Servicio (Service)
- service_id
- name
- description
- price
- created_at
- created_by
- delete_at

### Servicio de Cliente (ClientService)
- client_service_id
- client_id
- service_id
- amount_due
- due_date
- payment_status
- created_at
- update_at

### Pago (Payment)
- payment_id
- client_id
- amount
- payment_date
- created_at

## Seguridad

- Autenticación mediante JWT
- Validación de datos con Zod
- Middleware de autorización para rutas protegidas
- Encriptación de contraseñas con bcryptjs

## Flujo del Sistema

1. Administradores pueden gestionar clientes, servicios y ver reportes.
2. Vendedores pueden buscar clientes y registrar pagos.
3. Los pagos actualizan automáticamente el estado de los servicios contratados.
4. Se puede generar reportes de pagos y clientes para análisis.

## Contribución

Para contribuir al proyecto:

1. Crea una rama para tu característica (`git checkout -b feature/nombre-caracteristica`)
2. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva característica'`)
3. Sube tu rama (`git push origin feature/nombre-caracteristica`)
4. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo [tu licencia aquí].
