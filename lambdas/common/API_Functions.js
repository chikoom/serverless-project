const Responses = require('./API_Responses')
const Dynamo = require('./Dynamo')

const { USER_TABLE } = process.env

module.exports = {
  getUsers: async () => {
    const users = await Dynamo.getAll(USER_TABLE).catch(err => {
      console.log('Error in Dynamo get', err)
      return null
    })
    if (!users) {
      return Responses._400({
        message: `Faild to get users`,
      })
    }
    const responseUsers = users.map(user => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id,
    }))
    console.log(responseUsers)
    return Responses._200(responseUsers)
  },
  getUser: async id => {
    const user = await Dynamo.findOne(USER_TABLE, {
      field: 'id',
      value: id,
    }).catch(err => {
      console.log('Error in Dynamo get one', err)
      return null
    })
    if (!user || !user.Items) {
      return Responses._400({
        message: `Faild to get users`,
      })
    }
    if (user.Items[0]) {
      const userToSend = user.Items[0]
      delete userToSend.password
      return Responses._200(userToSend)
    }
    return Responses._400({
      message: `Could not find user`,
    })
  },
  createUser: async body => {
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
  updateUser: async (id, body) => {
    const updatedUser = await Dynamo.update(USER_TABLE, id, body).catch(err => {
      console.log('Error in Dynamo update', err)
      return null
    })
    console.log('updatedUser', updatedUser)
    if (!updatedUser) {
      return Responses._400({
        message: `Faild to update user`,
      })
    }
    delete updatedUser.password
    return Responses._200(updatedUser)
  },
  deleteUser: async id => {
    const userId = await Dynamo.delete(USER_TABLE, id).catch(err => {
      console.log('Error in Dynamo delete', err)
      return null
    })
    if (!userId) {
      return Responses._400({
        message: `Faild to delete user`,
      })
    }
    return Responses._200(userId)
  },
}
