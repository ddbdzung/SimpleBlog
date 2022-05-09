const { check } = require('express-validator')

let updateUser = [
  check('fullname')
    .notEmpty()
    .withMessage('Full name required!')
    .trim(),
  check('address')
    .trim(),
  check('phone', 'Phone number can not be over 11 characters')
    .isLength({ max: 25 })
    .trim(),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .bail()
    .isEmail()
    .withMessage('Invalid email')
    .trim(),
]

module.exports = {
  updateUser,
}
