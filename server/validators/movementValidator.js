const { check } = require('express-validator');

exports.movementValidator = () => {
    return [
        check("user_id").isMongoId().withMessage("User ID is not valid"),
        check("show_id").isMongoId().withMessage("Show ID is not valid"),
        check("date_movement").isISO8601().withMessage("Date is not valid"),
        check("status").isIn(['on Hold', 'purchased', 'rejected', 'booked', 'cancelled, ']).withMessage("Status must be either 'on Hold', 'purchased', 'rejected', 'booked', or 'cancelled'"),
        check("seats").isArray().withMessage("Seats must be an array"),
        check('seats.*').isString().withMessage("Seat must be a string"),
        check('description').isString().isEmpty().withMessage("Description must be a string"),
    ]
}