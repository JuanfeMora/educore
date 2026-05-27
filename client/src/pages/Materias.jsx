import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'

const Materias = () => {
  const { curso_id } = useParams()
  const { usuario } = useAuth()
  const [materias, setMaterias] = useState([])
  const [form, setForm] = useState({ nombre: '' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const { data } = await api.get(`/materias/curso/${curso_id}`)
      setMaterias(data)
    } catch (err) {
      setError('Error cargando materias')
    }
  }

  useEffect(() => { cargar() }, [curso_id])

  const handleCrear = async (e) => {
    e.preventDefault()
    try {
      await api.post('/materias', { nombre: form.nombre, curso_id })
      setForm({ nombre: '' })
      setMostrarForm(false)
      cargar()
    } catch (err) {
      setError(err.response?.data?.error || 'Error creando materia')
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta materia?')) return
    try {
      await api.delete(`/materias/${id}`)
      cargar()
    } catch (err) {
      setError('Error eliminando materia')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Materias</h2>
          {(usuario?.rol === 'administrador' || usuario?.rol === 'profesor') && (
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition"
            >
              {mostrarForm ? 'Cancelar' : '+ Nueva materia'}
            </button>
          )}
        </div>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

        {mostrarForm && (
          <form onSubmit={handleCrear} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la materia</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.nombre}
                onChange={e => setForm({ nombre: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
              Crear materia
            </button>
          </form>
        )}

        <div className="space-y-4">
          {materias.length === 0 && <p className="text-gray-500 text-center py-10">No hay materias en este curso</p>}
          {materias.map(m => (
            <div key={m.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
              <div>
                <Link to={`/materias/${m.id}/tareas`} className="font-bold text-blue-700 hover:underline">
                  {m.nombre}
                </Link> 
                <p className="text-xs text-gray-400 mt-1">ID: {m.id}</p>
              </div>
              <div className="flex gap-3">
                {(usuario?.rol === 'administrador' || usuario?.rol === 'profesor') && (
                  <button
                    onClick={() => handleEliminar(m.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
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

export default Materias