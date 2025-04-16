const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addFavorite, getFavorites } = require('../controllers/favoriteController');

router.post('/', auth, addFavorite);
router.get('/', auth, getFavorites);

module.exports = router;
