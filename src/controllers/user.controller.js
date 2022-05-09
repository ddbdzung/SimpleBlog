const { userService } = require('../services')
const { catchAsync, pick} = require('../utils')


const getUserData = catchAsync(async (req, res) => {
  // Convert user ID from objectID to string
  let userId = req.user._id
  userId = userId.toString()

  try {
    const user = await userService.getUserById(userId)
    if (!user) return res.status(404).send('No user found')

    return res.render('pages/viewOwnAccount', {
      title: 'Your account',
      user: user,
    })
  } catch (err) {
    return res.status(500).json(err)
  }
})

const updateData = catchAsync(async (req, res) => {
  // Handle error
  if (!req.body.hasOwnProperty('fullname') && !req.body.hasOwnProperty('email')) {
    // Working normally
  } else {
    if (req.body.fullname === '' || req.body.email === '') {
      return res.status(400).json({
        errors: 'Full name and email must be fullfilled!',
      })
    }
  }

  // Convert user ID from objectID to string
  let userId = req.user._id
  userId = userId.toString()
  
  let userBody = pick(req.body, ['fullname', 'email', 'address', 'phone'])
  try {
    const newUser = await userService.updateUserById(userId, userBody)
    return res.json(newUser)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

module.exports = {
  getUserData,
  updateData,
}
