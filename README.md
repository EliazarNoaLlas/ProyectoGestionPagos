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
   CREATE DATABASE sgps_db;
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
create table clients
(
    client_id             serial
        primary key,
    type                  varchar(10)  not null
        constraint clients_type_check
            check ((type)::text = ANY ((ARRAY ['persona'::character varying, 'empresa'::character varying])::text[])),
    name                  varchar(200) not null,
    phone                 varchar(20),
    email                 varchar(100)
        unique,
    identification_number varchar(50)
        unique,
    identification_type   varchar(20),
    created_at            timestamp default CURRENT_TIMESTAMP,
    updated_at            timestamp default CURRENT_TIMESTAMP,
    is_active             boolean   default true,
    address               text,
    city                  varchar(50),
    country               varchar(50),
    postal_code           varchar(15)
);

alter table clients
    owner to postgres;

create table services
(
    service_id  serial
        primary key,
    name        varchar(100)   not null,
    description text,
    price       numeric(15, 2) not null
);

alter table services
    owner to postgres;

create table client_services
(
    client_service_id serial
        primary key,
    client_id         integer                                            not null
        references clients
            on delete cascade,
    service_id        integer                                            not null
        references services
            on delete cascade,
    status            varchar(20) default 'activo'::character varying
        constraint client_services_status_check
            check ((status)::text = ANY
                   ((ARRAY ['activo'::character varying, 'inactivo'::character varying, 'cancelado'::character varying])::text[])),
    created_at        timestamp   default CURRENT_TIMESTAMP,
    amount_due        numeric(15, 2)                                     not null,
    due_date          date                                               not null,
    payment_status    varchar(20) default 'pendiente'::character varying not null
        constraint client_services_payment_status_check
            check ((payment_status)::text = ANY
                   ((ARRAY ['pendiente'::character varying, 'pagado'::character varying])::text[])),
    updated_at        timestamp   default CURRENT_TIMESTAMP
);

alter table client_services
    owner to postgres;

create table payments
(
    payment_id        serial
        primary key,
    amount            numeric(15, 2)                                     not null,
    payment_date      date                                               not null,
    payment_method    varchar(50)                                        not null,
    reference_number  varchar(100),
    notes             text,
    created_at        timestamp   default CURRENT_TIMESTAMP,
    status            varchar(20) default 'pendiente'::character varying not null
        constraint payments_status_check
            check ((status)::text = ANY
                   ((ARRAY ['borrador'::character varying, 'en proceso'::character varying, 'pagado'::character varying])::text[])),
    payment_type      varchar(50)                                        not null
        constraint payments_payment_type_check
            check ((payment_type)::text = ANY
                   ((ARRAY ['efectivo'::character varying, 'transferencia'::character varying, 'tarjeta'::character varying, 'cheque'::character varying, 'otro'::character varying])::text[])),
    client_service_id integer                                            not null
        references client_services
            on delete cascade
);

alter table payments
    owner to postgres;
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
