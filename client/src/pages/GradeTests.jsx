import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import { Calendar, User, Star, Save, Eye, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const GradeTests = () => {
  const { userProfile } = useAuth();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testGrades, setTestGrades] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    if (userProfile?.role === 'teacher') {
      fetchTests();
    }
  }, [userProfile]);

  const fetchTests = async () => {
    try {
      const response = await api.get('/tests/teacher/grades');
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestGrades = async (testId) => {
    try {
      const response = await api.get(`/tests/${testId}/grades`);
      setTestGrades(response.data);
      
      // Initialize grades state
      const initialGrades = {};
      response.data.forEach(grade => {
        initialGrades[grade.studentId._id] = grade.score || '';
      });
      setGrades(initialGrades);
    } catch (error) {
      console.error('Error fetching test grades:', error);
      toast.error('Failed to fetch test grades');
    }
  };

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    fetchTestGrades(test._id);
  };

  const handleGradeChange = (studentId, grade) => {
    if (grade === '' || (grade >= 0 && grade <= 10)) {
      setGrades(prev => ({
        ...prev,
        [studentId]: grade
      }));
    }
  };

  const saveGrade = async (studentId) => {
    const grade = grades[studentId];
    if (grade === '' || grade < 0 || grade > 10) {
      toast.error('Grade must be between 0 and 10');
      return;
    }

    setSaving(studentId);
    try {
      await api.put(`/tests/${selectedTest._id}/grade`, { 
        studentId, 
        score: grade 
      });
      toast.success('Grade saved successfully!');
      fetchTestGrades(selectedTest._id);
    } catch (error) {
      toast.error('Failed to save grade');
    } finally {
      setSaving(null);
    }
  };

  if (userProfile?.role !== 'teacher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600 mt-2">Only teachers can access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Grade Tests</h1>
          <p className="text-gray-600 mt-2">Assign grades to students for their test performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tests List */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Tests</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tests.map((test) => (
                    <div
                      key={test._id}
                      onClick={() => handleTestSelect(test)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedTest?._id === test._id
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">{test.subject}</h3>
                      <p className="text-sm text-gray-600 mt-1">{test.branch} - {test.year}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {test.grades?.length || 0} grade(s)
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(test.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Students Grading */}
          <div className="lg:col-span-2">
            {selectedTest ? (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{selectedTest.subject}</h2>
                  <p className="text-gray-600">{selectedTest.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Date: {new Date(selectedTest.date).toLocaleDateString()}</span>
                    <span>{selectedTest.branch} - {selectedTest.year}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {testGrades.length > 0 ? (
                    testGrades.map((gradeEntry) => (
                      <div key={gradeEntry.studentId._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                              <h3 className="font-medium text-gray-900">{gradeEntry.studentId.name}</h3>
                              <p className="text-sm text-gray-600">{gradeEntry.studentId.email}</p>
                              <p className="text-xs text-gray-500">
                                {gradeEntry.studentId.branch} - {gradeEntry.studentId.year}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {gradeEntry.score !== undefined ? `${gradeEntry.score}/10` : 'Not graded'}
                            </span>
                          </div>
                        </div>

                        {/* Grading Section */}
                        <div className="flex items-center space-x-3 pt-3 border-t mt-3">
                          <label className="text-sm font-medium text-gray-700">Grade:</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={grades[gradeEntry.studentId._id] || ''}
                            onChange={(e) => handleGradeChange(gradeEntry.studentId._id, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0-10"
                          />
                          <span className="text-sm text-gray-500">/ 10</span>
                          <button
                            onClick={() => saveGrade(gradeEntry.studentId._id)}
                            disabled={saving === gradeEntry.studentId._id}
                            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
                          >
                            <Save className="w-3 h-3" />
                            <span>{saving === gradeEntry.studentId._id ? 'Saving...' : 'Save'}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No students to grade</h3>
                      <p className="text-gray-600">No students are enrolled for this test in the selected branch and year.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Test</h3>
                  <p className="text-gray-600">Choose a test from the left to grade students.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GradeTests;