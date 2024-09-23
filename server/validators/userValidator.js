const { check } = require("express-validator");

exports.userValidator = () => {
  return [
    check("name")
      .isString()
      .withMessage("Name must be a string.")
      .notEmpty()
      .withMessage("Name is required."),
    check("email")
      .isEmail()
      .withMessage("Invalid email format.")
      .notEmpty()
      .withMessage("Email is required."),
    check("phone")
      .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
      .withMessage("Phone number must be in the format XXX-XXX-XXXX."),
    check("card_id.$oid").isMongoId().withMessage("Invalid card ID format."),
    check("password")
      .isString()
      .withMessage("Password must be a string.")
      .notEmpty()
      .withMessage("Password is required."),
    check("role")
      .isIn(["user", "userVIP", "admin"])
      .withMessage("Role must be one of the following: user, userVIP, admin."),
  ];
};