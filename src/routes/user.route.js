const express = require('express')
const userController = require('../controllers/user.controller')
const isAuth = require('../middlewares/isAuth')

const router = express.Router()

router.use(isAuth.checkLogIn)

router
  .route('/')
  .get(userController.getUsers)

module.exports = router
