import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import { BookOpen, Calendar, Clock, FileText, Upload, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Assignments = () => {
  const { userProfile } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [submissionFiles, setSubmissionFiles] = useState({});
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (assignmentId, files) => {
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      toast.error('Only PDF files are allowed');
      return;
    }

    const newFiles = pdfFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    }));

    setSubmissionFiles(prev => ({
      ...prev,
      [assignmentId]: [...(prev[assignmentId] || []), ...newFiles]
    }));
  };

  const removeSubmissionFile = (assignmentId, fileId) => {
    setSubmissionFiles(prev => ({
      ...prev,
      [assignmentId]: prev[assignmentId]?.filter(file => file.id !== fileId) || []
    }));
  };

  const handleSubmit = async (assignmentId) => {
    const files = submissionFiles[assignmentId];
    if (!files || files.length === 0) {
      toast.error('Please upload at least one PDF file');
      return;
    }

    setSubmitting(assignmentId);
    try {
      const formData = new FormData();
      files.forEach((fileObj) => {
        formData.append('submissions', fileObj.file);
      });

      await api.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Assignment submitted successfully!');
      setSubmissionFiles(prev => ({ ...prev, [assignmentId]: [] }));
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to submit assignment');
    } finally {
      setSubmitting(null);
    }
  };

  const downloadAttachment = async (assignmentId, filename) => {
    try {
      const response = await api.get(`/assignments/${assignmentId}/download/${filename}`, {
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

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !assignment.submitted;
    if (filter === 'submitted') return assignment.submitted;
    return true;
  });

  const getStatusColor = (assignment) => {
    if (assignment.submitted) return 'bg-green-100 text-green-800';
    const deadline = new Date(assignment.deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'bg-red-100 text-red-800';
    if (daysLeft <= 2) return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (assignment) => {
    if (assignment.submitted) return 'Submitted';
    const deadline = new Date(assignment.deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'Overdue';
    if (daysLeft === 0) return 'Due Today';
    if (daysLeft === 1) return 'Due Tomorrow';
    return `${daysLeft} days left`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
     {/* <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"> */}
 <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600 mt-2">
              {userProfile?.role === 'student' ? 'Track and submit your assignments' : 'Manage student assignments'}
            </p>
          </div>
          
          {userProfile?.role === 'student' && (
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'pending' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('submitted')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'submitted' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Submitted
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading assignments...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <div key={assignment._id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment)}`}>
                          {getStatusText(assignment)}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{assignment.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(assignment.deadline).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{assignment.branch} - {assignment.year}</span>
                        </div>
                      </div>

                      {/* Assignment Attachments */}
                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Assignment Files:</h4>
                          <div className="space-y-2">
                            {assignment.attachments.map((filename, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-red-600" />
                                  <span className="text-sm text-gray-700">{filename}</span>
                                </div>
                                <button
                                  onClick={() => downloadAttachment(assignment._id, filename)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Student Submission Section */}
                  {userProfile?.role === 'student' && !assignment.submitted && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Submit Your Work:</h4>
                      
                      {/* File Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors mb-4">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload PDF files</p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf"
                          onChange={(e) => handleFileUpload(assignment._id, e.target.files)}
                          className="hidden"
                          id={`file-upload-${assignment._id}`}
                        />
                        <label
                          htmlFor={`file-upload-${assignment._id}`}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Files
                        </label>
                      </div>

                      {/* Uploaded Files for Submission */}
                      {submissionFiles[assignment._id] && submissionFiles[assignment._id].length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Files to Submit:</h5>
                          <div className="space-y-2">
                            {submissionFiles[assignment._id].map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-red-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">{file.size}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeSubmissionFile(assignment._id, file.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleSubmit(assignment._id)}
                        disabled={submitting === assignment._id || !submissionFiles[assignment._id]?.length}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{submitting === assignment._id ? 'Submitting...' : 'Submit Assignment'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'No assignments available for your branch and year.' 
                    : `No ${filter} assignments found.`}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>

  


  );
};

export default Assignments;