const jwt = require("jsonwebtoken");

// Set in `environment` of serverless.yml
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;

/**
 *
 * @param {import('aws-lambda').APIGatewayAuthorizerEvent} event
 * @param {import('aws-lambda').Context} context
 * @return {import('aws-lambda').APIGatewayAuthorizerResult}
 */
exports.authorize = async (event, context) => {
    try {
        console.log("event", event);

        // the identitySource is configured to be created/parsed from the Authorization header
        // in the serverless.yml (still this is an array as multiple such mappings can be configured)
        const authorizationToken = event.identitySource?.[0];
        if (!authorizationToken) {
            // no header Authorization at all
            throw new Error("Unauthorized");
        }

        const tokenParts = authorizationToken.split(" ");
        const token = tokenParts[1];

        if (!(tokenParts[0].toLowerCase() === "bearer" && token)) {
            // no auth token - Authorization header must be with format "Bearer xxxx"
            throw new Error("Unauthorized");
        }

        // it will throw if not verified
        const userId = await verify(token);

        console.log("Authorized", userId);

        // return generatePolicy(userId, "Allow", event.routeArn);
        // with version 2.0 of the payload event (which is by default anyway)
        // the returned response can be just "simple-response" as specified in
        // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html
        // A full IAM policy (as needed for the 1.0 version) can still be return
        return {
            isAuthorized: true,

            // these ca be accessed from the handling function's event as:
            // event.requestContext.authorizer.lambda.xxx;
            // NOTE: If the context-map is returned as IAM policy (version 1.0) then the accessing
            // will be from event.requestContext.authorizer.xxx
            context: {
                userId: "XXX",
            },
        };
    } catch (err) {
        console.error("Unauthorized", err);

        // in any error case - return not auth
        // NOTE: the thrown Errors are not useful for authorizers
        return {
            isAuthorized: false,
        };
    }
};

/**
 *
 * @param {string} token
 * @return Promise<string>
 */
async function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            AUTH0_CLIENT_PUBLIC_KEY,
            {
                // the Auth0 uses (is set to sign with RS256)
                algorithms: ["RS256"],
                audience: AUTH0_CLIENT_ID,
            },
            (verifyError, decoded) => {
                if (verifyError) reject(new Error(verifyError));
                else resolve(decoded.sub);
            }
        );
    });
}

// const generatePolicy = (userId, effect, resource) => {
//     const authResponse = {};
//     authResponse.principleId = userId;

//     if (effect && resource) {
//         const policyDocument = {
//             Version: '2012-10-17',
//             Statement: [
//                 {
//                     Action: 'execute-api:Invoke',
//                     Effect: effect,
//                     Resource: resource,
//                 },
//             ],
//         };
//         //Object.assign(authResponse, { policyDocument, });
//         authResponse.policyDocument = policyDocument;
//     }

//     // Optional output with custom properties of the String, Number or Boolean type.
//     authResponse.context = {
//         'userId': userId,
//         // NOTE: could pass email/name/etc..
//     };
//     // These keys can be accessed in the backend Lambda function as part of the input event
//     // $event.requestContext.authorizer.<key>.
//     // BUT their values are stringified, for example, "stringval", "123", or "true", respectively.

//     return authResponse;
// };
