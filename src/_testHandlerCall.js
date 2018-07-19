const handler = require('./handlers/getWeather/handler').handler;

handler(
    {  
        "resource":"/weather",
        "path":"/weather",
        "httpMethod":"GET",
        "headers":null,
        "queryStringParameters":{"q":"Kuala Lumpur"},
        "pathParameters":{},
        "stageVariables":null,
        "isBase64Encoded":false
     }
    , null, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
});