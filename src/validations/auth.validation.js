const httpStatus = require('http-status')

const { check } = require('express-validator')
const { ApiError } = require('../utils')

let login = [
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .trim(),
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .trim()
]

let register = [
  check('fullname')
    .notEmpty()
    .withMessage('Fullname required')
    .trim(),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .bail()
    .isEmail()
    .withMessage('Invalid email')
    .trim(),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Passowrd must be at least 8 characters')
    .trim(),
  check('conf_password')
    .notEmpty()
    .withMessage('Confirm password required')
    .bail()
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new ApiError(httpStatus[400], 'Password confirmation is incorrect')
      } else {
        return true
      }
    })
]

module.exports = {
  login,
  register,
}
