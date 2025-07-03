import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    branch: '',
    year: '',
    teacherCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const branches = ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'];
  const years = ['1st', '2nd', '3rd', '4th'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.branch || !formData.year) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.role === 'teacher' && formData.teacherCode !== 'TEACHER123') {
      toast.error('Invalid teacher code');
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    //   <div className="max-w-md w-full space-y-8">
    //     <div className="text-center">
    //       <div className="flex justify-center">
    //         <GraduationCap className="w-16 h-16 text-blue-600" />
    //       </div>
    //       <h2 className="mt-6 text-3xl font-bold text-gray-900">Create Account</h2>
    //       <p className="mt-2 text-sm text-gray-600">Join our educational platform</p>
    //     </div>

    //     <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
    //       <form className="space-y-6" onSubmit={handleSubmit}>
    //         <div>
    //           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
    //             Full Name
    //           </label>
    //           <div className="relative">
    //             <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //             <input
    //               id="name"
    //               name="name"
    //               type="text"
    //               required
    //               value={formData.name}
    //               onChange={handleChange}
    //               className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    //               placeholder="Enter your full name"
    //             />
    //           </div>
    //         </div>

    //         <div>
    //           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
    //             Email address
    //           </label>
    //           <div className="relative">
    //             <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //             <input
    //               id="email"
    //               name="email"
    //               type="email"
    //               autoComplete="email"
    //               required
    //               value={formData.email}
    //               onChange={handleChange}
    //               className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    //               placeholder="Enter your email"
    //             />
    //           </div>
    //         </div>

    //         <div>
    //           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
    //             Password
    //           </label>
    //           <div className="relative">
    //             <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //             <input
    //               id="password"
    //               name="password"
    //               type={showPassword ? 'text' : 'password'}
    //               autoComplete="new-password"
    //               required
    //               value={formData.password}
    //               onChange={handleChange}
    //               className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    //               placeholder="Enter your password"
    //             />
    //             <button
    //               type="button"
    //               onClick={() => setShowPassword(!showPassword)}
    //               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
    //             >
    //               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    //             </button>
    //           </div>
    //         </div>

    //         <div>
    //           <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
    //             Role
    //           </label>
    //           <select
    //             id="role"
    //             name="role"
    //             value={formData.role}
    //             onChange={handleChange}
    //             className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    //           >
    //             <option value="student">Student</option>
    //             <option value="teacher">Teacher</option>
    //           </select>
    //         </div>

    //         <div className="grid grid-cols-2 gap-4">
    //           <div>
    //             <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
    //               Branch
    //             </label>
    //             <div className="relative">
    //               <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //               <select
    //                 id="branch"
    //                 name="branch"
    //                 value={formData.branch}
    //                 onChange={handleChange}
    //                 className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    //               >
    //                 <option value="">Select Branch</option>
    //                 {branches.map(branch => (
    //                   <option key={branch} value={branch}>{branch}</option>
    //                 ))}
    //               </select>
    //             </div>
    //           </div>

    //           <div>
    //             <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
    //               Year
    //             </label>
    //             <div className="relative">
    //               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //               <select
    //                 id="year"
    //                 name="year"
    //                 value={formData.year}
    //                 onChange={handleChange}
    //                 className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    //               >
    //                 <option value="">Select Year</option>
    //                 {years.map(year => (
    //                   <option key={year} value={year}>{year}</option>
    //                 ))}
    //               </select>
    //             </div>
    //           </div>
    //         </div>

    //         {formData.role === 'teacher' && (
    //           <div>
    //             <label htmlFor="teacherCode" className="block text-sm font-medium text-gray-700 mb-2">
    //               Teacher Code
    //             </label>
    //             <input
    //               id="teacherCode"
    //               name="teacherCode"
    //               type="text"
    //               required
    //               value={formData.teacherCode}
    //               onChange={handleChange}
    //               className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    //               placeholder="Enter teacher code"
    //             />
    //           </div>
    //         )}

    //         <button
    //           type="submit"
    //           disabled={loading}
    //           className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
    //         >
    //           {loading ? 'Creating account...' : 'Create Account'}
    //         </button>

    //         <div className="text-center">
    //           <p className="text-sm text-gray-600">
    //             Already have an account?{' '}
    //             <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
    //               Sign in here
    //             </Link>
    //           </p>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
  <div className="max-w-md w-full space-y-8">
    {/* Header */}
    <div className="text-center">
      <div className="flex justify-center">
        <GraduationCap className="w-16 h-16 text-purple-400" />
      </div>
      <h2 className="mt-6 text-3xl font-bold text-white">Create Account</h2>
      <p className="mt-2 text-sm text-gray-300">Join our educational platform</p>
    </div>

    {/* Form Card */}
    <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10 w-full px-3 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {/* Branch and Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">
              Branch
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
              Year
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Teacher Code */}
        {formData.role === 'teacher' && (
          <div>
            <label htmlFor="teacherCode" className="block text-sm font-medium text-gray-300 mb-2">
              Teacher Code
            </label>
            <input
              id="teacherCode"
              name="teacherCode"
              type="text"
              required
              value={formData.teacherCode}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter teacher code"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">
              Sign Up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default Register;