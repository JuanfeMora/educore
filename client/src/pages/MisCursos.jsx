import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

const MisCursos = () => {
  const [cursos, setCursos] = useState([])
  const [todosLosCursos, setTodosLosCursos] = useState([])
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const [misCursos, todos] = await Promise.all([
        api.get('/inscripciones/mis-cursos'),
        api.get('/cursos')
      ])
      setCursos(misCursos.data)
      setTodosLosCursos(todos.data)
    } catch (err) {
      setError('Error cargando cursos')
    }
  }

  useEffect(() => { cargar() }, [])

  const inscribirse = async (curso_id) => {
    try {
      await api.post('/inscripciones', { curso_id })
      cargar()
    } catch (err) {
      setError(err.response?.data?.error || 'Error inscribiéndose')
    }
  }

  const cursosInscritos = new Set(cursos.map(c => c.id))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Cursos</h2>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

        {cursos.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Inscritos</h3>
            <div className="space-y-4 mb-8">
              {cursos.map(c => (
                <div key={c.id} className="bg-white rounded-xl shadow p-5">
                  <h4 className="font-bold text-gray-800">{c.nombre}</h4>
                  <p className="text-sm text-gray-500 mt-1">{c.descripcion}</p>
                  <p className="text-xs text-gray-400 mt-1">Profesor: {c.profesor_nombre}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <h3 className="text-lg font-semibold text-gray-700 mb-3">Cursos disponibles</h3>
        <div className="space-y-4">
          {todosLosCursos.filter(c => !cursosInscritos.has(c.id)).map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-800">{c.nombre}</h4>
                <p className="text-sm text-gray-500 mt-1">{c.descripcion}</p>
                <p className="text-xs text-gray-400 mt-1">Profesor: {c.profesor_nombre}</p>
              </div>
              <button
                onClick={() => inscribirse(c.id)}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition ml-4"
              >
                Inscribirse
              </button>
            </div>
          ))}
          {todosLosCursos.filter(c => !cursosInscritos.has(c.id)).length === 0 && (
            <p className="text-gray-500 text-center py-6">Estás inscrito en todos los cursos disponibles</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MisCursos