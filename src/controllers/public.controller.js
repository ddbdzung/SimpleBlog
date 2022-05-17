const httpStatus = require('http-status')
const { ApiError, catchAsync, pick } = require('../utils')
const { postService } = require('../services')

// [GET /]
const viewPosts = catchAsync(async (req, res) => {
  // Pagination
  const queryObj = pick(req.query, ['page'])
  let isNumber = new RegExp(/^\d+\.?\d*$/)
  let currentPage = (!queryObj['page'] || !isNumber.test(queryObj['page'])) 
    ? 1 
    : parseInt(queryObj['page'], 10)

  currentPage = (currentPage < 1)
    ? 1
    : currentPage
    
  postService.paginatePostOfAllUsers(currentPage)
    .then(result => {
      if (currentPage > result['pageQuantity'] || currentPage < 1) 
        return res.status(400).render('pages/error', {
          title: 'Page not found',
          code: 404,
          error: 'Page not fount',
          description: `The page you’re looking for doesn’t exist.`,
        })

      // postService.getAllPosts(3).then((result) => res.send(result))
      return res.render('pages/allPosts_auth', {
        title: 'Blog',
        posts: result['posts'],
        pageQuantity: result['pageQuantity'],
        currentPage,
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send('INTERNAL SERVER ERROR')
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