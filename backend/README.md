# 🔧 Backend - Sistema de Reservas Coworking

![Node.js](https://img.shields.io/badge/Node.js-18.20.8-green)
![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.7-blue)
![Sequelize](https://img.shields.io/badge/Sequelize-6.37.7-orange)
![Docker](https://img.shields.io/badge/Docker-24.0.5-2496ED)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

API REST para el sistema de gestión de reservas de espacios de coworking.

## 🌟 Características principales
- Autenticación JWT para usuarios y administradores
- Gestión de espacios de coworking (CRUD)
- Sistema de reservas con disponibilidad en tiempo real
- Migraciones de base de datos con Sequelize
- Documentación de API con Swagger
- Integración con Docker para despliegue

## 🛠️ Stack Tecnológico
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js    | 18.20.8 | Entorno de ejecución |
| Express    | 4.18.2  | Framework web |
| PostgreSQL | 14.7    | Base de datos relacional |
| Sequelize  | 6.37.7  | ORM para PostgreSQL |
| Docker     | 24.0.5  | Contenerización |
| JWT        | 9.0.2   | Autenticación |
| Swagger    | 4.8.1   | Documentación API |

## 📂 Estructura de archivos

      backend/
      ├── config/ # Configuraciones (DB, entorno)
      │ └── config.js # Configuración de la base de datos
      ├── controllers/ # Lógica de controladores
      ├── migrations/ # Migraciones de la base de datos
      ├── models/ # Modelos de Sequelize
      ├── routes/ # Definición de rutas
      ├── scripts/ # Scripts de inicialización
      │ └── createAdmin.js # Crear usuario admin inicial
      ├── .dockerignore # Archivos excluidos en Docker
      ├── .env.example # Ejemplo de variables de entorno
      ├── .eslintrc.js # Configuración ESLint
      ├── Dockerfile # Configuración Docker para producción
      ├── docker-compose.yml # Orquestación de contenedores
      ├── index.js # Punto de entrada de la aplicación
      ├── package.json # Dependencias y scripts
      ├── swagger.json # Documentación de la API
      └── README.md # Este archivo

#  Sistema de Gestión de Reservas - Backend

API REST completa para gestionar espacios, reservas, usuarios y estadísticas en un coworking, construida con Node.js, Express y PostgreSQL.

##  Descripción General
Este backend proporciona una estructura profesional y segura para manejar: Registro e inicio de sesión de usuarios (JWT), gestión de usuarios y permisos, CRUD de espacios (admin), reservas por parte de usuarios autenticados, cancelación de reservas, y panel de estadísticas administrativas.

##  Tecnologías Utilizadas
- Node.js + Express  
- PostgreSQL + Sequelize  
- JWT (JSON Web Tokens)  
- Bcrypt para encriptación de contraseñas  
- Dotenv para manejo de variables de entorno  
- Helmet + CORS para seguridad  
- Arquitectura modular MVC  

##  Variables de Entorno
Crea un archivo `.env` dentro del directorio backend/ con lo siguiente:

PORT=5000  
FRONTEND_URL=http://localhost:3000  
JWT_SECRET=supersecreto123  
DB_HOST=localhost  
DB_USER=postgres  
DB_PASSWORD=tu_contraseña_postgres  
DB_NAME=coworking  
DB_PORT=5432  

##  Instalación y Ejecución
1. Clona el repositorio  
   `git clone https://github.com/jimmyperezpierola/coworking-reservation-system && cd backend`  
2. Instala dependencias  
   `npm install`  
3. (Opcional) Poblar la base con usuarios de prueba  
   `npm run seed:users`  
4. Inicia el servidor en modo desarrollo  
   `node src/server.js`  

💡 Asegúrate de que PostgreSQL esté funcionando y la base de datos esté creada según el archivo .env

##  Estructura del Proyecto
El backend está organizado modularmente.  
- `controllers/`: lógica de negocio por recurso  
- `routes/`: endpoints organizados  
- `models/`: modelos Sequelize + relaciones  
- `middlewares/`: autenticación y protección de rutas  
- `seeders/`: usuarios de prueba  
- `db.js`: conexión a la base de datos  
- `app.js`: configuración Express  
- `server.js`: arranque del servidor  
- `.env`: variables sensibles  

## Scripts Disponibles
- `npm run dev`: Ejecuta el servidor en modo desarrollo  
- `npm run seed:users`: Crea spacios de prueba (salas + escritorios)

## Endpoints Principales
POST `/login` – Iniciar sesión  
POST `/register` – Crear nuevo usuario  
GET `/spaces/enabled` – Obtener espacios habilitados  
POST `/spaces/:id/reserve` – Crear reserva (requiere login)  
GET `/reservations` – Ver reservas del usuario autenticado  
PUT `/reservations/:id/cancel` – Cancelar una reserva  
GET `/admin/stats` – Ver estadísticas de uso (admin)

## Seguridad y Acceso
Las rutas protegidas requieren un JWT en el header `Authorization: Bearer TU_TOKEN`.  
Los usuarios con `isAdmin = true` acceden a rutas administrativas.  
Las contraseñas se almacenan hasheadas con bcrypt.  
El middleware `authenticate.js` protege todas las rutas privadas.


##  Testing Manual con Postman
Ejemplo login:  
POST `/login`  
Body JSON:  
{ "email": "admin@coworking.com", "password": "admin123" }  

Ejemplo reservar:  
POST `/spaces/1/reserve`  
Headers: Authorization: Bearer TU_TOKEN  
Body JSON:  
{ "start_time": "2025-05-23T10:00:00Z", "end_time": "2025-05-23T12:00:00Z" }

### Docker
Construir imagen

bash
docker build -t backend-coworking -f Dockerfile-linux .
Ejecutar contenedor

bash
docker run -p 3000:80 backend-coworking
Docker Compose (con backend)

bash
docker compose up --build

## Autor y Créditos
Desarrollado por Manuel Monterde; Jimmy Perez  
Contacto: mmonterde.app@gmail.com  ; pila900@gmail.com
Repositorio: https://github.com/jimmyperezpierola/coworking-reservation-system
