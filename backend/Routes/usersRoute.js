const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const userModel = require('../Models/userModel');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.profile);
router.post('/logout', userController.logout);

module.exports = router;