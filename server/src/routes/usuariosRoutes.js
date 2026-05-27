const express = require('express')
const router = express.Router()
const { getUsuarios } = require('../controllers/usuariosController')
const { verificarToken, soloRol } = require('../middlewares/authMiddleware')

router.get('/', verificarToken, soloRol('administrador'), getUsuarios)

module.exports = router