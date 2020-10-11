const Responses = require('../common/API_Responses')
const AWS = require('aws-sdk')
const SES = new AWS.SES()

module.exports.sendEmail = async (event, context, callback) => {
  console.log(event)
  console.log(event.Records[0].Sns)
  // const { to, from, subject, content } = JSON.parse(event.body)

  const { to, firstName, lastName } = JSON.parse(event.Records[0].Sns.Message)
  const subject = `Hi ${firstName}! An account is been created for you 🥂`
  const content = `Hello ${firstName} ${lastName}, Welcome To MightyMicro API!`

  if (!to || !subject || !content) {
    return Responses._400({
      message: `Missing arguments for sending email`,
    })
  }
  console.log(to)
  // const params = {
  //   Destination: {
  //     ToAddresses: [to],
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
  //   Source: 'callforcopy@gmail.com',
  // }
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Source: 'callforcopy@gmail.com',
    Template: 'MightyTemplateEmoji',
    TemplateData: `{ \"firstName\":\"${firstName}\", \"lastName\": \"${lastName}\" }`,
  }
  try {
    // const result = await SES.sendEmail(params).promise()
    const result = await SES.sendTemplatedEmail(params).promise()

    console.log('email result', result)
    return Responses._200({ message: 'Email sent' })
  } catch (err) {
    console.log('Error in email sending', err)
    return Responses._400({ message: 'Email failed to send' })
  }
}
