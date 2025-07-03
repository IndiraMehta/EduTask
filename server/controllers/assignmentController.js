import Assignment from '../models/Assignment.js';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/assignments';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export const getAssignments = async (req, res) => {
  try {
    const user = req.user;
    let assignments;

    if (user.role === 'teacher') {
      assignments = await Assignment.find({ createdBy: user._id });
    } else {
      assignments = await Assignment.find({
        branch: user.branch,
        year: user.year
      });
      
      // Add submission status for students
      assignments = assignments.map(assignment => ({
        ...assignment.toObject(),
        submitted: assignment.submissions.some(sub => sub.studentId.toString() === user._id.toString())
      }));
    }

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

export const getTeacherAssignmentsWithSubmissions = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can access this' });
    }

    const assignments = await Assignment.find({ createdBy: user._id })
      .populate('submissions.studentId', 'name email')
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can access submissions' });
    }

    const assignment = await Assignment.findById(id)
      .populate('submissions.studentId', 'name email branch year');

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (assignment.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view these submissions' });
    }

    res.json(assignment.submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade } = req.body;
    const user = req.user;

    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can grade submissions' });
    }

    if (grade < 0 || grade > 10) {
      return res.status(400).json({ error: 'Grade must be between 0 and 10' });
    }

    const assignment = await Assignment.findOne({
      'submissions._id': submissionId,
      createdBy: user._id
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const submission = assignment.submissions.id(submissionId);
    submission.grade = grade;

    await assignment.save();
    res.json({ message: 'Grade saved successfully' });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ error: 'Failed to save grade' });
  }
};

export const downloadSubmissionFile = async (req, res) => {
  try {
    const { submissionId, filename } = req.params;
    const user = req.user;

    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can download submission files' });
    }

    const assignment = await Assignment.findOne({
      'submissions._id': submissionId,
      createdBy: user._id
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const filePath = path.join('uploads/assignments', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, filename);
  } catch (error) {
    console.error('Error downloading submission file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can create assignments' });
    }

    const attachments = req.files ? req.files.map(file => file.filename) : [];

    const assignment = new Assignment({
      ...req.body,
      createdBy: user._id,
      attachments
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if already submitted
    const existingSubmissionIndex = assignment.submissions.findIndex(
      sub => sub.studentId.toString() === req.user._id.toString()
    );

    const submissionFiles = req.files ? req.files.map(file => file.filename) : [];

    if (existingSubmissionIndex !== -1) {
      // Update existing submission
      assignment.submissions[existingSubmissionIndex] = {
        studentId: req.user._id,
        submittedAt: new Date(),
        files: submissionFiles
      };
    } else {
      // Create new submission
      assignment.submissions.push({
        studentId: req.user._id,
        submittedAt: new Date(),
        files: submissionFiles
      });
    }

    await assignment.save();
    res.json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const assignment = await Assignment.findById(id);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const filePath = path.join('uploads/assignments', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, filename);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};