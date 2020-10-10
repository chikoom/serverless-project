'use strict'

const Functions = require('../common/API_Functions')
const AFunctions = require('../common/AUTH_Functions')

module.exports.queryUsers = async (event, context, callback) => {
  const {
    resource,
    httpMethod,
    pathParameters,
    queryStringParameters,
    body,
  } = event

  if (httpMethod === 'GET' && resource === '/users') {
    return await Functions.getUsers()
  }
  if (httpMethod === 'POST' && resource === '/users') {
    return await Functions.createUser(body)
  }
  if (httpMethod === 'GET' && resource === '/users/{id}' && pathParameters) {
    return await Functions.getUser(pathParameters.id)
  }
  if (httpMethod === 'DELETE' && resource === '/users/{id}' && pathParameters) {
    return await Functions.deleteUser(pathParameters.id)
  }
  if (
    httpMethod === 'PUT' &&
    resource === '/users/{id}' &&
    pathParameters &&
    body
  ) {
    return await Functions.updateUser(pathParameters.id, body)
  }
  if (httpMethod === 'POST' && resource === '/signup') {
    return await AFunctions.signupUser(body)
  }
  if (httpMethod === 'POST' && resource === '/login') {
    return await AFunctions.loginUser(body)
  }

  return null
}
