-- EduCore – Script de base de datos
-- Ejecutar en PostgreSQL después de crear la base de datos 'educore'

-- 1. ROLES
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

-- 2. USUARIOS
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol_id INTEGER REFERENCES roles(id),
  creado_en TIMESTAMP DEFAULT NOW()
);

-- 3. CURSOS
CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  profesor_id INTEGER REFERENCES usuarios(id),
  creado_en TIMESTAMP DEFAULT NOW()
);

-- 4. MATERIAS
CREATE TABLE materias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- 5. INSCRIPCIONES
CREATE TABLE inscripciones (
  id SERIAL PRIMARY KEY,
  estudiante_id INTEGER REFERENCES usuarios(id),
  curso_id INTEGER REFERENCES cursos(id),
  inscrito_en TIMESTAMP DEFAULT NOW(),
  UNIQUE(estudiante_id, curso_id)
);

-- 6. TAREAS
CREATE TABLE tareas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  fecha_limite TIMESTAMP NOT NULL,
  materia_id INTEGER REFERENCES materias(id) ON DELETE CASCADE,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- 7. ENTREGAS
CREATE TABLE entregas (
  id SERIAL PRIMARY KEY,
  estudiante_id INTEGER REFERENCES usuarios(id),
  tarea_id INTEGER REFERENCES tareas(id) ON DELETE CASCADE,
  archivo_url TEXT,
  comentario TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente',
  entregado_en TIMESTAMP DEFAULT NOW()
);

-- 8. CALIFICACIONES
CREATE TABLE calificaciones (
  id SERIAL PRIMARY KEY,
  entrega_id INTEGER REFERENCES entregas(id) ON DELETE CASCADE,
  profesor_id INTEGER REFERENCES usuarios(id),
  nota NUMERIC(5,2) NOT NULL,
  calificado_en TIMESTAMP DEFAULT NOW()
);

-- 9. NOTIFICACIONES
CREATE TABLE notificaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- 10. COMENTARIOS
CREATE TABLE comentarios (
  id SERIAL PRIMARY KEY,
  entrega_id INTEGER REFERENCES entregas(id) ON DELETE CASCADE,
  autor_id INTEGER REFERENCES usuarios(id),
  contenido TEXT NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Roles base
INSERT INTO roles (nombre) VALUES ('administrador'), ('profesor'), ('estudiante');