import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'

const Calificaciones = () => {
  const { entrega_id } = useParams()
  const { usuario } = useAuth()
  const [calificaciones, setCalificaciones] = useState([])
  const [form, setForm] = useState({ nota: '' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const { data } = await api.get(`/calificaciones/entrega/${entrega_id}`)
      setCalificaciones(data)
    } catch (err) {
      setError('Error cargando calificaciones')
    }
  }

  useEffect(() => { cargar() }, [entrega_id])

  const handleCalificar = async (e) => {
    e.preventDefault()
    try {
      await api.post('/calificaciones', { entrega_id, nota: form.nota })
      setForm({ nota: '' })
      setMostrarForm(false)
      cargar()
    } catch (err) {
      setError(err.response?.data?.error || 'Error calificando')
    }
  }

  const notaColor = (nota) => {
    if (nota >= 4.5) return 'text-green-600'
    if (nota >= 3.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Calificaciones</h2>
          {(usuario?.rol === 'profesor' || usuario?.rol === 'administrador') && calificaciones.length === 0 && (
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition"
            >
              {mostrarForm ? 'Cancelar' : '+ Calificar'}
            </button>
          )}
        </div>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

        {mostrarForm && (
          <form onSubmit={handleCalificar} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nota (0.0 - 5.0)</label>
              <input
                type="number"
                min="0" max="5" step="0.1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.nota}
                onChange={e => setForm({ nota: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
              Guardar calificación
            </button>
          </form>
        )}

        <div className="space-y-4">
          {calificaciones.length === 0 && <p className="text-gray-500 text-center py-10">Esta entrega aún no tiene calificación</p>}
          {calificaciones.map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Calificado por: {c.profesor_nombre}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(c.calificado_en).toLocaleDateString()}</p>
              </div>
              <span className={`text-3xl font-bold ${notaColor(c.nota)}`}>
                {c.nota}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calificaciones