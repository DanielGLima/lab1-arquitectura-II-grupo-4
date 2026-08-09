# Gestión de Usuarios — Arquitectura de Computadoras II

API REST para crear, consultar, actualizar y eliminar usuarios, construida con **Node.js + Express** y **PostgreSQL**, empaquetada con **Docker**.

> Universidad Mariano Gálvez de Guatemala — Ingeniería en Sistemas de Información
> Curso: Arquitectura de Computadoras II – 040 | Hoja de trabajo 1
> Imagen de Docker: `lab1-arquitectua-ii-grupo-{N}` <!-- TODO: confirmar el número real del grupo -->

## Integrantes y roles

| Persona | Rol |
|---|---|
| Heidy | Backend: rutas y lógica CRUD (Express.js) |
| Santiago| Base de datos (PostgreSQL) |
| Daniel| Docker y despliegue |
| Victor| Pruebas y validación (Postman/curl) |
| jimmy | Integración, documentación y coordinación |

## Tecnologías

- **Node.js 20** (`node:20-alpine`)
- **Express.js** — rutas y manejo de solicitudes HTTP
- **PostgreSQL 16** (`postgres:16-alpine`) — persistencia de usuarios
- **Docker / docker-compose** — orquestación de la app y la base de datos
- **bcryptjs** — hashing de contraseñas antes de guardarlas

## Estructura del proyecto

```
lab1-arquitectura-ii/
├── docker-compose.yml       # Orquesta app + PostgreSQL
├── Dockerfile                # Imagen de la app (expone puerto 5050)
├── .dockerignore
├── .env.example               # Plantilla de variables de entorno
├── init.sql                   # Crea la tabla "usuarios"
├── package.json
├── README.md
└── src/
    ├── server.js               # Punto de entrada Express
    ├── db/
    │   └── pool.js              # Conexión a PostgreSQL (pg.Pool)
    └── routes/
        └── users.js              # CRUD de usuarios
```

## Variables de entorno

Copiar `.env.example` a `.env` antes de levantar el proyecto (no se sube al repositorio con valores reales).

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `PORT` | Puerto interno donde escucha Express | `5050` |
| `DB_HOST` | Host de la base de datos (nombre del servicio Docker) | `db` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de la base de datos | `postgres` |
| `DB_NAME` | Nombre de la base de datos | `usersdb` |

## Instalación y ejecución

1. Clonar el repositorio y ubicarse en la carpeta raíz.
2. Copiar `.env.example` a `.env`.
3. Levantar todo el proyecto con un solo comando:

   ```bash
   docker compose up --build
   ```

   Esto construye la imagen de la app, levanta PostgreSQL y ejecuta `init.sql` automáticamente para crear la tabla `usuarios`.

4. La aplicación queda disponible en:

   ```
   http://localhost:3000/users
   ```

   > El contenedor **expone internamente el puerto 5050** (como pide la hoja de trabajo), pero `docker-compose.yml` lo mapea al puerto **3000 del host**, que es el que se usa en las pruebas (`localhost:3000/users`).

Para detener los contenedores:

```bash
docker compose down          # detiene y elimina los contenedores
docker compose down -v       # además elimina el volumen (borra los datos)
```

Para ver los logs:

```bash
docker compose logs -f
```

## Endpoints

| Método | Ruta | Descripción | Body (JSON) |
|---|---|---|---|
| `GET` | `/users` | Lista todos los usuarios | — |
| `GET` | `/users/:id` | Consulta un usuario por id | — |
| `POST` | `/users` | Crea un nuevo usuario | `{ "nombre", "correo", "contrasena" }` |
| `PUT` | `/users/:id` | Actualiza campos de un usuario existente | `{ "nombre"?, "correo"?, "contrasena"? }` |
| `DELETE` | `/users/:id` | Elimina un usuario por id | — |

Códigos de respuesta: `200` OK, `201` creado, `400` validación fallida, `404` no encontrado, `409` correo duplicado.

## Ejemplos de uso (curl)

```bash
# Lista vacía al arrancar
curl http://localhost:3000/users
# => []

# Crear un usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Perez","correo":"juan@example.com","contrasena":"secreta123"}'

# Listar usuarios (debe incluir el usuario creado)
curl http://localhost:3000/users

# Actualizar un usuario
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Pérez Actualizado"}'

# Eliminar un usuario
curl -X DELETE http://localhost:3000/users/1
```

## Arquitectura

![Diagrama de arquitectura](diagrama-arquitectura.svg)

```
Cliente (navegador / Postman / curl)
        │  HTTP :3000 (host)
        ▼
Contenedor "app" (Node.js + Express) — escucha :5050 interno
        │  TCP :5432 (red interna de Docker)
        ▼
Contenedor "db" (PostgreSQL 16 + volumen persistente "db_data")
```

## Pruebas realizadas (Persona 4)

Evidenciadas con capturas de Postman y navegador:

1. `GET /users` con la app recién levantada → devuelve lista vacía `[]`.
2. `POST /users` con datos válidos → `201`, usuario creado.
3. `GET /users` de nuevo → el usuario creado aparece en el listado.
4. `PUT /users/:id` → los datos se actualizan correctamente.
5. `DELETE /users/:id` → elimina al usuario.
6. `GET /users` (o `/users/:id`) → confirma que el usuario ya no existe.

## Seguridad implementada

- Las contraseñas **nunca se guardan en texto plano**: se hashean con `bcryptjs` antes de insertarse.
- Las credenciales de la base de datos se manejan por variables de entorno (`.env`, fuera del control de versiones; solo se versiona `.env.example`).
- El campo `correo` tiene restricción `UNIQUE` en la base de datos.

## Notas

- Se puede ampliar con autenticación, paginación u otras validaciones.
- El `docker-compose.yml` puede adaptarse a otros motores de base de datos.
