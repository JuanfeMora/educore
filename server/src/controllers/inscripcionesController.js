const pool = require('../config/db')

const getEstudiantesByCurso = async (req, res) => {
  const { curso_id } = req.params
  try {
    const resultado = await pool.query(`
      SELECT u.id, u.nombre, u.email, i.inscrito_en
      FROM inscripciones i
      JOIN usuarios u ON i.estudiante_id = u.id
      WHERE i.curso_id = $1
      ORDER BY u.nombre ASC
    `, [curso_id])
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getCursosByEstudiante = async (req, res) => {
  const estudiante_id = req.usuario.id
  try {
    const resultado = await pool.query(`
      SELECT c.*, u.nombre as profesor_nombre, i.inscrito_en
      FROM inscripciones i
      JOIN cursos c ON i.curso_id = c.id
      JOIN usuarios u ON c.profesor_id = u.id
      WHERE i.estudiante_id = $1
      ORDER BY i.inscrito_en DESC
    `, [estudiante_id])
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const inscribirse = async (req, res) => {
  const { curso_id } = req.body
  const estudiante_id = req.usuario.id
  try {
    const resultado = await pool.query(
      'INSERT INTO inscripciones (estudiante_id, curso_id) VALUES ($1, $2) RETURNING *',
      [estudiante_id, curso_id]
    )
    res.status(201).json(resultado.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Ya estás inscrito en este curso' })
    }
    res.status(500).json({ error: err.message })
  }
}

const desinscribirse = async (req, res) => {
  const { curso_id } = req.params
  const estudiante_id = req.usuario.id
  try {
    await pool.query(
      'DELETE FROM inscripciones WHERE estudiante_id = $1 AND curso_id = $2',
      [estudiante_id, curso_id]
    )
    res.json({ mensaje: 'Desinscrito del curso' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getEstudiantesByCurso, getCursosByEstudiante, inscribirse, desinscribirse }