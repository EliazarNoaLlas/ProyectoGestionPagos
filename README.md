# Sistema de Gestión de Pagos de Servicios (SGPS)

Guía completa de instalación y configuración del proyecto SGPS, una aplicación para la gestión de pagos de servicios para pequeñas y medianas empresas.

## Contenido

1. [Requisitos previos](#requisitos-previos)
2. [Instalación de herramientas](#instalación-de-herramientas)
3. [Configuración de la base de datos](#configuración-de-la-base-de-datos)
4. [Configuración del backend](#configuración-del-backend)
5. [Configuración del frontend](#configuración-del-frontend)
6. [Ejecución del proyecto](#ejecución-del-proyecto)
7. [Estructura del proyecto](#estructura-del-proyecto)
8. [Solución de problemas comunes](#solución-de-problemas-comunes)

## Requisitos previos

Antes de comenzar, asegúrate de tener permisos de administrador en tu sistema operativo para instalar software.

## Instalación de herramientas

### 1. Instalar Node.js

1. Visita [https://nodejs.org/](https://nodejs.org/) y descarga la versión LTS (recomendado v18.x o superior)
2. Ejecuta el instalador y sigue las instrucciones del asistente
3. Verifica la instalación abriendo una terminal y ejecutando:

   ```bash

   node --version

   npm --version

   ```

### 2. Instalar Visual Studio Code

1. Visita [https://code.visualstudio.com/](https://code.visualstudio.com/) y descarga el instalador para tu sistema operativo
2. Ejecuta el instalador y sigue las instrucciones
3. Extensiones recomendadas para instalar en VS Code:

   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint
   - JavaScript (ES6) code snippets
   - PostgreSQL
   - Material Icon Theme

### 3. Instalar Git

1. Visita [https://git-scm.com/downloads](https://git-scm.com/downloads) y descarga el instalador para tu sistema operativo
2. Ejecuta el instalador y sigue las instrucciones
3. Verifica la instalación en la terminal:

   ```bash

   git --version

   ```
4. Configura tu identidad en Git:

   ```bash

   git config --global user.name "Tu Nombre"

   git config --global user.email "tu.email@ejemplo.com"

   ```

### 4. Instalar PostgreSQL

1. Visita [https://www.postgresql.org/download/](https://www.postgresql.org/download/) y descarga el instalador para tu sistema operativo
2. Ejecuta el instalador y sigue las instrucciones:

   - Anota la contraseña que estableces para el usuario `postgres`
   - Puerto estándar: 5432
   - Lenguaje: UTF-8
   - Instala pgAdmin (incluido en el instalador)
3. Verifica la instalación abriendo pgAdmin o usando la terminal:

   ```bash

   psql --version

   ```

## Configuración de la base de datos

### 1. Crear la base de datos

#### Usando pgAdmin:

1. Abre pgAdmin (instalado con PostgreSQL)
2. Conéctate al servidor usando las credenciales del usuario `postgres`
3. Haz clic derecho en "Databases" y selecciona "Create" > "Database"
4. Nombre: `sgps_db`
5. Haz clic en "Save"

#### Usando la terminal:

1. Abre la terminal y conéctate a PostgreSQL:

   ```bash

   psql -U postgres

   ```
2. Crea la base de datos:

   ```sql

   CREATEDATABASE sgps_db;

   ```
3. Verifica la creación:

   ```sql

   \l

   ```
4. Salir de psql:

   ```sql

   \q

   ```

### 2. Crear las tablas

1. Abre pgAdmin y conéctate a la base de datos `sgps_db`
2. Haz clic derecho en `sgps_db` y selecciona "Query Tool"
3. Ejecuta el siguiente script SQL:

```sql

-- Tabla de clientes

CREATETABLEclients (

    client_id SERIALPRIMARY KEY,

    typeVARCHAR(10) NOT NULLCHECK (typeIN ('persona', 'empresa')),

    nameVARCHAR(200) NOT NULL,

    phone VARCHAR(20),

    email VARCHAR(100) UNIQUE,

    identification_number VARCHAR(50) UNIQUE,

    identification_type VARCHAR(20),

    created_at TIMESTAMPDEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPDEFAULT CURRENT_TIMESTAMP,

    is_active BOOLEANDEFAULT TRUE,

    addressTEXT,

    city VARCHAR(50),

    country VARCHAR(50),

    postal_code VARCHAR(15)

);


-- Tabla de servicios

CREATETABLEservices (

    service_id SERIALPRIMARY KEY,

    nameVARCHAR(100) NOT NULL,

    descriptionTEXT,

    price NUMERIC(15,2) NOT NULL

);


-- Tabla de servicios de clientes

CREATETABLEclient_services (

    client_service_id SERIALPRIMARY KEY,

    client_id INTEGERNOT NULLREFERENCES clients(client_id) ON DELETE CASCADE,

    service_id INTEGERNOT NULLREFERENCES services(service_id) ON DELETE CASCADE,

    statusVARCHAR(20) DEFAULT'activo'CHECK (statusIN ('activo', 'inactivo', 'cancelado')),

    created_at TIMESTAMPDEFAULT CURRENT_TIMESTAMP,

    amount_due NUMERIC(15,2) NOT NULL,

    due_date DATENOT NULL,

    payment_status VARCHAR(20) NOT NULLDEFAULT'pendiente'CHECK (payment_status IN ('pendiente', 'pagado')),

    updated_at TIMESTAMPDEFAULT CURRENT_TIMESTAMP

);


-- Tabla de pagos

CREATETABLEpayments (

    payment_id SERIALPRIMARY KEY,

    amount NUMERIC(15,2) NOT NULL,

    payment_date DATENOT NULL,

    payment_method VARCHAR(50) NOT NULL,

    reference_number VARCHAR(100),

    notes TEXT,

    created_at TIMESTAMPDEFAULT CURRENT_TIMESTAMP,

    statusVARCHAR(20) NOT NULLDEFAULT'pendiente'CHECK (statusIN ('borrador', 'en proceso', 'pagado')),

    payment_type VARCHAR(50) NOT NULLCHECK (payment_type IN ('efectivo', 'transferencia', 'tarjeta', 'cheque', 'otro')),

    client_service_id INTEGERNOT NULLREFERENCES client_services(client_service_id) ON DELETE CASCADE

);


-- Tabla de usuarios (para autenticación)

CREATETABLEusers (

    user_id SERIALPRIMARY KEY,

    username VARCHAR(50) NOT NULLUNIQUE,

    email VARCHAR(100) NOT NULLUNIQUE,

    passwordVARCHAR(255) NOT NULL,

    roleVARCHAR(20) NOT NULLCHECK (roleIN ('admin', 'vendedor')),

    created_at TIMESTAMPDEFAULT CURRENT_TIMESTAMP,

    is_active BOOLEANDEFAULT TRUE

);

```

## Configuración del backend

### 1. Clonar el repositorio

```bash

git clone https://github.com/EliazarNoaLlas/ProyectoGestionPagos.git

cd GestionPagos

```

### 2. Configurar el backend

```bash

cd backend

npm install

```

### 3. Crear archivo .env

Crea un archivo llamado `.env` en la carpeta `backend` con el siguiente contenido:

```

# Configuración del Servidor
PORT=3000

# Configuración de la Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=gestionpagos
DB_USER=postgres
DB_PASSWORD=12345678

# URL del Frontend
FRONTEND_URL=http://localhost:5173

```

Reemplaza `tu_contraseña_de_postgres` con la contraseña que estableciste durante la instalación de PostgreSQL.

## Configuración del frontend

### 1. Configurar el frontend

```bash

cd ../frontend

npm install

```

### 2. Crear archivo .env

Crea un archivo llamado `.env` en la carpeta `frontend` con el siguiente contenido:

```
# URL del backend
VITE_API_URL=http://localhost:3000

```

## Ejecución del proyecto

### 1. Iniciar el backend

```bash

cd backend

npm run dev

```

El servidor backend se iniciará en `http://localhost:3000`.

### 2. Iniciar el frontend

Abre una nueva terminal y ejecuta:

```bash

cd frontend

npm run dev

```

La aplicación frontend se iniciará en `http://localhost:5173`.

### 3. Acceder a la aplicación

Abre tu navegador web y visita `http://localhost:5173`

## Estructura del proyecto

### Backend

```

backend/

├── src/

│   ├── config/         # Configuración de la aplicación y BD

│   ├── controllers/    # Controladores de la API

│   ├── libs/           # Funciones utilitarias

│   ├── middlewares/    # Middlewares

│   ├── models/         # Modelos de datos

│   ├── routes/         # Definición de rutas

│   ├── schemas/        # Esquemas de validación

│   ├── app.js          # Configuración de Express

│   └── index.js        # Punto de entrada

└── package.json

```

### Frontend

```

frontend/

├── src/

│   ├── assets/         # Recursos estáticos

│   ├── components/     # Componentes reutilizables

│   ├── context/        # Contextos de React

│   ├── hooks/          # Custom hooks

│   ├── layout/         # Componentes de estructura

│   ├── pages/          # Páginas de la aplicación

│   ├── routes/         # Configuración de rutas

│   ├── services/       # Servicios para comunicación con API

│   ├── utils/          # Utilidades

│   ├── App.jsx         # Componente principal

│   ├── index.css       # Estilos globales

│   └── main.jsx        # Punto de entrada

└── package.json

```

## Solución de problemas comunes

### Error de conexión a la base de datos

1. Verifica que PostgreSQL esté en ejecución
2. Comprueba las credenciales en el archivo `.env` del backend
3. Asegúrate de que la base de datos `sgps_db` exista

### Error al iniciar el backend

1. Verifica que todas las dependencias estén instaladas correctamente:

   ```bash

   cd backend

   npm install

   ```
2. Comprueba que no haya otro servicio usando el puerto 4000

### Error al iniciar el frontend

1. Verifica que todas las dependencias estén instaladas correctamente:

   ```bash

   cd frontend

   npm install

   ```
2. Comprueba que el archivo `.env` tenga la URL correcta de la API

### Errores de CORS

Si tienes problemas de CORS, verifica que el backend tenga habilitado CORS correctamente en `app.js`.

### Problemas con las operaciones CRUD

1. Verifica las rutas API en el backend
2. Usa herramientas como Postman para probar los endpoints directamente
3. Revisa los logs del servidor para identificar errores específicos

## Usuarios iniciales

Para comenzar a utilizar el sistema, crea un usuario administrador a través de la API o directamente en la base de datos.

Ejemplo utilizando psql:

```sql

INSERT INTO users (username, email, password, role) 

VALUES ('admin', 'admin@ejemplo.com', '$2a$10$6KvSRlQLeUCx/69z.jzi7OH8YbGoGQC9LO0zoX5UvD1Qg5Q6lgh86', 'admin');

```

La contraseña en este ejemplo es 'admin123' encriptada con bcrypt. En un entorno de producción, utiliza una contraseña segura.

---

Para cualquier problema o consulta adicional, consulta la documentación del proyecto o contacta al equipo de desarrollo.
