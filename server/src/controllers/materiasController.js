const pool = require('../config/db')

const getMateriasByCurso = async (req, res) => {
  const { curso_id } = req.params
  try {
    const resultado = await pool.query(
      'SELECT * FROM materias WHERE curso_id = $1 ORDER BY creado_en DESC',
      [curso_id]
    )
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const crearMateria = async (req, res) => {
  const { nombre, curso_id } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO materias (nombre, curso_id) VALUES ($1, $2) RETURNING *',
      [nombre, curso_id]
    )
    res.status(201).json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const actualizarMateria = async (req, res) => {
  const { id } = req.params
  const { nombre } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE materias SET nombre = $1 WHERE id = $2 RETURNING *',
      [nombre, id]
    )
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Materia no encontrada' })
    }
    res.json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const eliminarMateria = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM materias WHERE id = $1', [id])
    res.json({ mensaje: 'Materia eliminada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getMateriasByCurso, crearMateria, actualizarMateria, eliminarMateria }