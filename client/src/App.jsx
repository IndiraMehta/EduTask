import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import CreateAssignment from './pages/CreateAssignment';
import Tests from './pages/Tests';
import CreateTest from './pages/CreateTest';
import GradeAssignments from './pages/GradeAssignments';
import GradeTests from './pages/GradeTests';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute>
                <Assignments />
              </ProtectedRoute>
            } />
            <Route path="/create-assignment" element={
              <ProtectedRoute requiredRole="teacher">
                <CreateAssignment />
              </ProtectedRoute>
            } />
            <Route path="/tests" element={
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            } />
            <Route path="/create-test" element={
              <ProtectedRoute requiredRole="teacher">
                <CreateTest />
              </ProtectedRoute>
            } />
            <Route path="/grade-assignments" element={
              <ProtectedRoute requiredRole="teacher">
                <GradeAssignments />
              </ProtectedRoute>
            } />
            <Route path="/grade-tests" element={
              <ProtectedRoute requiredRole="teacher">
                <GradeTests />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;