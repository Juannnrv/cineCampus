const express = require("express");
const { purchaseTicket } = require("../controllers/movementController");
const { validate } = require ("../middleware/validationMiddleware");
const { movementValidator } = require("../validators/movementValidator");
const router = express.Router();

router.post('/purchase/v1', purchaseTicket, validate, movementValidator());

module.exports = router;