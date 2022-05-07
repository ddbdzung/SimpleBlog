const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')
const { postService } = require('../services')

// [GET /]
const viewPosts = catchAsync(async (req, res) => {
  const posts = await postService.getAllPosts()

  res.render('pages/allPosts', {
    title: 'Blog',
    errors: req.flash('errors'),
    successes: req.flash('successes'),
    posts: posts,
  })
})

// [GET /:postSlug]
const viewSinglePost = catchAsync(async (req, res) => {
  const post = await postService.getPostByPostSlug(req.params.postSlug)

  res.render('pages/singlePostForWander', {
    title: 'Blog',
    errors: req.flash('errors'),
    successes: req.flash('successes'),
    post: post,
  })
})

module.exports = {
  viewPosts,
  viewSinglePost,
}