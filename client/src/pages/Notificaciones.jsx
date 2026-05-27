import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([])

  const cargar = async () => {
    const { data } = await api.get('/notificaciones')
    setNotificaciones(data)
  }

  useEffect(() => { cargar() }, [])

  const marcarLeida = async (id) => {
    await api.put(`/notificaciones/${id}/leida`)
    cargar()
  }

  const marcarTodas = async () => {
    await api.put('/notificaciones/todas/leidas')
    cargar()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Notificaciones</h2>
          <button onClick={marcarTodas} className="text-sm text-blue-600 hover:underline">
            Marcar todas como leídas
          </button>
        </div>
        <div className="space-y-3">
          {notificaciones.length === 0 && <p className="text-gray-500 text-center py-10">No tienes notificaciones</p>}
          {notificaciones.map(n => (
            <div
              key={n.id}
              className={`rounded-xl p-4 shadow-sm flex justify-between items-center ${n.leida ? 'bg-white text-gray-400' : 'bg-blue-50 text-gray-800'}`}
            >
              <p className="text-sm">{n.mensaje}</p>
              {!n.leida && (
                <button onClick={() => marcarLeida(n.id)} className="text-xs text-blue-600 hover:underline ml-4 shrink-0">
                  Marcar leída
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Notificaciones