module.exports.api = async (event, context) => {
    // this Lambda with HTTP gateway is secured with 'authorizer: aws_iam'
    const userId = event.requestContext.identity.cognitoIdentityId;

    console.log(`Authenticated user identity: ${userId}`);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Authenticated user '${userId}'`,
            event,
            context,
        }),
    };
};
