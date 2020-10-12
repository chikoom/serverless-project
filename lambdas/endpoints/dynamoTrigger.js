const Responses = require('../common/API_Responses')
const AWS = require('aws-sdk')
const SNS = new AWS.SNS({ apiVersion: '2010-03-31' })

module.exports.dynamoTrigger = async (event, context, callback) => {
  console.log('dynamo trigger event')
  if (event.Records[0].eventName === 'INSERT') {
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
      const result = await SNS.publish(TopicParams).promise()
      console.log(result)
    } catch (err) {
      console.log('SNS error', err)
    }
  }
  return Responses._200({ message: 'triggerd' })
}
