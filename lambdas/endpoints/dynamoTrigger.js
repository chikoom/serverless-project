const Responses = require('../common/API_Responses')
const AWS = require('aws-sdk')
const SES = new AWS.SES()

module.exports.dynamoTrigger = async (event, context, callback) => {
  console.log('dynamo trigger event')
  console.log('event', event)
  console.log('eventName', event.Records[0].eventName)
  console.log('dynamodb', event.Records[0].dynamodb)
  console.log('dynamodb', event.Records[0].dynamodb.NewImage.firstName)
  console.log('dynamodb', event.Records[0].dynamodb.NewImage.lastName)
  console.log('dynamodb', event.Records[0].dynamodb.NewImage.email)

  // const { to, from, subject, content } = JSON.parse(event.body)
  // if (!to || !from || !subject || !content) {
  //   return Responses._400({
  //     message: `Missing arguments for sending email`,
  //   })
  // }
  // const params = {
  //   Destination: {
  //     ToAddresses: [to, 'studio@chikoom.com'],
  //   },
  //   Message: {
  //     Body: {
  //       Text: {
  //         Data: content,
  //       },
  //     },
  //     Subject: {
  //       Data: subject,
  //     },
  //   },
  //   Source: from,
  // }
  // try {
  //   const result = await SES.sendEmail(params).promise()
  //   console.log('email result', result)
  //   return Responses._200({ message: 'Email sent' })
  // } catch (err) {
  //   console.log('Error in email sending', err)
  //   return Responses._400({ message: 'Email failed to send' })
  // }
  return null
}
