const { postService } = require('../services')
const { catchAsync, pick } = require('../utils')

// [GET /posts]
const viewOwnPosts = catchAsync(async (req, res) => {
  // Convert user ID from objectID to string
  let userId = req.user._id
  userId = userId.toString()
  if (!userId) {
    return res.status(500).json({
      msg: 'Fail to authenticate! Log in again please!',
    })
  }

  // Pagination
  const queryObj = pick(req.query, ['page'])
  let isNumber = new RegExp(/^\d+\.?\d*$/)
  let currentPage = (!queryObj['page'] || !isNumber.test(queryObj['page'])) 
    ? 1 
    : parseInt(queryObj['page'], 10)

  currentPage = (currentPage < 1)
    ? 1
    : currentPage

  postService.paginatePostOfOneUser(userId, currentPage)
    .then(result => {
      if (currentPage > result['pageQuantity']) 
        return res.status(400).render('pages/error', {
          title: 'Page not found',
          code: 404,
          error: 'Page not fount',
          description: `The page you’re looking for doesn’t exist.`,
        })
      return res.render('pages/ownPosts_auth', {
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

const viewAllPosts = catchAsync(async (req, res) => {
  // Pagination
  const queryObj = pick(req.query, ['page'])
  let isNumber = new RegExp(/^\d+\.?\d*$/)
  let currentPage = (!queryObj['page'] || !isNumber.test(queryObj['page'])) ? 1 : queryObj['page']
  currentPage = parseInt(currentPage, 10)
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

const viewSinglePost = catchAsync(async (req, res) => {
  const post = await postService.getPostByPostSlug(req.params.postSlug)
  res.render('pages/singlePost', {
    title: 'Blog',
    post,
  })
})

const viewUpdatePost = catchAsync(async (req, res) => {
  return res.render('pages/postModal', {
    title: 'Blog',
    post: res.locals.post,
  })
})

const updatePost = catchAsync(async (req, res) => {
  const postObj = pick(req.body, ['subject', 'description', 'markdown'])
  
  const updatedPost = await postService.updatePostBySlug(req.params.postSlug, postObj)
  return res.render('pages/singlePost', {
    title: 'blog',
    post: updatedPost,
  })
})

const viewCreatePost = catchAsync(async (req, res) => {
  res.render('pages/create_post_page', {
    title: 'Create new post'
  })
})

const createPost = catchAsync(async (req, res) => {
  const postBody = pick(req.body, ['subject', 'description', 'markdown'])
  postBody.user = req.user._id
  try {
    const post = await postService.createPost(postBody)

    return res.redirect(`/posts/${post.slug}`)
  } catch (err) {
    return res.status(500).json({
      msg: 'Internal server error',
    })
  }
})


module.exports = {
  viewOwnPosts,
  viewAllPosts,
  viewSinglePost,
  createPost,
  viewCreatePost,
  viewUpdatePost,
  updatePost,
}
