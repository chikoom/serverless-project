const { v4: uuidv4 } = require('uuid')
const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()

const Dynamo = {
  async get(id, TableName) {
    const params = {
      TableName,
      Key: {
        id,
      },
    }
    const data = await documentClient.get(params).promise()
    if (!data || !data.Item) {
      throw Error(
        `Error fetching from user DB for id ${id} from table ${TableName}`
      )
    }
    return data.Item
  },
  async findOne(TableName, attr) {
    const params = {
      TableName,
      FilterExpression: `${attr.field} = :${attr.field}`,
      ExpressionAttributeValues: { [`:${attr.field}`]: attr.value },
    }
    const data = await documentClient.scan(params).promise()
    console.log('data', data)
    return data
  },
  async getAll(TableName) {
    const data = await documentClient.scan({ TableName }).promise()
    if (!data || !data.Items) {
      throw Error(`Error fetching from DB table ${TableName}`)
    }
    return data.Items
  },
  async create(TableName, body) {
    const id = uuidv4()
    const createdAt = new Date().toLocaleString()
    const updatedAt = new Date().toLocaleString()
    const bodyObject = JSON.parse(body)
    const params = {
      TableName,
      Item: { id, createdAt, updatedAt, ...bodyObject },
    }
    const result = await documentClient.put(params).promise()
    if (!result) {
      throw Error(`Error creating new user in DB table ${TableName}`)
    }
    const retreiveParams = {
      TableName,
      Key: {
        id,
      },
    }
    const data = await documentClient.get(retreiveParams).promise()
    if (!data || !data.Item) {
      throw Error(`Error retreiving the created user`)
    }
    return data.Item
  },
  async update(TableName, id, body) {
    const updatedAt = new Date().toLocaleString()
    const bodyObject = JSON.parse(body)
    bodyObject.updatedAt = updatedAt
    const queryString = Object.keys(bodyObject)
      .map(key => `${key} = :${key}`)
      .join(' , ')
    const attrValues = {}
    Object.entries(bodyObject).forEach(entry => {
      attrValues[`:${entry[0]}`] = entry[1]
    })
    const params = {
      TableName,
      Key: {
        id,
      },
      UpdateExpression: `SET ${queryString}`,
      ExpressionAttributeValues: attrValues,
      ReturnValues: 'ALL_NEW',
    }
    const result = await documentClient.update(params).promise()
    if (!result || !result.Attributes) {
      console.log('Error updating')
      throw Error(`Error updating existing user in DB table ${TableName}`)
    }
    console.log('result', result.Attributes)
    return result.Attributes
  },
  async delete(TableName, id) {
    const params = {
      TableName,
      Key: {
        id,
      },
    }
    const result = await documentClient.delete(params).promise()
    if (!result) {
      throw Error(
        `Error deleting user from DB for id ${id} from table ${TableName}`
      )
    }
    return { deltedId: id }
  },
}

module.exports = Dynamo
