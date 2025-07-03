import express from 'express';
import { saveUserProfile, getUserProfile } from '../controllers/userController.js';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js';

const router = express.Router();

router.post('/save-profile', verifyFirebaseToken, saveUserProfile);
router.get('/profile', verifyFirebaseToken, getUserProfile);

export default router;