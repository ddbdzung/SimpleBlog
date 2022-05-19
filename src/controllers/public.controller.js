const httpStatus = require('http-status')
const { ApiError, catchAsync, pick } = require('../utils')
const { postService } = require('../services')

// [GET /]
const viewPosts = catchAsync(async (req, res) => {
  // Pagination
  const queryObj = pick(req.query, ['page'])
  let isNumber = new RegExp(/^\d+\.?\d*$/)
  let currentPage = (!queryObj['page'] 
                  || !isNumber.test(queryObj['page']) 
                  || parseInt(queryObj['page'], 10) < 1) 
    ? 1 
    : parseInt(queryObj['page'], 10)

  try {
    let data = await postService.paginatePostOfAllUsers(currentPage)
    let { pageQuantity, posts } = data
    let postArr = []
    posts.forEach(item => postArr.push(JSON.parse(JSON.stringify(item))))
    
    if (currentPage > pageQuantity &&  pageQuantity !== 0) {
      return res.status(400).render('pages/error', {
        title: 'Page not found',
        code: 404,
        error: 'Page not fount',
        description: `The page you’re looking for doesn’t exist.`,
      })
    }
    postArr.forEach(item => delete item.user.password)

    return res.render('pages/allPosts', {
      title: 'Blog',
      posts: postArr,
      pageQuantity,
      currentPage,
    })
  } catch (e) {
    console.log(e)
    res.status(500).send('INTERNAL SERVER ERROR')
  }
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