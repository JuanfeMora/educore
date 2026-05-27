# EduCore – Plataforma Inteligente de Gestión Académica

Proyecto desarrollado para la asignatura **Programación en la Web** – 2026-I  
Universidad Industrial de Santander | Ingeniería de Sistemas e Informática  
Docente: Henry Andrés Jiménez Herrera | Grupo: G2

**Integrantes:**
- Fabián Andrés Remolina Mantilla – 2241976
- Juan Felipe Mora Bejarano – 2241754

---

## Descripción

EduCore es una plataforma web de gestión académica tipo SPA (Single Page Application) que permite administrar cursos, materias, tareas, entregas y calificaciones con control de acceso basado en roles.

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Tailwind CSS (Vite) |
| Backend | Node.js + Express.js |
| Base de datos | PostgreSQL |
| Autenticación | JWT (JSON Web Tokens) |
| Control de versiones | GitHub |

---

## Roles de usuario

| Rol | Permisos |
|-----|----------|
| Administrador | Gestionar usuarios, cursos y supervisar el sistema |
| Profesor | Crear cursos, tareas, calificar entregas y comentar |
| Estudiante | Inscribirse a cursos, entregar tareas y ver calificaciones |

---

## Funcionalidades

- Gestión de tareas y entregas académicas
- Validación automática de estado (entregado / tarde)
- Dashboard académico personalizado por rol
- Sistema de notificaciones automáticas
- Restricción de funcionalidades según rol
- Gestión de comentarios y retroalimentación

---

## Estructura del proyecto

educore/
├── client/          # Frontend React + Tailwind
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── server/          # Backend Node.js + Express
└── src/
├── config/
├── controllers/
├── middlewares/
├── models/
└── routes/

---

## Instalación y ejecución

### Requisitos
- Node.js v18+
- PostgreSQL v15+

### 1. Clonar el repositorio
```bash
git clone https://github.com/JuanfeMora/educore.git
cd educore
```

### 2. Configurar el backend
```bash
cd server
npm install
```

Crear el archivo `.env` en la carpeta `server/`:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=educore
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=educore_secret_2026

### 3. Configurar la base de datos

Crear la base de datos `educore` en PostgreSQL y ejecutar el script SQL disponible en `server/database.sql`.

### 4. Configurar el frontend
```bash
cd client
npm install
```

### 5. Ejecutar el proyecto

Terminal 1 – Backend:
```bash
cd server
npm run dev
```

Terminal 2 – Frontend:
```bash
cd client
npm run dev
```

Abrir en el navegador: `http://localhost:5173`

---

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@educore.com | 123456 |
| Profesor | profesor@educore.com | 123456 |
| Estudiante | ana@educore.com | 123456 |