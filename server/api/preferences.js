import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getPreferences, savePreferences } from '../controllers/preferencesController.js';

const router = express.Router();

// Protect all preferences routes with authentication
router.use(authenticateToken);

// Get user preferences
router.get('/', getPreferences);

// Save user preferences
router.post('/', savePreferences);

export default router;