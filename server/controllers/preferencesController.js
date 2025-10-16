import db from '../config/db.js';

const getPreferences = async (req, res) => {
  console.log('Get preferences request:', req.user);

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'User tidak terautentikasi'
    });
  }

  const userId = req.user.id;

  try {
    const [user] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const [preferences] = await db.query(
      'SELECT preferences FROM user_preferences WHERE user_id = ?',
      [userId]
    );

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
    return res.json({ success: true, preferences: parsedPreferences });
  } catch (error) {
    console.error('Error getting preferences:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil preferensi'
    });
  }
};

const savePreferences = async (req, res) => {
  const userId = req.user.id;
  const { preferences } = req.body;

  if (!preferences) {
    return res.status(400).json({
      success: false,
      message: 'Data preferensi tidak lengkap'
    });
  }

  const requiredFields = [
    'dyslexiaMode', 'fontSize', 'lineSpacing', 'fontFamily', 'language', 'showLeaderboard'
  ];
  const missingFields = requiredFields.filter(f => preferences[f] === undefined);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Data preferensi tidak lengkap. Missing: ${missingFields.join(', ')}`
    });
  }

  try {
    const preferencesJson = JSON.stringify(preferences);
    const [existing] = await db.query(
      'SELECT id FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE user_preferences SET preferences = ?, updated_at = NOW() WHERE user_id = ?',
        [preferencesJson, userId]
      );
    } else {
      await db.query(
        'INSERT INTO user_preferences (user_id, preferences, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
        [userId, preferencesJson]
      );
    }

    return res.json({
      success: true,
      message: 'Preferensi berhasil disimpan',
      preferences
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
