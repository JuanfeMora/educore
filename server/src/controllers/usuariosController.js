const pool = require('../config/db')

const getUsuarios = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT u.id, u.nombre, u.email, u.creado_en, r.nombre as rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.creado_en DESC
    `)
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getUsuarios }