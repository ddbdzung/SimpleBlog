const httpStatus = require('http-status')
const slugify = require('slugify')
const { marked } = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const { Post } = require('../models');
const ApiError = require('../utils/ApiError');
const { PAGINATION } = require('../configs/constants')

/**
 * Get all post of a user by userId
 * @param {string} postSlug - Slug of post
 * @returns {Promise<QueryResult>}
 */
const getPostByPostSlug =  async (postSlug) => {
  const post = await Post.findOne({ slug: postSlug })
  
  return post
}

/**
 * Create new a post
 * @param {Object} postObject - Object contains information about new post
 * @returns {Promise<Post>}
 */
const createPost = async (postObject) => {
  if (await Post.isSubjectDuplicate(postObject['subject'])) {
    throw new ApiError(httpStatus[409], 'Existing a similar subject of post!')
  }

  return await Post.create(postObject)
}

const getPostQuantity = (userId) => {
  return new Promise((resolve, reject) => {
    resolve(Post.countDocuments({ user: userId }))
  })
}

const getPostQuantityOfAll = () => {
  return new Promise((resolve, reject) => {
    resolve(Post.countDocuments())
  })
}

/**
 * Get all posts of a user
 * @param {string} - Id of user
 * @returns {Promise<Post[]>}
 */
const getPostsByUserId = (userId, currentPage) => {
  return new Promise((resolve, reject) => {
    resolve(Post.find({ user: userId })
                .skip((currentPage - 1) * PAGINATION['PER_PAGE'])
                .limit(PAGINATION['PER_PAGE']))
  })
}

const getAllPosts = (currentPage) => {
  return new Promise((resolve, reject) => {
    resolve(Post.find({})
                .skip((currentPage - 1) * PAGINATION['PER_PAGE'])
                .limit(PAGINATION['PER_PAGE']))
  })
}

const paginatePostOfOneUser = (userId, currentPage) => {
  return new Promise((resolve, reject) => {
    Promise.all([getPostsByUserId(userId, currentPage), getPostQuantity(userId)])
      .then(([posts, postQuantity]) => {
        let result = {
          posts,
          pageQuantity: Math.ceil(postQuantity / PAGINATION['PER_PAGE']),
        }
        resolve(result)
      })
    })
}


const paginatePostOfAllUsers = (currentPage) => {
  return new Promise((resolve, reject) => {
    Promise.all([getAllPosts(currentPage), getPostQuantityOfAll()])
      .then(([posts, postQuantity]) => {
        let result = {
          posts,
          pageQuantity: Math.ceil(postQuantity / PAGINATION['PER_PAGE']),
        }
        resolve(result)
      })
    })
}

const getPostByPostId = async (postId) => {
  const post = await Post.findById(postId)
  return post
}

const updatePostBySlug = async (postSlug, postBody) => {
  if (postBody.subject) {
    postBody.slug = slugify(postBody.subject, {
      lower: true,
      strict: true,
    })
    console.log(`slug = ${postBody.slug}`)
  }
  
  if (postBody.markdown) {
    postBody.sanitizedHtml = dompurify.sanitize(marked(postBody.markdown))
  }
  console.log(`html = ${postBody.sanitizedHtml}`)
  await Post.updateOne({ slug: postSlug }, postBody)
  return postBody
}

module.exports = {
  getPostByPostSlug,
  getPostsByUserId,
  createPost,
  getAllPosts,
  getPostByPostId,
  updatePostBySlug,
  paginatePostOfOneUser,
  paginatePostOfAllUsers,
  // getPostQuantity,
  // deletePostById,
}; 