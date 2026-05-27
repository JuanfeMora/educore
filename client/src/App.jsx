import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Cursos from './pages/Cursos'
import Materias from './pages/Materias'
import Tareas from './pages/Tareas'
import Entregas from './pages/Entregas'
import Calificaciones from './pages/Calificaciones'
import MisCursos from './pages/MisCursos'
import MisEntregas from './pages/MisEntregas'
import MisCalificaciones from './pages/MisCalificaciones'
import Notificaciones from './pages/Notificaciones'
import Usuarios from './pages/Usuarios'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/cursos" element={
            <PrivateRoute><Cursos /></PrivateRoute>
          } />
          <Route path="/cursos/:curso_id/materias" element={
            <PrivateRoute><Materias /></PrivateRoute>
          } />
          <Route path="/materias/:materia_id/tareas" element={
            <PrivateRoute><Tareas /></PrivateRoute>
          } />
          <Route path="/tareas/:tarea_id/entregas" element={
            <PrivateRoute><Entregas /></PrivateRoute>
          } />
          <Route path="/entregas/:entrega_id/calificaciones" element={
            <PrivateRoute><Calificaciones /></PrivateRoute>
          } />
          <Route path="/mis-cursos" element={
            <PrivateRoute roles={['estudiante']}><MisCursos /></PrivateRoute>
          } />
          <Route path="/mis-entregas" element={
            <PrivateRoute roles={['estudiante']}><MisEntregas /></PrivateRoute>
          } />
          <Route path="/mis-calificaciones" element={
            <PrivateRoute roles={['estudiante']}><MisCalificaciones /></PrivateRoute>
          } />
          <Route path="/notificaciones" element={
            <PrivateRoute roles={['estudiante']}><Notificaciones /></PrivateRoute>
          } />
          <Route path="/usuarios" element={
            <PrivateRoute roles={['administrador']}><Usuarios /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App