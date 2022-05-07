const httpStatus = require('http-status')
const slugify = require('slugify')
const { marked } = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')

const dompurify = createDomPurify(new JSDOM().window)

const { Post } = require('../models');
const { userService } = require('../services')
const ApiError = require('../utils/ApiError');

// /**
//  * Query for post
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */
// const getPosts = async (filter, options) => {
//   const post = await Post.paginate(filter, options);
//   return post;
// };

// /**
//  * Create a post
//  * @param {Object} postBody
//  * @returns {Promise<Post>}
//  */
// const createPost = async (postBody) => {
//   if (await Post.isTitleDuplicate(postBody.title)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Tên bài viết đã tồn tại');
//   }

//   return Post.create(postBody);
// };

// /**
//  * Get post by id
//  * @param {ObjectId} id
//  * @returns {Promise<Post>}
//  */
// const getPostById = async (id) => {
//   await redisService.setex(`post`, id, '1m', await Post.findById(id));
//   return Post.findById(id);
// };

// /**
//  * Update post by id
//  * @param {ObjectId} postId
//  * @param {Object} updateBody
//  * @returns {Promise<Post>}
//  */
// const updatePostById = async (postId, updateBody) => {
//   const post = await getPostById(postId);
//   if (!post) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Bài viêt không tồn tại');
//   }
//   if (updateBody.title && (await Post.isTitleDuplicate(updateBody.title))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Tên bài viết đã tồn tại');
//   }

//   Object.assign(post, updateBody);
//   await post.save();
//   return post;
// };

// /**
//  * Delete post by id
//  * @param {ObjectId} postId
//  * @returns {Promise<Post>}
//  */
// const deletePostById = async (postId) => {
//   const post = await getPostById(postId);

//   if (!post) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Bài viết không tồn tại');
//   }
//   await post.remove();
//   return post;
// };

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

/**
 * Get all posts of a user
 * @param {string} - Id of user
 * @returns {Promise<Post[]>}
 */
const getPostsByUserId = async (userId) => {
  return await Post.find({ user: userId })
}

const getAllPosts = async () => {
  const posts = await Post.find({})
  return posts
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
  // updatePostById,
  // deletePostById,
}; 