const AWS = require("aws-sdk");

AWS.config.update({ region: process.env.AWS_REGION });

// let the url expire after 30 seconds
const UPLOAD_URL_EXPIRATION_SECONDS = 30;
const DOWNLOAD_URL_EXPIRATION_SECONDS = 60;

// the bucket to upload, e.g. for which to create a signed-url
const UPLOAD_BUCKET = process.env.S3_UPLOAD_BUCKET;

// AWS S3 service (by default use the AWS_S3_BUCKET bucket)
const s3 = new AWS.S3({ params: { Bucket: UPLOAD_BUCKET } });

/**
 *
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
exports.onGetUploadURL = async (event, context) => {
    console.log("event", event);

    // this comes from the authorizer function
    const userId = event.requestContext.authorizer.lambda.userId;
    console.log("userId", userId);

    const Key = getKey(event);

    if (!Key) {
        console.log("No name passed");
        return createResponse(400, { error: "No name passed" });
    }

    return getSignedURL(Key, UPLOAD_URL_EXPIRATION_SECONDS, true);
};

exports.onGetDownloadURL = async (event) => {
    console.log("event", event);

    // this comes from the authorizer function
    const userId = event.requestContext.authorizer.lambda.userId;
    console.log("userId", userId);

    const Key = getKey(event);

    if (!Key) {
        console.log("No name passed");
        return createResponse(400, { error: "No name passed" });
    }

    try {
        await s3.headObject({ Key }).promise();
    } catch (err) {
        return createResponse(400, { error: "No such resource in the bucket" });
    }

    return getSignedURL(Key, DOWNLOAD_URL_EXPIRATION_SECONDS, false);
};

/**
 *
 * @param {AWS.Http.event} event
 * @return {string|undefined}
 */
function getKey(event) {
    // parse the 'name' from the query parameters of the HTTP request
    // e.g. https://...?name=file
    let Key;
    if (event.queryStringParameters && event.queryStringParameters.name) {
        // will extract from the query
        Key = event.queryStringParameters.name;
    }

    return Key;
}

/**
 * Generate a pre-signed
 * @param {string} Key
 * @param {number} Expires
 * @param {boolean} isUpload
 * @return {{statusCode: number, body: string}} response
 */
async function getSignedURL(Key, Expires, isUpload) {
    console.log(`Get signedUrl from ${UPLOAD_BUCKET}}`);

    // Get signed URL from S3
    const s3Params = {
        Expires,
        Key,
    };

    let statusCode;
    let body;
    try {
        const signedURL = await s3.getSignedUrlPromise(
            isUpload ? "putObject" : "getObject",
            s3Params
        );

        console.log("Got signedURL", signedURL);

        statusCode = 200;
        body = {
            signedURL,
            Key,
        };
    } catch (err) {
        console.error(`Failed to get signedURL from ${UPLOAD_BUCKET}}`, err);
        statusCode = 500;
        body = {
            error: err.message,
        };
    }

    return createResponse(statusCode, body);
}

/**
 * Create the response to send from the Lambda
 * @param {number} statusCode
 * @param {any} body
 * @return {{statusCode: number, body: string}} response
 */
function createResponse(statusCode, body) {
    return {
        statusCode,

        // not needed if using the "httpApi: cors: true" setting in serverless.yml
        // headers: {
        //     "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        //     "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        // },
        body: JSON.stringify(body),
    };
}
