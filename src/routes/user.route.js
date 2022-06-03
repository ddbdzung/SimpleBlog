const express = require('express')

const userController = require('../controllers/user.controller')
const isAuth = require('../middlewares/isAuth')
const { userValidation } = require('../validations')
const validateReq = require('../middlewares/handleValidator')

const router = express.Router()

router.use(isAuth.checkLogIn)

router
  .route('/')
  .get(userController.getUserData)
  .patch(userValidation.updateUser, validateReq, userController.updateData)

module.exports = router
