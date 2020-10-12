const Responses = require('../common/API_Responses')
const AWS = require('aws-sdk')
const SES = new AWS.SES()

module.exports.sendEmail = async event => {
  const { to, firstName, lastName } = JSON.parse(event.Records[0].Sns.Message)

  if (!to || !firstName) {
    return Responses._400({
      message: `Missing arguments for sending email`,
    })
  }
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Source: 'callforcopy@gmail.com',
    Template: 'MightyTemplateEmoji',
    TemplateData: `{ \"firstName\":\"${firstName}\", \"lastName\": \"${lastName}\" }`,
  }
  try {
    const result = await SES.sendTemplatedEmail(params).promise()
    console.log('email result', result)
    return Responses._200({ message: 'Email sent' })
  } catch (err) {
    console.log('Error in email sending', err)
    return Responses._400({ message: 'Email failed to send' })
  }
}
