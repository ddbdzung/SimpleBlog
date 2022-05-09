const { catchAsync, pick } = require('../utils')
const { userService } = require('../services')


// [GET /auth]
const getLoginView = catchAsync(async (req, res) => {
  res.render('pages/login', {
    title: 'Login',
    errors: req.flash('errors'),
    successes: req.flash('successes'),
  })
})

// [GET /auth/sign-up]
const getRegisterView = catchAsync(async (req, res) => {
  res.render('pages/register', {
    title: 'Register',
  })
})

// [POST /auth/sign-up]
const postRegister = catchAsync(async (req, res) => {
  const successArr = []
  const userObj = pick(req.body, ['fullname', 'email', 'password'])
  try {
    await userService.createNewUser(userObj)
    successArr.push('Sign up successfully!')

    req.flash('successes', successArr)
    return res.redirect('/auth')
  } catch (err) {
    return res.status(409).json({
      msg: err.message,
    })
  }
})

// [GET /auth/logout]
const getLogout = (req, res) => {
  req.logout()  // remove session passport user
  req.flash('successes', 'Log out successfully!')
  return res.redirect('/auth')
}

module.exports = {
  getLoginView,
  getRegisterView,
  postRegister,
  getLogout,
}
