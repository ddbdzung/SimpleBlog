const express = require('express')
const userRoute = require('./user.route')
const authRoute = require('./auth.route')
const postRoute = require('./post.route')
const publicRoute = require('./public.route')

const router = express.Router()

const defaultRoutes = [
  {
    path: '/',
    route: publicRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
]

const userRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/posts',
    route: postRoute,
  },
]

const adminRoutes = [
  
]

defaultRoutes.forEach(route => {
  router.use(route.path, route.route)
})

userRoutes.forEach(route => {
  router.use(route.path, route.route)
})

adminRoutes.forEach(route => {
  router.use(route.path, route.route)
})

module.exports = router
