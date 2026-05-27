const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./config/db')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Rutas
const authRoutes = require('./routes/authRoutes')
const cursosRoutes = require('./routes/cursosRoutes')
const materiasRoutes = require('./routes/materiasRoutes')
const tareasRoutes = require('./routes/tareasRoutes')
const entregasRoutes = require('./routes/entregasRoutes')
const calificacionesRoutes = require('./routes/calificacionesRoutes')
const notificacionesRoutes = require('./routes/notificacionesRoutes')
const comentariosRoutes = require('./routes/comentariosRoutes')
const inscripcionesRoutes = require('./routes/inscripcionesRoutes')
const usuariosRoutes = require('./routes/usuariosRoutes')

app.use('/api/usuarios', usuariosRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cursos', cursosRoutes)
app.use('/api/materias', materiasRoutes)
app.use('/api/tareas', tareasRoutes)
app.use('/api/entregas', entregasRoutes)
app.use('/api/calificaciones', calificacionesRoutes)
app.use('/api/notificaciones', notificacionesRoutes)
app.use('/api/comentarios', comentariosRoutes)
app.use('/api/inscripciones', inscripcionesRoutes)
app.use('/api/usuarios', usuariosRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'EduCore API corriendo ✓' })
})

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})