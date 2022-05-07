const passport = require('passport')
const passportLocal = require('passport-local')

const { userService } = require('../services')

let LocalStrategy = passportLocal.Strategy

/**
 * Valid user account type: local
 */
let initPassportLocal = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, async (req, email, password, done) => {
    try {
      let user = await userService.getUserByEmail(email)
      if (!user || !(await user.isPasswordMatch(password))) {
        return done(null, false, req.flash('errors', 'Incorrect email or password!'))
      }

      return done(null, user, req.flash('successes', 'Successfully sign in!'))
    } catch (err) {
      return done(null, false, req.flash('errors', 'Internal server error!'))
    }
  }))

  // Save userId to session
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  // This is called by passport.session()
  // return userInfo to req.user
  passport.deserializeUser((id, done) => {
    userService.getUserById(id)
      .then(user => {
        return done(null, user)
      })
      .catch(err => {
        return done(err, null)
      })
  })
}

module.exports = {
  initPassportLocal,
}
