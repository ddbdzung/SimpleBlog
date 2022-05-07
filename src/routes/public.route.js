const express = require('express')
const router = express.Router()

const publicController = require('../controllers/public.controller')
const isAuth = require('../middlewares/isAuth')

router
  .route('/')
  .get(isAuth.checkLogOut, publicController.viewPosts)

router
  .route('/post=:postSlug')
  .get(isAuth.checkLogOut, publicController.viewSinglePost)

module.exports = router
