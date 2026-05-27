const express = require('express')
const router = express.Router()
const { getNotificaciones, marcarLeida, marcarTodasLeidas } = require('../controllers/notificacionesController')
const { verificarToken } = require('../middlewares/authMiddleware')

router.get('/', verificarToken, getNotificaciones)
router.put('/:id/leida', verificarToken, marcarLeida)
router.put('/todas/leidas', verificarToken, marcarTodasLeidas)

module.exports = router