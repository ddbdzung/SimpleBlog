const handleValidator = (errors) => {
  return errors.array().map(err => err['msg'])
}

module.exports = handleValidator
