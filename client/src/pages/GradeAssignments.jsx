import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import { BookOpen, User, FileText, Download, Star, Save, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const GradeAssignments = () => {
  const { userProfile } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    if (userProfile?.role === 'teacher') {
      fetchAssignments();
    }
  }, [userProfile]);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments/teacher/submissions');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const response = await api.get(`/assignments/${assignmentId}/submissions`);
      setSubmissions(response.data);
      
      // Initialize grades state
      const initialGrades = {};
      response.data.forEach(submission => {
        initialGrades[submission._id] = submission.grade || '';
      });
      setGrades(initialGrades);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch submissions');
    }
  };

  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
    fetchSubmissions(assignment._id);
  };

  const handleGradeChange = (submissionId, grade) => {
    if (grade === '' || (grade >= 0 && grade <= 10)) {
      setGrades(prev => ({
        ...prev,
        [submissionId]: grade
      }));
    }
  };

  const saveGrade = async (submissionId) => {
    const grade = grades[submissionId];
    if (grade === '' || grade < 0 || grade > 10) {
      toast.error('Grade must be between 0 and 10');
      return;
    }

    setSaving(submissionId);
    try {
      await api.put(`/assignments/submissions/${submissionId}/grade`, { grade });
      toast.success('Grade saved successfully!');
      fetchSubmissions(selectedAssignment._id);
    } catch (error) {
      toast.error('Failed to save grade');
    } finally {
      setSaving(null);
    }
  };

  const downloadSubmissionFile = async (submissionId, filename) => {
    try {
      const response = await api.get(`/assignments/submissions/${submissionId}/download/${filename}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download file');
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
          <h1 className="text-3xl font-bold text-gray-900">Grade Assignments</h1>
          <p className="text-gray-600 mt-2">Review student submissions and assign grades</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignments List */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Assignments</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment._id}
                      onClick={() => handleAssignmentSelect(assignment)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedAssignment?._id === assignment._id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{assignment.branch} - {assignment.year}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {assignment.submissions.length} submission(s)
                        </span>
                        <span className="text-xs text-gray-500">
                          Due: {new Date(assignment.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submissions List */}
          <div className="lg:col-span-2">
            {selectedAssignment ? (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{selectedAssignment.title}</h2>
                  <p className="text-gray-600">{selectedAssignment.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Due: {new Date(selectedAssignment.deadline).toLocaleDateString()}</span>
                    <span>{selectedAssignment.branch} - {selectedAssignment.year}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {submissions.length > 0 ? (
                    submissions.map((submission) => (
                      <div key={submission._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                              <h3 className="font-medium text-gray-900">{submission.studentId.name}</h3>
                              <p className="text-sm text-gray-600">{submission.studentId.email}</p>
                              <p className="text-xs text-gray-500">
                                Submitted: {new Date(submission.submittedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {submission.grade !== undefined ? `${submission.grade}/10` : 'Not graded'}
                            </span>
                          </div>
                        </div>

                        {/* Submitted Files */}
                        {submission.files && submission.files.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted Files:</h4>
                            <div className="space-y-2">
                              {submission.files.map((filename, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="w-4 h-4 text-red-600" />
                                    <span className="text-sm text-gray-700">{filename}</span>
                                  </div>
                                  <button
                                    onClick={() => downloadSubmissionFile(submission._id, filename)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Grading Section */}
                        <div className="flex items-center space-x-3 pt-3 border-t">
                          <label className="text-sm font-medium text-gray-700">Grade:</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={grades[submission._id] || ''}
                            onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0-10"
                          />
                          <span className="text-sm text-gray-500">/ 10</span>
                          <button
                            onClick={() => saveGrade(submission._id)}
                            disabled={saving === submission._id}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                          >
                            <Save className="w-3 h-3" />
                            <span>{saving === submission._id ? 'Saving...' : 'Save'}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                      <p className="text-gray-600">Students haven't submitted their work for this assignment.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Assignment</h3>
                  <p className="text-gray-600">Choose an assignment from the left to view and grade submissions.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>

  );
};

export default GradeAssignments;