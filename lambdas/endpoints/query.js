'use strict'

const Responses = require('../common/API_Responses')
const Functions = require('../common/API_Functions')
const AFunctions = require('../common/AUTH_Functions')

// // Add warmup
// const queryFunctions = {
//   'GET': {
//     '/users': Functions.getUsers,
//     '/users/{id}': Functions.getUser,
//   },
//   'POST': {
//     '/users': Functions.createUser,
//   },
//   'PUT': {
//     '/users/{id}': Functions.updateUser,
//   },
//   'DELETE': {
//     '/users/{id}': Functions.deleteUser,
//   },
// }

module.exports.queryUsers = async (event, context, callback) => {
  console.log('query users')
  console.log('context', context)
  console.log('resource', event.resource)
  console.log('event method', event.httpMethod)
  console.log('event pathParameters', event.pathParameters)
  console.log('event queryStringParameters', event.queryStringParameters)
  console.log('event body', event.body)

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

  // return Responses._400({
  //   message: `${event.httpMethod} | ${event.pathParameters} | ${event.queryStringParameters} | ${event.body}`,
  // })

  // if (!event.pathParameters || !event.pathParameters.id) {
  //   return Responses._400({ message: 'missing user id' })
  // }
  // const id = event.pathParameters.id
  // // if (data[id]) return Responses._200(data[id])
  // if (data[id]) return Responses._200({ message: 'get users' })
  // return Responses._400({ message: 'no data' })
}

const data = {
  1234: {
    firstName: 'idan',
    lastName: 'baron',
    phones: '972528228640',
    email: 'callforcopy@gmail.com',
  },
}
