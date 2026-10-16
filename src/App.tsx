import { Navigate, Route, Routes } from 'react-router'
import { GuestOnly, RequireAuth, RequireProfile } from './auth/guards.tsx'
import AppShell from './components/AppShell.tsx'
import AuthForm from './components/AuthForm.tsx'
import AuthLayout from './components/AuthLayout.tsx'
import ConversationPage from './pages/ConversationPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import LandingPage from './pages/LandingPage.tsx'
import OnboardingPage from './pages/OnboardingPage.tsx'

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />

      <Route element={<GuestOnly />}>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<AuthForm key="login" mode="login" />} />
          <Route path="signup" element={<AuthForm key="signup" mode="signup" />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route element={<RequireProfile />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="conversations/:id" element={<ConversationPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
