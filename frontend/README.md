# Sistema de Gestión de Pagos de Servicios - Frontend

Este proyecto es la interfaz de usuario para el Sistema de Gestión de Pagos de Servicios (SGPS), una aplicación diseñada para administrar los pagos de servicios de clientes de pequeñas y medianas empresas.

## Descripción

El Sistema de Gestión de Pagos de Servicios (SGPS) es una plataforma integral para la administración y seguimiento de pagos de servicios, diseñada específicamente para empresas con una cartera de 200 a 300 clientes. La aplicación permite a los administradores gestionar clientes, servicios y pagos, mientras que los vendedores pueden consultar y registrar pagos de manera eficiente.

## Tecnologías Utilizadas

- React 19
- React Router DOM 7
- Axios
- Tailwind CSS 4
- ShadCN UI
- React Hook Form
- Vite

## Estructura del Proyecto

```

src/

├── assets/              # Recursos estáticos

├── components/          # Componentes reutilizables

│   ├── clients/         # Componentes relacionados con clientes

│   ├── reports/         # Componentes para reportes

│   ├── settings/        # Componentes de configuración

│   └── ui/              # Componentes de interfaz de usuario

├── context/             # Contextos de React

├── hooks/               # Custom hooks

├── layout/              # Componentes de estructura

├── pages/               # Páginas de la aplicación

├── routes/              # Configuración de rutas

├── services/            # Servicios para comunicación con API

└── utils/               # Utilidades y funciones de ayuda

```

## Requisitos Previos

- Node.js 18 o superior
- npm o yarn

## Instalación

1. Clona el repositorio:

```bash

gitclone https://github.com/EliazarNoaLlas/ProyectoGestionPagos.git

cd GestionPagos/frontend

```

2. Instala las dependencias:

```bash

npm install

# o

yarn install

```

## Comandos Disponibles

-`npm run dev`: Inicia el servidor de desarrollo.

-`npm run build`: Compila la aplicación para producción.

-`npm run lint`: Ejecuta el linter para verificar la calidad del código.

-`npm run preview`: Previsualiza la versión de producción.

-`npm run serve`: Sirve la aplicación compilada.

## Características

### Módulos Principales

1.**Gestión de Clientes**

- Crear, editar y eliminar clientes
- Visualizar información detallada de cada cliente

2.**Gestión de Servicios**

- Administrar catálogo de servicios
- Asignar servicios a clientes

3.**Gestión de Pagos**

- Registrar pagos de clientes
- Consultar histórico de pagos

4.**Reportes**

- Generación de informes en diferentes formatos
- Análisis de datos de pagos

### Roles de Usuario

-**Administrador**: Acceso completo a todas las funcionalidades.

-**Vendedor**: Consulta de información de clientes y registro de pagos.

## Flujo del Sistema

1. El vendedor busca un cliente por nombre.
2. El sistema muestra la información del cliente, incluyendo montos a pagar y servicios contratados.
3. El vendedor registra el pago realizado por el cliente.
4. El sistema actualiza el estado del pago en la base de datos.

## Contribución

Para contribuir al proyecto:

1. Crea una rama para tu característica (`git checkout -b feature/nombre-caracteristica`)
2. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva característica'`)
3. Sube tu rama (`git push origin feature/nombre-caracteristica`)
4. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo [tu licencia aquí].
