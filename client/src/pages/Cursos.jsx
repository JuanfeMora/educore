import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'

const Cursos = () => {
  const { usuario } = useAuth()
  const [cursos, setCursos] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [error, setError] = useState('')

  const cargarCursos = async () => {
    try {
      const { data } = await api.get('/cursos')
      setCursos(data)
    } catch (err) {
      setError('Error cargando cursos')
    }
  }

  useEffect(() => { cargarCursos() }, [])

  const handleCrear = async (e) => {
    e.preventDefault()
    try {
      await api.post('/cursos', form)
      setForm({ nombre: '', descripcion: '' })
      setMostrarForm(false)
      cargarCursos()
    } catch (err) {
      setError(err.response?.data?.error || 'Error creando curso')
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este curso?')) return
    try {
      await api.delete(`/cursos/${id}`)
      cargarCursos()
    } catch (err) {
      setError('Error eliminando curso')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-8 py-10">

        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Académico</p>
            <h2 className="text-2xl font-bold text-gray-900">Cursos</h2>
          </div>
          {(usuario?.rol === 'administrador' || usuario?.rol === 'profesor') && (
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              {mostrarForm ? 'Cancelar' : '+ Nuevo curso'}
            </button>
          )}
        </div>

        {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">{error}</div>}

        {mostrarForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Nuevo curso</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Nombre del curso</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Descripción</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  rows={3}
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Crear curso
              </button>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {cursos.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📚</p>
              <p className="text-sm">No hay cursos disponibles</p>
            </div>
          )}
          {cursos.map(curso => (
            <div key={curso.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex justify-between items-center hover:border-blue-200 transition group">
              <div>
                <Link to={`/cursos/${curso.id}/materias`} className="font-semibold text-gray-900 hover:text-blue-600 transition group-hover:text-blue-600">
                  {curso.nombre}
                </Link>
                <p className="text-sm text-gray-400 mt-0.5">{curso.descripcion}</p>
                <p className="text-xs text-gray-300 mt-1">Prof. {curso.profesor_nombre}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/cursos/${curso.id}/materias`} className="text-xs text-blue-500 font-medium hover:underline">
                  Ver materias →
                </Link>
                {usuario?.rol === 'administrador' && (
                  <button onClick={() => handleEliminar(curso.id)} className="text-xs text-red-400 hover:text-red-600 transition">
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cursos