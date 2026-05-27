import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, roles }) => {
  const { usuario, cargando } = useAuth()

  if (cargando) return <div className="flex justify-center mt-20 text-gray-500">Cargando...</div>
  if (!usuario) return <Navigate to="/login" />
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/dashboard" />

  return children
}

export default PrivateRoute