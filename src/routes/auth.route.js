const express = require('express')
const passport = require('passport')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const { authValidation } = require('../validations')
const validateReq = require('../middlewares/handleValidator')
const isAuth = require('../middlewares/isAuth')
const { initPassportLocal } = require('../configs/passport')


// Init all passport
initPassportLocal()

router
.route('/logout')
.get(isAuth.checkLogIn, authController.getLogout)

router
  .route('/sign-up')
  .get(isAuth.checkLogOut, authController.getRegisterView)
  .post(isAuth.checkLogOut, authValidation.register, validateReq, authController.postRegister)

router
  .route('/')
  .get(isAuth.checkLogOut, authController.getLoginView)
  .post(isAuth.checkLogOut, authValidation.login, validateReq, passport.authenticate('local', {
    successRedirect: '/posts/all',
    failureRedirect: '/auth',
    successFlash: true,
    failureFlash: true,
  }))

module.exports = router
