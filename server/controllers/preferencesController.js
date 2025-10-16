import db from '../config/db.js';

const getPreferences = async (req, res) => {
  console.log('Get preferences request:', req.user);
  
  if (!req.user || !req.user.id) {
    console.error('No user ID found in request');
    return res.status(401).json({
      success: false,
      message: 'User tidak terautentikasi'
    });
  }
  
  const userId = req.user.id;
  console.log('Fetching preferences for user:', userId);

  try {
    // First check if user exists
    const [user] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      console.log('User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    console.log('Querying preferences for user:', userId);
    const [preferences] = await db.query(
      'SELECT preferences FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    console.log('Found preferences:', preferences);

    if (preferences.length === 0) {
      return res.json({
        success: true,
        preferences: {
          dyslexiaMode: false,
          fontSize: 16,
          lineSpacing: 1.5,
          fontFamily: 'Arial',
          language: 'id',
          showLeaderboard: true
        }
      });
    }

    const parsedPreferences = JSON.parse(preferences[0].preferences);
    console.log('Parsed preferences:', parsedPreferences);

    return res.json({
      success: true,
      preferences: parsedPreferences
    });
  } catch (error) {
    console.error('Error getting preferences:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil preferensi'
    });
  }
};

const savePreferences = async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { preferences } = req.body;
  
  console.log('Saving preferences for user:', userId);
  console.log('Received preferences:', preferences);

  if (!preferences) {
    console.log('No preferences provided in request body');
    return res.status(400).json({
      success: false,
      message: 'Data preferensi tidak lengkap'
    });
  }

  // Validate preferences structure
  const requiredFields = ['dyslexiaMode', 'fontSize', 'lineSpacing', 'fontFamily', 'language', 'showLeaderboard'];
  const missingFields = requiredFields.filter(field => preferences[field] === undefined);

  if (missingFields.length > 0) {
    console.log('Missing required fields:', missingFields);
    return res.status(400).json({
      success: false,
      message: `Data preferensi tidak lengkap. Missing: ${missingFields.join(', ')}`
    });
  }

  try {
    // Convert preferences object to JSON string for storage
    const preferencesJson = JSON.stringify(preferences);
    
    // Check if preferences already exist for this user
    const [existing] = await db.query(
      'SELECT id FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      // Update existing preferences
      await db.query(
        'UPDATE user_preferences SET preferences = ? WHERE user_id = ?',
        [preferencesJson, userId]
      );
    } else {
      // Insert new preferences
      await db.query(
        'INSERT INTO user_preferences (user_id, preferences) VALUES (?, ?)',
        [userId, preferencesJson]
      );
    }

    return res.json({
      success: true,
      message: 'Preferensi berhasil disimpan',
      preferences
    });
    // Check if user already has preferences
    const [existing] = await db.query(
      'SELECT id FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      // Update existing preferences
      await db.query(
        'UPDATE user_preferences SET preferences = ?, updated_at = NOW() WHERE user_id = ?',
        [preferencesJson, userId]
      );
    } else {
      // Insert new preferences
      await db.query(
        'INSERT INTO user_preferences (user_id, preferences, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
        [userId, preferencesJson]
      );
    }

    return res.json({
      success: true,
      message: 'Preferensi berhasil disimpan'
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menyimpan preferensi'
    });
  }
};

export { getPreferences, savePreferences };