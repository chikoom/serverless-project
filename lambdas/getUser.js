'use strict'

const Responses = require('./API_Responses')

exports.handler = async event => {
  console.log('event', event)
  if (!event.pathParameters || !event.pathParameters.id) {
    return Responses._400({ message: 'missing user id' })
  }
  const id = event.pathParameters.id
  if (data[id]) return Responses._200(data[id])
  return Responses._400({ message: 'no data' })
}

const data = {
  1234: {
    firstName: 'idan',
    lastName: 'baron',
    phones: '972528228640',
    email: 'callforcopy@gmail.com',
  },
}
