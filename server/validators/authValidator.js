const { check } = require('express-validator');

exports.loginValidator = () => {
    return [
        check('name').isString().withMessage('Name must be a string'),
        check('password').isString().withMessage('Password must be a string')
    ]
}

