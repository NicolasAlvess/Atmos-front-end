// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Survey from './pages/Survey';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ThankYou from './pages/ThankYou';
import About from './pages/About';
import Theories from './pages/Theories';
import ProtectedRoute from './components/ProtectedRoute';
import RouteAnnouncer from './components/a11y/RouteAnnouncer';

export default function App() {
  return (
    <Router>
      <RouteAnnouncer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey/:slug" element={<Survey />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teorias"
          element={
            <ProtectedRoute>
              <Theories />
            </ProtectedRoute>
          }
        />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/sobre" element={<About />} />
      </Routes>
    </Router>
  );
}