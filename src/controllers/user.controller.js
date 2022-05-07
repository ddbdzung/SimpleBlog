const httpStatus = require('http-status')

const { ApiError, catchAsync, handleValidator, pick} = require('../utils')

const getUsers = catchAsync(async (req, res) => {
  res.send('users')
})

module.exports = {
  getUsers,
}
