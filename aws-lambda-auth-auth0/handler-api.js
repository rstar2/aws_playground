module.exports.handler = async (event, context) => {

    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        // "Access-Control-Request-Headers": "*"
    };

    // get it from the authorizer context
    const userId = event.requestContext.authorizer.userId;

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            message: `Authenticated user '${userId}'`,
            input: event,
            context,
        }),
    };
};
