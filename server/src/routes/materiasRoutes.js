const express = require('express')
const router = express.Router()
const { getMateriasByCurso, crearMateria, actualizarMateria, eliminarMateria } = require('../controllers/materiasController')
const { verificarToken, soloRol } = require('../middlewares/authMiddleware')

router.get('/curso/:curso_id', verificarToken, getMateriasByCurso)
router.post('/', verificarToken, soloRol('administrador', 'profesor'), crearMateria)
router.put('/:id', verificarToken, soloRol('administrador', 'profesor'), actualizarMateria)
router.delete('/:id', verificarToken, soloRol('administrador'), eliminarMateria)

module.exports = router