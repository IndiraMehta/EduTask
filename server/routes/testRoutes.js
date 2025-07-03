import express from 'express';
import { 
  getTests, 
  createTest,
  getTeacherTestsWithGrades,
  getTestGrades,
  gradeTest
} from '../controllers/testController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getTests);
router.get('/teacher/grades', auth, getTeacherTestsWithGrades);
router.get('/:id/grades', auth, getTestGrades);
router.post('/', auth, createTest);
router.put('/:id/grade', auth, gradeTest);

export default router;