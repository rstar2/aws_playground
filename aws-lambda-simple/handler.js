'use strict';

module.exports.main = (event, context, callback) => {

    let name = 'Anonymous';

    // extracting query parameters from HTTP GET/POST request
    // if the function is triggered by HTTP event
    // e.g. https://jm2f52kt06.execute-api.eu-central-1.amazonaws.com/dev/execute?name=RUMEN
    if (event.queryStringParameters && event.queryStringParameters.name) {
        // will extract RUMEN from the query
        name = event.queryStringParameters.name;
    }

    // extract parameters from HTTP POST request
    if (event.httpMethod === 'POST' && event.body) {
        // assume it's JSON ("application/json")
        const json = JSON.parse(event.body);
        if (json.name) {
            name = json.name;
        }
    }

    // access the environment variables
    const variable1 = process.env.variable1;
    const variable2 = process.env.variable2;

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: `Hello ${name}`,
            env: [variable1, variable2],
            event,
        }),
    };



    callback(null, response);

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};