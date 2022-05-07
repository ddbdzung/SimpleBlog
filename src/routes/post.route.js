const express = require('express')
const router = express.Router()

const isAuth = require('../middlewares/isAuth')
const validateReq = require('../middlewares/handleValidator')
const { authGetProject } = require('../middlewares/authorization')
const { postValidation } = require('../validations')
const postController = require('../controllers/post.controller')

router.use(isAuth.checkLogIn)

router
.route('/')
.get(postController.viewOwnPosts)

router
  .route('/all')
  .get(postController.viewAllPosts)
  
router
  .route('/create')
  .get(postController.viewCreatePost)
  .post(postValidation.createPost, validateReq ,postController.createPost)

router
  .route('/update/:postSlug')
  .get(authGetProject, postController.viewUpdatePost)
  .put(authGetProject, postController.updatePost)
  
router
  .route('/:postSlug')
  .get(postController.viewSinglePost)

module.exports = router
