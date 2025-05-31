[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# 🏢 Coworking App – Dockerized Full Stack Setup

Proyecto full-stack para gestión de espacios de coworking con:

-  **Frontend**: React + Vite
-  **Backend**: Node.js + Express
-  **Base de Datos**: PostgreSQL
-  **Proxy & Static Server**: NGINX
-  **Admin DB Web UI**: Adminer

---

## 📦 Estructura de Contenedores (`docker-compose.yml`)

| Servicio   | Descripción                             | Puerto     |
|------------|------------------------------------------|------------|
| `frontend` | React app servida con NGINX              | `3000`     |
| `backend`  | API REST Node.js                         | `5000`     |
| `db`       | PostgreSQL 14                            | `5432`     |
| `init-db`  | Script para inicialización de admin      | _interno_  |
| `adminer`  | UI web para gestión de PostgreSQL        | `8899`     |

---

##  Comandos esenciales

### Levantar todo

bash
docker compose up -d --build

## Ver logs
bash
docker compose logs -f

### Acceder a Adminer

URL: http://localhost:8899
Sistema: PostgreSQL
Servidor: db
Usuario: coworking_user
Contraseña: password123
Base de datos: coworking

## Notas importantes

El frontend usa VITE_API_URL=/api, y NGINX lo proxyea internamente a http://backend:5000.
El backend requiere una variable de entorno obligatoria: JWT_SECRET.
El puerto de postgres en el host puede cambiar si hay conflicto (ej. usar 5433:5432).
Si querés usar PgAdmin, podés integrarlo como servicio alternativo (ver más abajo).

## Agregar PgAdmin (opcional)
Si en el futuro querés usar PgAdmin en vez de Adminer:

yaml
Copiar
Editar
pgadmin:
  image: dpage/pgadmin4
  ports:
    - "5050:80"
  environment:
    PGADMIN_DEFAULT_EMAIL: admin@admin.com
    PGADMIN_DEFAULT_PASSWORD: admin123
  depends_on:
    - db
Acceso: http://localhost:5050

## Limpieza
bash
Copiar
Editar
docker compose down -v  # Detiene y borra volúmenes
docker system prune -af # Limpia imágenes/volúmenes no usados

## Checklist de Funcionamiento
 Frontend accesible en http://localhost:3000
 Backend corriendo en http://localhost:5000
 Adminer operativo en http://localhost:8899
 Login funcionando correctamente
 Base conectada y operativa
 Variables de entorno funcionando (VITE_API_URL, JWT_SECRET)
 Docker funcionando 

 ##  Autor y Créditos
Desarrollado por Manuel Monterde; Jimmy Perez  
Contacto: mmonterde.app@gmail.com  ; pila900@gmail.com
Repositorio: https://github.com/jimmyperezpierola/coworking-reservation-system

## Licencia
Este proyecto está licenciado bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.


