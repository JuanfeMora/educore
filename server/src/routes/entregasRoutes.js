const express = require('express')
const router = express.Router()
const { getEntregasByTarea, getEntregasByEstudiante, crearEntrega, actualizarEntrega } = require('../controllers/entregasController')
const { verificarToken, soloRol } = require('../middlewares/authMiddleware')

router.get('/tarea/:tarea_id', verificarToken, getEntregasByTarea)
router.get('/mis-entregas', verificarToken, soloRol('estudiante'), getEntregasByEstudiante)
router.post('/', verificarToken, soloRol('estudiante'), crearEntrega)
router.put('/:id', verificarToken, soloRol('estudiante'), actualizarEntrega)

module.exports = router