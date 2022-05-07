// If user didn't log in => Redirect to login page
let checkLogIn = (req, res, next) => {
  if (req.isUnauthenticated()) {
    return res.redirect('/auth')
  }
  
  next()
}

// If user logged in => Redirect to home page
let checkLogOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/posts/all')
  }

  next()
}

module.exports = {
  checkLogIn,
  checkLogOut,
}

