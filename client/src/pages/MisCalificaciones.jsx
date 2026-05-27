import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'

const MisCalificaciones = () => {
  const { usuario } = useAuth()
  const [calificaciones, setCalificaciones] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get(`/calificaciones/estudiante/${usuario.id}`)
        setCalificaciones(data)
      } catch (err) {
        setError('Error cargando calificaciones')
      }
    }
    cargar()
  }, [usuario.id])

  const notaColor = (nota) => {
    if (nota >= 4.5) return 'text-green-600'
    if (nota >= 3.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const promedio = calificaciones.length > 0
    ? (calificaciones.reduce((acc, c) => acc + parseFloat(c.nota), 0) / calificaciones.length).toFixed(2)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mis Calificaciones</h2>

        {promedio && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 flex justify-between items-center">
            <p className="text-gray-600 font-medium">Promedio general</p>
            <span className={`text-3xl font-bold ${notaColor(promedio)}`}>{promedio}</span>
          </div>
        )}

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

        <div className="space-y-4">
          {calificaciones.length === 0 && <p className="text-gray-500 text-center py-10">No tienes calificaciones aún</p>}
          {calificaciones.map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800">{c.tarea_titulo}</h3>
                <p className="text-sm text-gray-500 mt-1">Profesor: {c.profesor_nombre}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(c.calificado_en).toLocaleDateString()}</p>
              </div>
              <span className={`text-3xl font-bold ${notaColor(c.nota)}`}>{c.nota}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MisCalificaciones