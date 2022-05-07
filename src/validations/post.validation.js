const { check } = require('express-validator')

let createPost = [
  check('subject')
    .notEmpty()
    .withMessage('Subject required')
    .isLength({ max: 100 })
    .withMessage('Subject must be less then 100 words')
    .trim(),
  check('description', 'Description must be less then 50 words')
    .isLength({ max: 50 })
    .trim(),
  check('markdown', 'Content must be more then 25 words')
    .isLength({ min: 25 })
    .trim(),
]

module.exports = {
  createPost,
}
