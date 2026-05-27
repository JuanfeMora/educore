import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get('/usuarios')
        setUsuarios(data)
      } catch (err) {
        setError('Error cargando usuarios')
      }
    }
    cargar()
  }, [])

  const rolColor = (rol) => {
    if (rol === 'administrador') return 'bg-violet-100 text-violet-700'
    if (rol === 'profesor') return 'bg-emerald-100 text-emerald-700'
    return 'bg-sky-100 text-sky-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Administración</p>
          <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
        </div>

        {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">{error}</div>}

        <div className="space-y-3">
          {usuarios.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-sm">No hay usuarios registrados</p>
            </div>
          )}
          {usuarios.map(u => (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{u.nombre}</p>
                <p className="text-sm text-gray-400 mt-0.5">{u.email}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${rolColor(u.rol)}`}>
                {u.rol}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Usuarios