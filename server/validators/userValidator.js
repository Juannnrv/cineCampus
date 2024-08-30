const { check } = require('express-validator');

exports.userValidator = () => {
    return [
        check('name').not().isEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Email is required and must be valid'),
        check('password').not().isEmpty().withMessage('Password is required and must be a string'),
        check('role').isIn(['user', 'userVIP', 'admin']).withMessage('Role is required and must be either user, userVIP or admin'),
        check('phone').isMobilePhone().withMessage('Phone is required and must be valid'),
    ]
}