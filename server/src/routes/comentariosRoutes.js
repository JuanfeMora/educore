const express = require('express')
const router = express.Router()
const { getComentariosByEntrega, crearComentario, eliminarComentario } = require('../controllers/comentariosController')
const { verificarToken, soloRol } = require('../middlewares/authMiddleware')

router.get('/entrega/:entrega_id', verificarToken, getComentariosByEntrega)
router.post('/', verificarToken, crearComentario)
router.delete('/:id', verificarToken, soloRol('administrador', 'profesor'), eliminarComentario)

module.exports = router