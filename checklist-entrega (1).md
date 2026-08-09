# Checklist de entrega — Hoja de trabajo 1

Estado según revisión del código (`lab1-arquitectura-ii.zip`) y evidencias (`Pruebas.docx`) recibidos.

## Funcionamiento
- [x] Backend implementa las 4 operaciones CRUD (`GET`, `POST`, `PUT`, `DELETE /users`)
- [x] `Dockerfile` expone el puerto `5050` internamente
- [x] `docker-compose.yml` orquesta app + PostgreSQL, con `healthcheck` para esperar la BD
- [ ] Imagen de Docker con el número de grupo real (actualmente placeholder `-grupo-1`)
- [ ] Confirmado con `docker compose up --build` corriendo de principio a fin (pendiente que alguien del equipo lo ejecute y confirme)

## Pruebas (según enunciado) — evidenciadas en Pruebas.docx
- [x] `GET /users` en app recién levantada devuelve lista vacía `[]`
- [x] `POST /users` con datos válidos responde `201` y crea el usuario
- [x] `GET /users` vuelve a consultarse y muestra al usuario agregado
- [x] `PUT /users/:id` actualiza correctamente
- [x] `DELETE /users/:id` elimina correctamente
- [x] Se verifica que el usuario eliminado ya no aparece

## Documentación
- [x] `README.md` con descripción, tecnologías, instalación/ejecución, endpoints y ejemplos
- [x] `.env.example` documentando cada variable (sin valores reales)
- [x] Diagrama simple de arquitectura
- [x] Comandos básicos documentados (`up`, `down`, `logs`)

## Pendientes de organización
- [ ] Falta `.gitignore` (node_modules, .env, npm-debug.log) — evitar subir archivos sensibles o pesados
- [ ] Definir si el código se reorganiza dentro de las carpetas `BACKEND/`, `DATABASE/`, `DOCKER/`, `TEST/` del repo de GitHub, o si se documenta tal como está (estructura plana con `src/`)
- [ ] Colección de Postman exportada como `.json` para incluir en el repo
- [ ] Capturas de pantalla organizadas como archivos individuales (actualmente están dentro de `Pruebas.docx`)

## Coordinación
- [ ] Fecha/hora de la sesión final de integración acordada con todo el equipo
- [ ] Archivos finales organizados y listos para la entrega
