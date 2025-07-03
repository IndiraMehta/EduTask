import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import { Calendar, Clock, BookOpen, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Tests = () => {
  const { userProfile } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await api.get('/tests');
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  const getTestStatus = (testDate) => {
    const now = new Date();
    const test = new Date(testDate);
    const diffTime = test - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Completed', color: 'bg-gray-100 text-gray-800' };
    if (diffDays === 0) return { text: 'Today', color: 'bg-red-100 text-red-800' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'bg-orange-100 text-orange-800' };
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'bg-yellow-100 text-yellow-800' };
    return { text: `${diffDays} days left`, color: 'bg-blue-100 text-blue-800' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tests</h1>
          <p className="text-gray-600 mt-2">
            {userProfile?.role === 'student' ? 'View your upcoming tests and exams' : 'Manage student tests and schedules'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading tests...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tests.length > 0 ? (
              tests.map((test) => {
                const status = getTestStatus(test.date);
                return (
                  <div key={test._id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <BookOpen className="w-6 h-6 text-purple-600" />
                          <h3 className="text-xl font-bold text-gray-900">{test.subject}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{test.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(test.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(test.date).toLocaleTimeString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{test.branch} - {test.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tests scheduled</h3>
                <p className="text-gray-600">No tests available for your branch and year.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tests;