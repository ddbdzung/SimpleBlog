const httpStatus = require('http-status')

const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get user by id
 * @param {string} userId - Id of user
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  return await User.find({ _id: userId })
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
 const getUserByEmail = async (emailFromClient) => {
  let user = await User.findOne({ email: emailFromClient })
  return user;
};

/**
 * Create a new user
 * @param {Object} userObject - object contains user information
 * @returns {Promise<User>}
 */
 const createNewUser = async (userObject) => {
  if ((await User.isEmailTaken(userObject.email))) {
    throw new ApiError(httpStatus['409_NAME'], 'Email is in used')
  }

  return await User.create(userObject)
}

module.exports = {
  getUserById,
  createNewUser,
  getUserByEmail,
}
