const express = require('express');
const { getSeatsAvailable  } = require('../controllers/showController');
const router = express.Router();

router.get('/seats/v1/:id', getSeatsAvailable);

module.exports = router;