const Responses = require('./API_Responses')
const Dynamo = require('./Dynamo')
const { USER_TABLE } = process.env

module.exports = {
  signupUser: async body => {
    const parsedBody = JSON.parse(body)
    const attr = {
      field: 'email',
      value: parsedBody.email,
    }
    const result = await Dynamo.findOne(USER_TABLE, attr).catch(err => {
      console.log('Error in Dynamo signup', err)
      return null
    })
    if (result.Count > 0) {
      return Responses._400({
        message: `User with this email already exist`,
      })
    }
    const user = await Dynamo.create(USER_TABLE, body).catch(err => {
      console.log('Error in Dynamo create', err)
      return null
    })
    if (!user) {
      return Responses._400({
        message: `Faild to create user`,
      })
    }
    delete user.password
    return Responses._200(user)
  },
  loginUser: async body => {
    const parsedBody = JSON.parse(body)
    const attr = {
      field: 'email',
      value: parsedBody.email,
    }
    const result = await Dynamo.findOne(USER_TABLE, attr).catch(err => {
      console.log('Error in Dynamo login', err)
      return null
    })
    if (result.Count === 0) {
      return Responses._400({
        message: `User with this email doesn't exist`,
      })
    }
    const user = result.Items[0]
    const askedPassword = parsedBody.password
    const retrievedPassword = user.password
    if (askedPassword !== retrievedPassword) {
      return Responses._400({
        message: `Password doesn't match`,
      })
    }
    delete user.password
    return Responses._200(user)
  },
}
