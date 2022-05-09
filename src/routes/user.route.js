const express = require('express')

const userController = require('../controllers/user.controller')
const isAuth = require('../middlewares/isAuth')

const router = express.Router()

router.use(isAuth.checkLogIn)

router
  .route('/')
  .get(userController.getUserData)
  .put(userController.updateData) // Handle error in controller for specific update case

module.exports = router
