import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const MisEntregas = () => {
  const [entregas, setEntregas] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get('/entregas/mis-entregas')
        setEntregas(data)
      } catch (err) {
        setError('Error cargando entregas')
      }
    }
    cargar()
  }, [])

  const estadoColor = (estado) => {
    if (estado === 'entregado') return 'bg-green-100 text-green-700'
    if (estado === 'tarde') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Entregas</h2>
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
        <div className="space-y-4">
          {entregas.length === 0 && <p className="text-gray-500 text-center py-10">No tienes entregas aún</p>}
          {entregas.map(e => (
            <div key={e.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800">{e.tarea_titulo}</h3>
                <p className="text-sm text-gray-500 mt-1">{e.comentario}</p>
                {e.archivo_url && (
                  <a href={e.archivo_url} target="_blank" rel="noreferrer"
                    className="text-blue-600 text-sm hover:underline mt-1 block">
                    Ver archivo
                  </a>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Entregado: {new Date(e.entregado_en).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${estadoColor(e.estado)}`}>
                {e.estado}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MisEntregas