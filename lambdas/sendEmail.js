'use strict'

module.exports.sendEmail = async (event, context, callback) => {
  return {
    headers: {
      'Ceontent-Type': 'application/json',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 400,
    body: JSON.stringify('send email'),
  }
}
