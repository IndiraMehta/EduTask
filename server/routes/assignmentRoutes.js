import express from 'express';
import { 
  getAssignments, 
  createAssignment, 
  submitAssignment, 
  downloadFile, 
  upload,
  getTeacherAssignmentsWithSubmissions,
  getAssignmentSubmissions,
  gradeSubmission,
  downloadSubmissionFile
} from '../controllers/assignmentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getAssignments);
router.get('/teacher/submissions', auth, getTeacherAssignmentsWithSubmissions);
router.get('/:id/submissions', auth, getAssignmentSubmissions);
router.post('/', auth, upload.array('attachments', 5), createAssignment);
router.post('/:id/submit', auth, upload.array('submissions', 5), submitAssignment);
router.put('/submissions/:submissionId/grade', auth, gradeSubmission);
router.get('/:id/download/:filename', auth, downloadFile);
router.get('/submissions/:submissionId/download/:filename', auth, downloadSubmissionFile);

export default router;