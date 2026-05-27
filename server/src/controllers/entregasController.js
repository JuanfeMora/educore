const pool = require('../config/db')

const getEntregasByTarea = async (req, res) => {
  const { tarea_id } = req.params
  try {
    const resultado = await pool.query(`
      SELECT e.*, u.nombre as estudiante_nombre
      FROM entregas e
      JOIN usuarios u ON e.estudiante_id = u.id
      WHERE e.tarea_id = $1
      ORDER BY e.entregado_en DESC
    `, [tarea_id])
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getEntregasByEstudiante = async (req, res) => {
  const estudiante_id = req.usuario.id
  try {
    const resultado = await pool.query(`
      SELECT e.*, t.titulo as tarea_titulo, t.fecha_limite
      FROM entregas e
      JOIN tareas t ON e.tarea_id = t.id
      WHERE e.estudiante_id = $1
      ORDER BY e.entregado_en DESC
    `, [estudiante_id])
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const crearEntrega = async (req, res) => {
  const { tarea_id, archivo_url, comentario } = req.body
  const estudiante_id = req.usuario.id

  try {
    // Verificar si ya entregó
    const existe = await pool.query(
      'SELECT id FROM entregas WHERE estudiante_id = $1 AND tarea_id = $2',
      [estudiante_id, tarea_id]
    )
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Ya realizaste una entrega para esta tarea' })
    }

    // Verificar si es tarde
    const tarea = await pool.query('SELECT fecha_limite FROM tareas WHERE id = $1', [tarea_id])
    const ahora = new Date()
    const estado = ahora > new Date(tarea.rows[0].fecha_limite) ? 'tarde' : 'entregado'

    const resultado = await pool.query(
      'INSERT INTO entregas (estudiante_id, tarea_id, archivo_url, comentario, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [estudiante_id, tarea_id, archivo_url, comentario, estado]
    )
    res.status(201).json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const actualizarEntrega = async (req, res) => {
  const { id } = req.params
  const { archivo_url, comentario } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE entregas SET archivo_url = $1, comentario = $2 WHERE id = $3 RETURNING *',
      [archivo_url, comentario, id]
    )
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega no encontrada' })
    }
    res.json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getEntregasByTarea, getEntregasByEstudiante, crearEntrega, actualizarEntrega }