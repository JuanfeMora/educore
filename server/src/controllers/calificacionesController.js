const pool = require('../config/db')

const getCalificacionesByEntrega = async (req, res) => {
  const { entrega_id } = req.params
  try {
    const resultado = await pool.query(`
      SELECT c.*, u.nombre as profesor_nombre
      FROM calificaciones c
      JOIN usuarios u ON c.profesor_id = u.id
      WHERE c.entrega_id = $1
    `, [entrega_id])
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getCalificacionesByEstudiante = async (req, res) => {
  const { estudiante_id } = req.params
  try {
    const resultado = await pool.query(`
      SELECT c.*, t.titulo as tarea_titulo, u.nombre as profesor_nombre
      FROM calificaciones c
      JOIN entregas e ON c.entrega_id = e.id
      JOIN tareas t ON e.tarea_id = t.id
      JOIN usuarios u ON c.profesor_id = u.id
      WHERE e.estudiante_id = $1
      ORDER BY c.calificado_en DESC
    `, [estudiante_id])
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const crearCalificacion = async (req, res) => {
  const { entrega_id, nota } = req.body
  const profesor_id = req.usuario.id

  try {
    // Verificar si ya calificó
    const existe = await pool.query(
      'SELECT id FROM calificaciones WHERE entrega_id = $1', [entrega_id]
    )
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Esta entrega ya fue calificada' })
    }

    const resultado = await pool.query(
      'INSERT INTO calificaciones (entrega_id, profesor_id, nota) VALUES ($1, $2, $3) RETURNING *',
      [entrega_id, profesor_id, nota]
    )

    // Crear notificación automática al estudiante
    const entrega = await pool.query('SELECT estudiante_id FROM entregas WHERE id = $1', [entrega_id])
    const estudiante_id = entrega.rows[0].estudiante_id
    await pool.query(
      'INSERT INTO notificaciones (usuario_id, mensaje) VALUES ($1, $2)',
      [estudiante_id, `Tu entrega ha sido calificada con nota: ${nota}`]
    )

    res.status(201).json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const actualizarCalificacion = async (req, res) => {
  const { id } = req.params
  const { nota } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE calificaciones SET nota = $1 WHERE id = $2 RETURNING *',
      [nota, id]
    )
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Calificación no encontrada' })
    }
    res.json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getCalificacionesByEntrega, getCalificacionesByEstudiante, crearCalificacion, actualizarCalificacion }