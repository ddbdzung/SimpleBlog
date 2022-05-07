const { postService } = require('../services')
const { catchAsync, pick } = require('../utils')

// [GET /posts]
const viewOwnPosts = catchAsync(async (req, res) => {
  if (!req.user[0]._id) {
    return res.status(500).json({
      msg: 'Fail to authenticate! Log in again please!',
    })
  }
  const posts = await postService.getPostsByUserId(req.user[0]._id)
  return res.render('pages/ownPosts_auth', {
    title: 'Blog',
    posts: posts,
  })

})

const viewAllPosts = catchAsync(async (req, res) => {
  const posts = await postService.getAllPosts()

  res.render('pages/allPosts_auth', {
    title: 'Blog',
    errors: req.flash('errors'),
    successes: req.flash('successes'),
    posts: posts,
  })
})

const viewSinglePost = catchAsync(async (req, res) => {
  const post = await postService.getPostByPostSlug(req.params.postSlug)

  res.render('pages/singlePost', {
    title: 'Blog',
    post: post,
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
  postBody.user = req.user[0]._id
  try {
    const post = await postService.createPost(postBody)

    return res.redirect(`/posts/${post.slug}`)
  } catch (err) {
    return res.status(500).json({
      msg: 'Internal server error',
    })
  }
})

// // [GET /posts/test]
// const test = catchAsync(async (req, res) => {
//   return res.render('pages/test')
// })

// // [POST /post.test]
// const postTest = catchAsync(async (req, res) => {
//   return res.send(req.body)
// })

module.exports = {
  viewOwnPosts,
  viewAllPosts,
  viewSinglePost,
  createPost,
  viewCreatePost,
  viewUpdatePost,
  updatePost,

  // postTest,
  // test,
}
