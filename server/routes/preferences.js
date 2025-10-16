const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getPreferences, savePreferences } = require('../controllers/preferencesController');

// Protect all preferences routes with authentication
router.use(authenticateToken);

// Get user preferences
router.get('/preferences', getPreferences);

// Save user preferences
router.post('/preferences', savePreferences);

module.exports = router;