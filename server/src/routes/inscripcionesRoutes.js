const express = require('express')
const router = express.Router()
const { getEstudiantesByCurso, getCursosByEstudiante, inscribirse, desinscribirse } = require('../controllers/inscripcionesController')
const { verificarToken, soloRol } = require('../middlewares/authMiddleware')

router.get('/curso/:curso_id', verificarToken, getEstudiantesByCurso)
router.get('/mis-cursos', verificarToken, soloRol('estudiante'), getCursosByEstudiante)
router.post('/', verificarToken, soloRol('estudiante'), inscribirse)
router.delete('/curso/:curso_id', verificarToken, soloRol('estudiante'), desinscribirse)

module.exports = router