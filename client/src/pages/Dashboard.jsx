import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { usuario } = useAuth()

  const tarjetasAdmin = [
    { titulo: 'Usuarios', descripcion: 'Gestionar usuarios y roles del sistema', link: '/usuarios', icono: '👥', color: 'border-violet-200 hover:border-violet-400' },
    { titulo: 'Cursos', descripcion: 'Crear y administrar todos los cursos', link: '/cursos', icono: '📚', color: 'border-blue-200 hover:border-blue-400' },
  ]

  const tarjetasProfesor = [
  { titulo: 'Mis Cursos', descripcion: 'Ver y gestionar tus cursos activos', link: '/cursos', icono: '📚', color: 'border-blue-200 hover:border-blue-400' },
  { titulo: 'Tareas', descripcion: 'Gestionar tareas y actividades', link: '/cursos', icono: '📝', color: 'border-emerald-200 hover:border-emerald-400' },
  ]

  const tarjetasEstudiante = [
    { titulo: 'Mis Cursos', descripcion: 'Ver cursos en los que estás inscrito', link: '/mis-cursos', icono: '📚', color: 'border-blue-200 hover:border-blue-400' },
    { titulo: 'Mis Entregas', descripcion: 'Revisar el estado de tus entregas', link: '/mis-entregas', icono: '📤', color: 'border-emerald-200 hover:border-emerald-400' },
    { titulo: 'Calificaciones', descripcion: 'Ver tus notas y promedio general', link: '/mis-calificaciones', icono: '🎯', color: 'border-amber-200 hover:border-amber-400' },
    { titulo: 'Notificaciones', descripcion: 'Revisar avisos académicos', link: '/notificaciones', icono: '🔔', color: 'border-rose-200 hover:border-rose-400' },
  ]

  const tarjetas = usuario?.rol === 'administrador' ? tarjetasAdmin
    : usuario?.rol === 'profesor' ? tarjetasProfesor
    : tarjetasEstudiante

  const horaDelDia = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">{horaDelDia()}</p>
          <h2 className="text-3xl font-bold text-gray-900">{usuario?.nombre}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tarjetas.map((t) => (
            <Link
              key={t.titulo}
              to={t.link}
              className={`bg-white rounded-2xl p-6 border-2 transition-all duration-200 group ${t.color}`}
            >
              <div className="text-3xl mb-4">{t.icono}</div>
              <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition">{t.titulo}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{t.descripcion}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard