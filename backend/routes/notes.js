const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addNote, getNotes } = require('../controllers/noteController');

router.post('/', auth, addNote);
router.get('/', auth, getNotes);

module.exports = router;
