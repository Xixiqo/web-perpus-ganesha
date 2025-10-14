const express = require('express')
const router = express.Router()
const { login } = require('../controllers/authController')

router.post('/login', login)  // endpoint: POST /api/login

module.exports = router
