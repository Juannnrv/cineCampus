const express = require("express");
const { purchaseTicket, bookTicket, cancelTicket } = require("../controllers/movementController");
const { validate } = require ("../middleware/validationMiddleware");
const { movementValidator } = require("../validators/movementValidator");
const router = express.Router();

router.post('/purchase/v1', purchaseTicket, validate, movementValidator());
router.post('/book/v1', bookTicket, validate, movementValidator());
router.post('/cancel/v1/:movement_id', cancelTicket);

module.exports = router;