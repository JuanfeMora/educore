const pool = require('../config/db')

const getCursos = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT c.*, u.nombre as profesor_nombre
      FROM cursos c
      JOIN usuarios u ON c.profesor_id = u.id
      ORDER BY c.creado_en DESC
    `)
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getCursoById = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query(`
      SELECT c.*, u.nombre as profesor_nombre
      FROM cursos c
      JOIN usuarios u ON c.profesor_id = u.id
      WHERE c.id = $1
    `, [id])

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    }

    res.json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const crearCurso = async (req, res) => {
  const { nombre, descripcion } = req.body
  const profesor_id = req.usuario.id

  try {
    const resultado = await pool.query(
      'INSERT INTO cursos (nombre, descripcion, profesor_id) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, profesor_id]
    )
    res.status(201).json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const actualizarCurso = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion } = req.body

  try {
    const resultado = await pool.query(
      'UPDATE cursos SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [nombre, descripcion, id]
    )

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    }

    res.json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const eliminarCurso = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM cursos WHERE id = $1', [id])
    res.json({ mensaje: 'Curso eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getCursos, getCursoById, crearCurso, actualizarCurso, eliminarCurso }