
const AWS = require('aws-sdk');

AWS.config.region = process.env.AWS_REGION;

const put = params =>
    new Promise((resolve, reject) => {
        const dynamodb = new AWS.DynamoDB({ region: process.env.AWS_REGION });
        const docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });
        docClient.put(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

const query = params =>
    new Promise((resolve, reject) => {
        const dynamodb = new AWS.DynamoDB({ region: process.env.AWS_REGION });
        const docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });
        docClient.query(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

const queryItems = async params => {
    const items = [];
    let lastEvaluatedKey = null;
    do {
        params.ExclusiveStartKey = lastEvaluatedKey;
        const page = await query(params); // eslint-disable-line no-await-in-loop
        items.push(...page.Items);
        lastEvaluatedKey = page.LastEvaluatedKey;
    } while (lastEvaluatedKey);
    return items;
};

module.exports = {
    queryItems,
    put
};
