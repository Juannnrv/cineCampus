const { check } = require("express-validator");

exports.showValidator = () => {
  return [
    check("movie_id").isMongoId().withMessage("Movie ID is not valid"),
    check("theater_id").isMongoId().withMessage("Theater ID is not valid"),
    check("date").isISO8601().withMessage("Date is not valid"),
    check("available_seats")
      .isArray()
      .withMessage("Available seats must be an array"),
    check("available_seats.*.seat")
      .isString()
      .withMessage("Seat must be a string"),
    check("available_seats.*.availability")
      .isBoolean()
      .withMessage("Availability must be a boolean"),
    check("available_seats.*.seat_type")
      .isString()
      .withMessage("Seat type must be a string"),
    check("available_seats.*.price")
      .isNumeric()
      .withMessage("Price must be a number"),
  ];
};
