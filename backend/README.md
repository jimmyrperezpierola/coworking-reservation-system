# 🏢 Sistema de Gestión de Reservas - Backend

API REST completa para gestionar espacios, reservas, usuarios y estadísticas en un coworking, construida con Node.js, Express y PostgreSQL.

## 1️⃣ Descripción General
Este backend proporciona una estructura profesional y segura para manejar: Registro e inicio de sesión de usuarios (JWT), gestión de usuarios y permisos, CRUD de espacios (admin), reservas por parte de usuarios autenticados, cancelación de reservas, y panel de estadísticas administrativas.

## 2️⃣ Tecnologías Utilizadas
- Node.js + Express  
- PostgreSQL + Sequelize  
- JWT (JSON Web Tokens)  
- Bcrypt para encriptación de contraseñas  
- Dotenv para manejo de variables de entorno  
- Helmet + CORS para seguridad  
- Arquitectura modular MVC  

## 3️⃣ Variables de Entorno
Crea un archivo `.env` dentro del directorio backend/ con lo siguiente:

PORT=5000  
FRONTEND_URL=http://localhost:3000  
JWT_SECRET=supersecreto123  
DB_HOST=localhost  
DB_USER=postgres  
DB_PASSWORD=tu_contraseña_postgres  
DB_NAME=coworking  
DB_PORT=5432  

## 4️⃣ Instalación y Ejecución
1. Clona el repositorio  
   `git clone https://github.com/jimmyperezpierola/coworking-reservation-system && cd backend`  
2. Instala dependencias  
   `npm install`  
3. (Opcional) Poblar la base con usuarios de prueba  
   `npm run seed:users`  
4. Inicia el servidor en modo desarrollo  
   `npm run dev`  

💡 Asegúrate de que PostgreSQL esté funcionando y la base de datos esté creada según el archivo .env

## 5️⃣ Estructura del Proyecto
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

## 6️⃣ Scripts Disponibles
- `npm run dev`: Ejecuta el servidor en modo desarrollo  
- `npm run seed:users`: Crea spacios de prueba (salas + escritorios)

## 7️⃣ Endpoints Principales
POST `/login` – Iniciar sesión  
POST `/register` – Crear nuevo usuario  
GET `/spaces/enabled` – Obtener espacios habilitados  
POST `/spaces/:id/reserve` – Crear reserva (requiere login)  
GET `/reservations` – Ver reservas del usuario autenticado  
PUT `/reservations/:id/cancel` – Cancelar una reserva  
GET `/admin/stats` – Ver estadísticas de uso (admin)

## 8️⃣ Seguridad y Acceso
Las rutas protegidas requieren un JWT en el header `Authorization: Bearer TU_TOKEN`.  
Los usuarios con `isAdmin = true` acceden a rutas administrativas.  
Las contraseñas se almacenan hasheadas con bcrypt.  
El middleware `authenticate.js` protege todas las rutas privadas.

## 9️⃣ Testing Manual con Postman
Ejemplo login:  
POST `/login`  
Body JSON:  
{ "email": "admin@coworking.com", "password": "admin123" }  

Ejemplo reservar:  
POST `/spaces/1/reserve`  
Headers: Authorization: Bearer TU_TOKEN  
Body JSON:  
{ "start_time": "2025-05-23T10:00:00Z", "end_time": "2025-05-23T12:00:00Z" }

## 🔟 Autor y Créditos
Desarrollado por Manuel Monterde; Jimmy Perez  
Contacto: mmonterde.app@gmail.com  ; pila900@gmail.com
Repositorio: https://github.com/jimmyperezpierola/coworking-reservation-system
