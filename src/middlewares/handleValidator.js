const { validationResult } = require('express-validator')

const { handleValidator } = require('../utils')

const handleValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: handleValidator(errors) })
    // next(errors)
  }
  
  next()
}

module.exports = handleValidation
