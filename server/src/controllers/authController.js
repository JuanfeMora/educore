const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { nombre, email, password, rol_id } = req.body

  try {
    // Verificar si el email ya existe
    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email])
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10)

    // Insertar usuario
    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol_id) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol_id',
      [nombre, email, hash, rol_id]
    )

    res.status(201).json({ mensaje: 'Usuario creado', usuario: resultado.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor', detalle: err.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Buscar usuario
    const resultado = await pool.query(
      'SELECT u.*, r.nombre as rol FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.email = $1',
      [email]
    )

    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const usuario = resultado.rows[0]

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password)
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor', detalle: err.message })
  }
}

module.exports = { register, login }