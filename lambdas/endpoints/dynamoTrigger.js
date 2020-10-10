const Responses = require('../common/API_Responses')
const AWS = require('aws-sdk')
const SNS = new AWS.SNS({ apiVersion: '2010-03-31' })

module.exports.dynamoTrigger = async (event, context, callback) => {
  console.log('dynamo trigger event')
  console.log('event', event)

  console.log('eventName', event.Records[0].eventName)

  if (event.Records[0].eventName === 'INSERT') {
    console.log('dynamodb', event.Records[0].dynamodb)
    console.log('NewImage', event.Records[0].dynamodb.NewImage)
    console.log('dynamodb', event.Records[0].dynamodb.NewImage.firstName.S)
    console.log('dynamodb', event.Records[0].dynamodb.NewImage.lastName.S)
    console.log('dynamodb', event.Records[0].dynamodb.NewImage.email.S)

    const AttributeParams = {}

    const TopicParams = {
      Subject: 'Send email message',
      Message: JSON.stringify({
        to: event.Records[0].dynamodb.NewImage.email.S,
        firstName: event.Records[0].dynamodb.NewImage.firstName.S,
        lastName: event.Records[0].dynamodb.NewImage.lastName.S,
      }),
      TopicArn: 'arn:aws:sns:eu-central-1:727334985450:sendWel',
    }

    try {
      // await SNS.setTopicAttributes(AttributeParams).promise()
      const result = await SNS.publish(TopicParams).promise()
      console.log(result)
    } catch (err) {
      console.log('SNS error', err)
    }
  }

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
  return Responses._200({ message: 'triggerd' })
}
