# 🖥️ Frontend - Sistema de Reservas Coworking

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.4.9-yellow)
![Docker](https://img.shields.io/badge/Docker-24.0.5-2496ED)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Interfaz de usuario para el sistema de gestión de reservas de espacios de coworking.

## 🚀 Características principales
- Consulta de disponibilidad en tiempo real
- Reserva de espacios de coworking y salas de reuniones
- Panel de administración para gestión de espacios
- Simulación de pagos por reservas
- Diseño responsive para móviles y escritorio

## 🧩 Stack Tecnológico
| Tecnología | Versión              | Propósito |
|------------|----------------------|-----------|
| React      | 18.2.0               | Biblioteca UI |
| Vite       | 4.4.9                | Bundler y entorno desarrollo |
| ESLint     | Config personalizada | Control de calidad código |
| Docker     | 24.0.5               | Contenerización |
| Nginx      | Latest               | Servidor web y proxy |

## 📂 Estructura de archivos
frontend/
├── .vite/ # Caché de Vite
├── node_modules/ # Dependencias
├── public/ # Assets públicos
│ ├── favicon.ico
│ └── index.html
├── src/ # Código fuente
│ ├── assets/ # Imágenes, fuentes, etc.
│ ├── components/ # Componentes reutilizables
│ ├── pages/ # Vistas principales
│ ├── services/ # Lógica de API
│ ├── App.jsx # Componente principal
│ ├── main.jsx # Punto de entrada
│ └── ... # Otros archivos
├── .dockerignore # Archivos excluidos en Docker
├── .env # Variables de entorno (desarrollo)
├── .env.production # Variables de entorno (producción)
├── Dockerfile-dev # Configuración Docker para desarrollo
├── docker-compose.yml # Orquestación de contenedores
├── eslint.config.js # Configuración ESLint
├── index.html # Plantilla HTML principal
├── nginx.conf # Configuración Nginx
├── package.json # Dependencias y scripts
├── vite.config.js # Configuración Vite
└── README.md # Este archivo


## ⚙️ Configuración

### Variables de entorno
Crea un archivo `.env` con las siguientes variables:
env
VITE_API_URL=http://localhost:5000/
VITE_APP_NAME=Coworking Reservas
VITE_DEFAULT_LANGUAGE=es

Crea un archivo `.env.production` con las siguientes variables:
env
VITE_API_URL=/api
VITE_APP_NAME=Coworking Reservas
VITE_DEFAULT_LANGUAGE=es

##  Instalación y Ejecución
1. Clona el repositorio  
   `git clone https://github.com/jimmyperezpierola/coworking-reservation-system && cd frontend`  
2. Instala dependencias  
   `npm install`  
3. Inicia en modo desarrollo  
   `npm run dev`  

### Docker
Construir imagen
bash
docker build -t frontend-coworking -f Dockerfile-dev .
Ejecutar contenedor

bash
docker run -p 3000:80 frontend-coworking
Docker Compose (con backend)

bash
docker compose up --build

### 🔧 Configuración de Nginx
El archivo nginx.conf contiene la configuración para:

Servir archivos estáticos
Proxy inverso para API (/api → backend:5000)
Compresión Gzip
Configuración de caché

### 📄 Licencia
Este proyecto está licenciado bajo la licencia MIT - ver LICENSE para más detalles.

### ✉️ Contacto
Manuel Monterde - mmonterde.app@gmail.com
Jimmy Perez - pila900@gmail.com
Repositorio: https://github.com/jimmyperezpierola/coworking-reservation-system
