// For Lambda authorizers of the TOKEN type, API Gateway passes the source token to the Lambda function as the event.authorizationToken.
// For Lambda authorizers of the TOKEN type, API Gateway passes the source token to the Lambda function as the event.authorizationToken.
// Based on the value of this token, the preceding authorizer function returns an Allow IAM policy on a specified method
// if the token value is 'allow'. This permits a caller to invoke the specified method and the caller receives a 200 OK response.
// The authorizer function returns a Deny policy against the specified method if the authorization token has a 'deny' value.
// This blocks the caller from calling the method. The client receives a 403 Forbidden response.
// If the token is 'unauthorized', the client receives a 401 Unauthorized response.
// If the token is 'fail' or anything else, the client receives a 500 Internal Server Error response.
// In both of the last two cases, no IAM policy is generated and the calls fail.
module.exports.handler = async (event, context) => {
    // Get Token
    if (typeof event.authorizationToken === 'undefined') {
        console.log('AUTH: No token');
        // Return a 401 Unauthorized response
        throw 'Unauthorized'; // rejecting with 'Unauthorized' or callback('Unauthorized')
    }

    const split = event.authorizationToken.split('Bearer');
    if (split.length !== 2) {
        console.log('AUTH: no token in Bearer');
        // Return a 401 Unauthorized response
        throw 'Unauthorized'; // rejecting with 'Unauthorized' or callback('Unauthorized')
    }

    const token = split[1].trim();

    return authorizeJWT(token, event.methodArn)
        .then((policy => {
            console.log(`Authorized call with token '${token}' for '${policy.principalId}'`);
            return policy;
        }))
        .catch(error => {
            console.log(`Unauthorized call for token '${token}' - error: ${error}`);
            // HTTP status code of 401
            throw 'Unauthorized'; // rejecting with 'Unauthorized' or callback('Unauthorized')

            // NOTE: if returned other string/error then then HTTP status code will be 500
        });

};

const jwt = require('jsonwebtoken');
require('dotenv').config();

const AUTH0_API_JWT_SECRET = process.env.AUTH0_API_JWT_SECRET;
const AUTH0_API_JWT_ISSUER = process.env.AUTH0_API_JWT_ISSUER;
const AUTH0_API_JWT_AUDIENCE = process.env.AUTH0_API_JWT_AUDIENCE;

/**
 * @param {String} token
 * @param {String} resource
 * @return {Promise}
 */
const authorizeJWT = (jsonWebToken, resource) => {
    // Validating a token means that you are certain you can trust its contents.
    return new Promise((resolve, reject) => {
        jwt.verify(jsonWebToken, AUTH0_API_JWT_SECRET, {
            audience: AUTH0_API_JWT_AUDIENCE,
            issuer: AUTH0_API_JWT_ISSUER,
        }, (err, decoded) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(decoded);
            const userId = decoded.sub; // this is registered standard JWT claim
            // NOTE: could access the pass email/name/etc... if 'openid' scope is issued

            // NOTE: could play with the 'authorized' for instance if there are issued scopes
            const authorized = true;
            resolve({ userId, authorized });
        });
    })
        .then(({ userId, authorized }) => generatePolicy(userId, authorized ? EFFECT_ALLOW : EFFECT_DENY, resource));
};

const EFFECT_ALLOW = 'Allow';
const EFFECT_DENY = 'Deny';

const generatePolicy = (userId, effect, resource) => {
    const authResponse = {};

    if (effect && resource) {
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        };
        //Object.assign(authResponse, { policyDocument, });
        authResponse.policyDocument = policyDocument;
    }

    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        'userId': userId,
        // NOTE: could pass email/name/etc..
    };
    // These keys can be accessed in the backend Lambda function as part of the input event
    // $event.requestContext.authorizer.<key>.
    // BUT their values are stringified, for example, "stringval", "123", or "true", respectively.

    return authResponse;
};
