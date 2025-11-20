# Proyecto Alfa - Backend (MySQL / XAMPP)

## Pasos rápidos para ejecutar

1. Copia `.env.example` a `.env` y ajusta tus credenciales MySQL (XAMPP).
2. Asegúrate que la base de datos `proyecto_alfa` existe y que las tablas esperadas están creadas.
3. Instala dependencias:
   ```
   npm install
   ```
4. Ejecuta en modo desarrollo:
   ```
   npm run dev
   ```
5. Endpoint base: `http://localhost:3000/api`

## Rutas importantes
- POST `/api/auth/login` {email, password}
- POST `/api/auth/register` {nombre, email, password}

- GET `/api/universidades`
- POST `/api/universidades` (auth)
- PUT `/api/universidades/:id` (auth)
- DELETE `/api/universidades/:id` (auth)

- GET `/api/carreras/uni/:uniId`
- POST `/api/carreras` (auth)

- GET `/api/preguntas/uni/:uniId?limite=30`
- POST `/api/preguntas` (auth)
- POST `/api/preguntas/import/:uniId` (auth) -> body { preguntas: [...] }

- POST `/api/simulador/guardar` (auth)
- GET `/api/simulador/historial/uni/:uniId` (auth)
- GET `/api/simulador/historial/admin/:uniId` (auth)

- POST `/api/calculos/puntaje` -> { universidadId, notaExamen, notaGrado }

## Notas
- Este backend usa JWT para autenticar. Agrega el header `Authorization: Bearer <token>` en llamadas protegidas.
- Las tablas esperadas son: usuarios, universidades, carreras, preguntas, intentossimulador (puedes usar tu script SQL existente).