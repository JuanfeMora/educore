import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const rolColors = {
    administrador: 'bg-violet-100 text-violet-700',
    profesor: 'bg-emerald-100 text-emerald-700',
    estudiante: 'bg-sky-100 text-sky-700'
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        <span className="text-gray-900 font-semibold text-lg tracking-tight">EduCore</span>
      </Link>

      <div className="flex items-center gap-4">
        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${rolColors[usuario?.rol] || 'bg-gray-100 text-gray-600'}`}>
          {usuario?.rol}
        </span>
        <div className="w-px h-5 bg-gray-200" />
        <span className="text-sm text-gray-600 font-medium">{usuario?.nombre}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-900 transition font-medium"
        >
          Salir →
        </button>
      </div>
    </nav>
  )
}

export default Navbar