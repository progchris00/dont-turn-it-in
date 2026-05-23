import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RoleSelection    from '@/pages/RoleSelection'
import StudentDashboard from '@/pages/StudentDashboard'
import AdminDashboard   from '@/pages/AdminDashboard'
import { ROUTES } from '@/constants'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME}              element={<RoleSelection />}    />
        <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboard />} />
        <Route path={ROUTES.ADMIN_DASHBOARD}   element={<AdminDashboard />}   />
        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
