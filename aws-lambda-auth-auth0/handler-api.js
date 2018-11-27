module.exports.handler = async (event, context) => {

    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        // "Access-Control-Request-Headers": "*"
    };

    // TODO: get it from the context
    const userId = 'TODO';

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
