const ROLE = {
  ADMIN: 'admin',
  USER: 'user',
}

const canViewAndEditUserPost = (user, post) => {
  return (
    user.role === ROLE.ADMIN ||
    post.user.toString() === user._id.toString()
  )
}

module.exports = {
  ROLE,
  canViewAndEditUserPost,
}