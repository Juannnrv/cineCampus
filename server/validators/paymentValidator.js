const { check } = require('express-validator');

exports.paymentValidator = () => {
    return [
        check("movement_id").isMongoId().withMessage("Movement ID is not valid"),
        check("payment_method").isIn(['credit card', 'cash']).withMessage("Payment method must be either 'credit card' or 'cash'"),
        check("paid").isBoolean().withMessage("Paid must be a boolean"),
        check("card_id").isMongoId().withMessage("Card ID is not valid"),
    ]
}