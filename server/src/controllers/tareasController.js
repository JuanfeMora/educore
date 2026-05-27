const pool = require('../config/db')

const getTareasByMateria = async (req, res) => {
  const { materia_id } = req.params
  try {
    const resultado = await pool.query(
      'SELECT * FROM tareas WHERE materia_id = $1 ORDER BY fecha_limite ASC',
      [materia_id]
    )
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const crearTarea = async (req, res) => {
  const { titulo, descripcion, fecha_limite, materia_id } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO tareas (titulo, descripcion, fecha_limite, materia_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, descripcion, fecha_limite, materia_id]
    )
    res.status(201).json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const actualizarTarea = async (req, res) => {
  const { id } = req.params
  const { titulo, descripcion, fecha_limite } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE tareas SET titulo = $1, descripcion = $2, fecha_limite = $3 WHERE id = $4 RETURNING *',
      [titulo, descripcion, fecha_limite, id]
    )
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' })
    }
    res.json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const eliminarTarea = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM tareas WHERE id = $1', [id])
    res.json({ mensaje: 'Tarea eliminada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getTareasByMateria, crearTarea, actualizarTarea, eliminarTarea }