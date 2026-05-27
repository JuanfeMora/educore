import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'

const Tareas = () => {
  const { materia_id } = useParams()
  const { usuario } = useAuth()
  const [tareas, setTareas] = useState([])
  const [form, setForm] = useState({ titulo: '', descripcion: '', fecha_limite: '' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const { data } = await api.get(`/tareas/materia/${materia_id}`)
      setTareas(data)
    } catch (err) {
      setError('Error cargando tareas')
    }
  }

  useEffect(() => { cargar() }, [materia_id])

  const handleCrear = async (e) => {
    e.preventDefault()
    try {
      await api.post('/tareas', { ...form, materia_id })
      setForm({ titulo: '', descripcion: '', fecha_limite: '' })
      setMostrarForm(false)
      cargar()
    } catch (err) {
      setError(err.response?.data?.error || 'Error creando tarea')
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    try {
      await api.delete(`/tareas/${id}`)
      cargar()
    } catch (err) {
      setError('Error eliminando tarea')
    }
  }

  const estadoFecha = (fecha) => {
    const ahora = new Date()
    const limite = new Date(fecha)
    const diff = Math.ceil((limite - ahora) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { texto: 'Vencida', color: 'text-red-500' }
    if (diff <= 3) return { texto: `Vence en ${diff} día(s)`, color: 'text-yellow-500' }
    return { texto: `Vence en ${diff} día(s)`, color: 'text-green-500' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tareas</h2>
          {(usuario?.rol === 'administrador' || usuario?.rol === 'profesor') && (
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition"
            >
              {mostrarForm ? 'Cancelar' : '+ Nueva tarea'}
            </button>
          )}
        </div>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

        {mostrarForm && (
          <form onSubmit={handleCrear} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.titulo}
                onChange={e => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
              <input
                type="datetime-local"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.fecha_limite}
                onChange={e => setForm({ ...form, fecha_limite: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
              Crear tarea
            </button>
          </form>
        )}

        <div className="space-y-4">
          {tareas.length === 0 && <p className="text-gray-500 text-center py-10">No hay tareas en esta materia</p>}
          {tareas.map(t => {
            const estado = estadoFecha(t.fecha_limite)
            return (
              <div key={t.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-start">
                <div>
                  <Link to={`/tareas/${t.id}/entregas`} className="font-bold text-blue-700 hover:underline">
                    {t.titulo}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{t.descripcion}</p>
                  <p className={`text-xs mt-2 font-medium ${estado.color}`}>{estado.texto}</p>
                </div>
                {(usuario?.rol === 'administrador' || usuario?.rol === 'profesor') && (
                  <button
                    onClick={() => handleEliminar(t.id)}
                    className="text-red-500 text-sm hover:underline ml-4"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Tareas