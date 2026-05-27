import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'

const Entregas = () => {
  const { tarea_id } = useParams()
  const { usuario } = useAuth()
  const [entregas, setEntregas] = useState([])
  const [form, setForm] = useState({ archivo_url: '', comentario: '' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const { data } = await api.get(`/entregas/tarea/${tarea_id}`)
      setEntregas(data)
    } catch (err) {
      setError('Error cargando entregas')
    }
  }

  useEffect(() => { cargar() }, [tarea_id])

  const handleEntregar = async (e) => {
    e.preventDefault()
    try {
      await api.post('/entregas', { ...form, tarea_id })
      setForm({ archivo_url: '', comentario: '' })
      setMostrarForm(false)
      cargar()
    } catch (err) {
      setError(err.response?.data?.error || 'Error realizando entrega')
    }
  }

  const estadoColor = (estado) => {
    if (estado === 'entregado') return 'bg-green-100 text-green-700'
    if (estado === 'tarde') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Entregas</h2>
          {usuario?.rol === 'estudiante' && (
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition"
            >
              {mostrarForm ? 'Cancelar' : '+ Realizar entrega'}
            </button>
          )}
        </div>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

        {mostrarForm && (
          <form onSubmit={handleEntregar} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL del archivo</label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.archivo_url}
                onChange={e => setForm({ ...form, archivo_url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.comentario}
                onChange={e => setForm({ ...form, comentario: e.target.value })}
                rows={3}
              />
            </div>
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
              Entregar
            </button>
          </form>
        )}

        <div className="space-y-4">
          {entregas.length === 0 && <p className="text-gray-500 text-center py-10">No hay entregas aún</p>}
          {entregas.map(e => (
            <div key={e.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <Link to={`/entregas/${e.id}/calificaciones`} className="font-bold text-blue-700 hover:underline">
                    {e.estudiante_nombre}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{e.comentario}</p>
                  {e.archivo_url && (
                    <a href={e.archivo_url} target="_blank" rel="noreferrer"
                      className="text-blue-600 text-sm hover:underline mt-1 block">
                      Ver archivo
                    </a>
                  )}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${estadoColor(e.estado)}`}>
                  {e.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Entregas