const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.api = async (event, context) => {
    // this Lambda with HTTP gateway is secured with 'authorizer: aws_iam'
    // this is the Federated Identity id (e.g. the id of the user inside the Cognito Federated Pool)
    // after the user has been authenticated via the Cognito User Pool

    // const identityId = event.requestContext.identity.cognitoIdentityId;
    const { userPoolId, userId } = getUserPoolUserId(event);
    const user = await getUser(userPoolId, userId);
    // {
    //     Enabled: true,
    //     UserAttributes: [
    //         { Name: "sub", Value: "should be like userId, but userId is not guaranteed to be unique" },
    //         {Name: "email_verified", Value: "false"},
    //         {Name: "name", Value: "Tester"},
    //         {Name: "email", Value: "test@test.com"}
    //     ],
    //     UserCreateDate: "2018-11-01T18:46:54.701Z",
    //     UserLastModifiedDate: "2018-11-01T18:47:34.967Z",
    //     UserStatus: "CONFIRMED",
    //     Username: "userId",
    // }

    console.log(`Authenticated user cognito identity: ${userId}`);

    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        // "Access-Control-Request-Headers": "*"
    };

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            message: `Authenticated user '${userId}'`,
            event,
            context,
            user,
        }),
    };
};

/**
 *
 * @param {String} userPoolId
 * @param {String} username
 * @return {Promise}
 */
const getUser = async (userPoolId, username) => {
    const params = {
        UserPoolId: userPoolId,
        Username: username,
    };
    return cognito.adminGetUser(params).promise();
};

/**
 * Finding the User Pool Id and the User Id (e.g. the id inside this pools)
 * @param {{userPoolId: String, userId: String}} event
 */
const getUserPoolUserId = (event) => {
    // However, you might find yourself looking for a user’s User Pool user id in your Lambda function.
    // While the process below isn’t documented, it is something we have been using and it solves this problem pretty well.

    // event.requestContext.identity: {
    //     accessKey: "ASIAYUAXTUJKLNCCO5HD"
    //     accountId: "592755008084"
    //     caller: "AROAIYDZMRT6RJAPEMQOO:CognitoIdentityCredentials"
    //     cognitoAuthenticationProvider: "cognito-idp.eu-central-1.amazonaws.com/eu-central-1_3UwYWOxmP,cognito-idp.eu-central-1.amazonaws.com/eu-central-1_3UwYWOxmP:CognitoSignIn:6852ca10-901f-43c4-a682-8e76d3831921"
    //     cognitoAuthenticationType: "authenticated"
    //     cognitoIdentityId: "eu-central-1:fd624b09-96a4-43e3-bd10-c25e4ee6a4da"
    //     cognitoIdentityPoolId: "eu-central-1:5cbd3c7e-1eb1-4c6e-b3e8-d346223fd500"
    //     sourceIp: "91.139.130.206"
    //     user: "AROAIYDZMRT6RJAPEMQOO:CognitoIdentityCredentials"
    //     userAgent: "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    //     userArn: "arn:aws:sts::592755008084:assumed-role/my-auth-congnito-amplify-MyIdentityPoolAuthentica-KU20LJRLEOMF/CognitoIdentityCredentials"
    // }

    // contains the authentication details from the User Pool
    const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
    // Cognito authentication provider looks like:
    // Where 'eu-central-1_3UwYWOxmP' is the User Pool id
    // And '6852ca10-901f-43c4-a682-8e76d3831921' is the User Pool User Id
    const parts = authProvider.split(':');
    const userPoolIdParts = parts[parts.length - 3].split('/');

    const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
    const userId = parts[parts.length - 1];

    return { userPoolId, userId };
};
