const express = require('express');
const { createUser, getUsersDetails, updateRole  } = require('../controllers/userController');
const { validate } = require ("../middleware/validationMiddleware");
const {userValidator} = require('../validators/userValidator');
const router = express.Router();

router.post('/v1', createUser, validate, userValidator());
router.get('/v1/:id', getUsersDetails);
router.put('/v1/:id', updateRole, validate, userValidator());

module.exports = router;
