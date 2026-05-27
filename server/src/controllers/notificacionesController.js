const pool = require('../config/db')

const getNotificaciones = async (req, res) => {
  const usuario_id = req.usuario.id
  try {
    const resultado = await pool.query(
      'SELECT * FROM notificaciones WHERE usuario_id = $1 ORDER BY creado_en DESC',
      [usuario_id]
    )
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const marcarLeida = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query(
      'UPDATE notificaciones SET leida = TRUE WHERE id = $1 RETURNING *',
      [id]
    )
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' })
    }
    res.json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const marcarTodasLeidas = async (req, res) => {
  const usuario_id = req.usuario.id
  try {
    await pool.query(
      'UPDATE notificaciones SET leida = TRUE WHERE usuario_id = $1',
      [usuario_id]
    )
    res.json({ mensaje: 'Todas las notificaciones marcadas como leídas' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getNotificaciones, marcarLeida, marcarTodasLeidas }