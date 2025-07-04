import { useAuth } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, BookOpen, GraduationCap, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const Header = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
  <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      
      {/* Logo + Title */}
      <Link to="/dashboard" className="flex items-center space-x-2">
        <GraduationCap className="w-8 h-8 text-blue-400" />
        <span className="text-xl font-bold text-white">EduPortal</span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          to="/dashboard"
          className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/assignments"
          className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Assignments
        </Link>
        <Link
          to="/tests"
          className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Tests
        </Link>

        {userProfile?.role === 'teacher' && (
          <>
            <Link
              to="/create-assignment"
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Assignment
            </Link>
            <Link
              to="/create-test"
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Test
            </Link>
            <Link
              to="/grade-assignments"
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Grade Assignments
            </Link>
            <Link
              to="/grade-tests"
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Grade Tests
            </Link>
          </>
        )}
      </nav>

      {/* User Info + Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-white">{userProfile?.name}</span>
          <span className="px-2 py-1 bg-blue-800/30 text-blue-300 text-xs rounded-full capitalize">
            {userProfile?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  </div>
</header>

  );
};

export default Header;