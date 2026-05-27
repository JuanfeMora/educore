const pool = require('../config/db')

const getComentariosByEntrega = async (req, res) => {
  const { entrega_id } = req.params
  try {
    const resultado = await pool.query(`
      SELECT c.*, u.nombre as autor_nombre, r.nombre as autor_rol
      FROM comentarios c
      JOIN usuarios u ON c.autor_id = u.id
      JOIN roles r ON u.rol_id = r.id
      WHERE c.entrega_id = $1
      ORDER BY c.creado_en ASC
    `, [entrega_id])
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const crearComentario = async (req, res) => {
  const { entrega_id, contenido } = req.body
  const autor_id = req.usuario.id
  try {
    const resultado = await pool.query(
      'INSERT INTO comentarios (entrega_id, autor_id, contenido) VALUES ($1, $2, $3) RETURNING *',
      [entrega_id, autor_id, contenido]
    )

    // Notificar al estudiante si el comentario lo hace el profesor
    if (req.usuario.rol === 'profesor') {
      const entrega = await pool.query('SELECT estudiante_id FROM entregas WHERE id = $1', [entrega_id])
      const estudiante_id = entrega.rows[0].estudiante_id
      await pool.query(
        'INSERT INTO notificaciones (usuario_id, mensaje) VALUES ($1, $2)',
        [estudiante_id, 'Tu profesor dejó un comentario en tu entrega']
      )
    }

    res.status(201).json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const eliminarComentario = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM comentarios WHERE id = $1', [id])
    res.json({ mensaje: 'Comentario eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getComentariosByEntrega, crearComentario, eliminarComentario }