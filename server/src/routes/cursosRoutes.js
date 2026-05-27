const express = require('express')
const router = express.Router()
const { getCursos, getCursoById, crearCurso, actualizarCurso, eliminarCurso } = require('../controllers/cursosController')
const { verificarToken, soloRol } = require('../middlewares/authMiddleware')

router.get('/', verificarToken, getCursos)
router.get('/:id', verificarToken, getCursoById)
router.post('/', verificarToken, soloRol('administrador', 'profesor'), crearCurso)
router.put('/:id', verificarToken, soloRol('administrador', 'profesor'), actualizarCurso)
router.delete('/:id', verificarToken, soloRol('administrador'), eliminarCurso)

module.exports = router