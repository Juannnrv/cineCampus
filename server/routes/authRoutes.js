const express = require('express');
const { loginUser } = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidator');
const { validate } = require('../middleware/validationMiddleware');
const router = express.Router();

router.post('/v1', loginValidator(), validate, loginUser);

module.exports = router;