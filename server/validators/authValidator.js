const { check } = require('express-validator');

exports.loginValidator = () => {
    return [
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isString().withMessage('Password must be a string')
    ]
}

