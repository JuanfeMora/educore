const express = require('express')
const router = express.Router()
const { getTareasByMateria, crearTarea, actualizarTarea, eliminarTarea } = require('../controllers/tareasController')
const { verificarToken, soloRol } = require('../middlewares/authMiddleware')

router.get('/materia/:materia_id', verificarToken, getTareasByMateria)
router.post('/', verificarToken, soloRol('administrador', 'profesor'), crearTarea)
router.put('/:id', verificarToken, soloRol('administrador', 'profesor'), actualizarTarea)
router.delete('/:id', verificarToken, soloRol('administrador', 'profesor'), eliminarTarea)

module.exports = router