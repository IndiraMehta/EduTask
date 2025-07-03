import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import { BookOpen, Calendar, Clock, FileText, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    assignments: 0,
    tests: 0,
    submissions: 0,
    pending: 0
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [upcomingTests, setUpcomingTests] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [assignmentsRes, testsRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/tests')
      ]);

      setRecentAssignments(assignmentsRes.data.slice(0, 3));
      setUpcomingTests(testsRes.data.slice(0, 3));
      
      setStats({
        assignments: assignmentsRes.data.length,
        tests: testsRes.data.length,
        submissions: userProfile?.role === 'student' ? assignmentsRes.data.filter(a => a.submitted).length : 0,
        pending: userProfile?.role === 'student' ? assignmentsRes.data.filter(a => !a.submitted).length : 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-gray/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
  //   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
  //     <Header />
      
  //     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //       <div className="mb-8">
  //         <h1 className="text-3xl font-bold text-gray-900">
  //           Welcome back, {userProfile?.name}!
  //         </h1>
  //         <p className="text-gray-600 mt-2">
  //           {userProfile?.role === 'teacher' ? 'Manage your classes and assignments' : 'Track your progress and assignments'}
  //         </p>
  //         <div className="flex items-center space-x-2 mt-2">
  //           <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
  //             {userProfile?.branch}
  //           </span>
  //           <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
  //             {userProfile?.year} Year
  //           </span>
  //         </div>
  //       </div>

  //       {/* Stats Grid */}
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  //         <StatCard
  //           icon={BookOpen}
  //           title="Total Assignments"
  //           value={stats.assignments}
  //           color="bg-gradient-to-r from-blue-500 to-blue-600"
  //         />
  //         <StatCard
  //           icon={Calendar}
  //           title="Upcoming Tests"
  //           value={stats.tests}
  //           color="bg-gradient-to-r from-purple-500 to-purple-600"
  //         />
  //         {userProfile?.role === 'student' && (
  //           <>
  //             <StatCard
  //               icon={FileText}
  //               title="Submissions"
  //               value={stats.submissions}
  //               color="bg-gradient-to-r from-green-500 to-green-600"
  //             />
  //             <StatCard
  //               icon={Clock}
  //               title="Pending"
  //               value={stats.pending}
  //               color="bg-gradient-to-r from-orange-500 to-orange-600"
  //             />
  //           </>
  //         )}
  //         {userProfile?.role === 'teacher' && (
  //           <>
  //             <StatCard
  //               icon={Users}
  //               title="Students"
  //               value="42"
  //               color="bg-gradient-to-r from-green-500 to-green-600"
  //             />
  //             <StatCard
  //               icon={TrendingUp}
  //               title="Avg Score"
  //               value="85%"
  //               color="bg-gradient-to-r from-orange-500 to-orange-600"
  //             />
  //           </>
  //         )}
  //       </div>

  //       {/* Content Grid */}
  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  //         {/* Recent Assignments */}
  //         <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
  //           <div className="flex items-center justify-between mb-6">
  //             <h2 className="text-xl font-bold text-gray-900">Recent Assignments</h2>
  //             <BookOpen className="w-5 h-5 text-blue-600" />
  //           </div>
            
  //           <div className="space-y-4">
  //             {recentAssignments.length > 0 ? (
  //               recentAssignments.map((assignment, index) => (
  //                 <div key={index} className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
  //                   <h3 className="font-medium text-gray-900">{assignment.title}</h3>
  //                   <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
  //                   <div className="flex items-center justify-between mt-3">
  //                     <span className="text-xs text-gray-500">
  //                       Due: {new Date(assignment.deadline).toLocaleDateString()}
  //                     </span>
  //                     <span className={`px-2 py-1 text-xs rounded-full ${
  //                       assignment.submitted 
  //                         ? 'bg-green-100 text-green-800' 
  //                         : 'bg-orange-100 text-orange-800'
  //                     }`}>
  //                       {assignment.submitted ? 'Submitted' : 'Pending'}
  //                     </span>
  //                   </div>
  //                 </div>
  //               ))
  //             ) : (
  //               <p className="text-gray-500 text-center py-8">No recent assignments</p>
  //             )}
  //           </div>
  //         </div>

  //         {/* Upcoming Tests */}
  //         <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
  //           <div className="flex items-center justify-between mb-6">
  //             <h2 className="text-xl font-bold text-gray-900">Upcoming Tests</h2>
  //             <Calendar className="w-5 h-5 text-purple-600" />
  //           </div>
            
  //           <div className="space-y-4">
  //             {upcomingTests.length > 0 ? (
  //               upcomingTests.map((test, index) => (
  //                 <div key={index} className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
  //                   <h3 className="font-medium text-gray-900">{test.subject}</h3>
  //                   <p className="text-sm text-gray-600 mt-1">{test.description}</p>
  //                   <div className="flex items-center justify-between mt-3">
  //                     <span className="text-xs text-gray-500">
  //                       Date: {new Date(test.date).toLocaleDateString()}
  //                     </span>
  //                     <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
  //                       {test.branch} - {test.year}
  //                     </span>
  //                   </div>
  //                 </div>
  //               ))
  //             ) : (
  //               <p className="text-gray-500 text-center py-8">No upcoming tests</p>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //   </div>

    <div className="min-h-screen bg-black">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {userProfile?.name}!
          </h1>
          <p className="text-gray-400 text-lg">
            {userProfile?.role === 'teacher' ? 'Manage your classes and assignments' : 'Track your progress and assignments'}
          </p>
          <div className="flex items-center space-x-3 mt-4">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
              {userProfile?.branch}
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
              {userProfile?.year} Year
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Total Assignments"
            value={stats.assignments}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Calendar}
            title="Upcoming Tests"
            value={stats.tests}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          {userProfile?.role === 'student' && (
            <>
              <StatCard
                icon={FileText}
                title="Submissions"
                value={stats.submissions}
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
              <StatCard
                icon={Clock}
                title="Pending"
                value={stats.pending}
                color="bg-gradient-to-r from-orange-500 to-orange-600"
              />
            </>
          )}
          {userProfile?.role === 'teacher' && (
            <>
              <StatCard
                icon={Users}
                title="Students"
                value="42"
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
              <StatCard
                icon={TrendingUp}
                title="Avg Score"
                value="85%"
                color="bg-gradient-to-r from-orange-500 to-orange-600"
              />
            </>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Assignments */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Assignments</h2>
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              {recentAssignments.length > 0 ? (
                recentAssignments.map((assignment, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:translateY-[-2px]">
                    <h3 className="font-semibold text-white text-lg">{assignment.title}</h3>
                    <p className="text-gray-400 mt-2">{assignment.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        Due: {new Date(assignment.deadline).toLocaleDateString()}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        assignment.submitted 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}>
                        {assignment.submitted ? 'Submitted' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent assignments</p>
              )}
            </div>
          </div>

          {/* Upcoming Tests */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Upcoming Tests</h2>
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              {upcomingTests.length > 0 ? (
                upcomingTests.map((test, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:translateY-[-2px]">
                    <h3 className="font-semibold text-white text-lg">{test.subject}</h3>
                    <p className="text-gray-400 mt-2">{test.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        Date: {new Date(test.date).toLocaleDateString()}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-medium border border-purple-500/30">
                        {test.branch} - {test.year}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming tests</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;