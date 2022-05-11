const httpStatus = require('http-status')

const { canViewAndEditUserPost } = require('../configs/permission')
const { postService } = require('../services')
const { ApiError } = require('../utils')

const authGetProject = async (req, res, next) => {
  const post = await postService.getPostByPostSlug(req.params.postSlug)
  if (!post) {
    next(new ApiError(httpStatus[404], 'No post found'))
  }
  const user = req.user

  if (!canViewAndEditUserPost(user, post)) {
    next(new ApiError(httpStatus[401], 'Not allowed'))
  }

  res.locals.post = post
  next()
}

module.exports = {
  authGetProject,
}

