const express = require('express')
const router = express.Router()
const { getCalificacionesByEntrega, getCalificacionesByEstudiante, crearCalificacion, actualizarCalificacion } = require('../controllers/calificacionesController')
const { verificarToken, soloRol } = require('../middlewares/authMiddleware')

router.get('/entrega/:entrega_id', verificarToken, getCalificacionesByEntrega)
router.get('/estudiante/:estudiante_id', verificarToken, getCalificacionesByEstudiante)
router.post('/', verificarToken, soloRol('profesor', 'administrador'), crearCalificacion)
router.put('/:id', verificarToken, soloRol('profesor', 'administrador'), actualizarCalificacion)

module.exports = router