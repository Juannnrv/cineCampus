const express = require('express');
const { loginUser } = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidator');
const { validate } = require('../middleware/validationMiddleware');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.post('/v1', loginValidator(), validate, cookieParser(), loginUser);

module.exports = router;