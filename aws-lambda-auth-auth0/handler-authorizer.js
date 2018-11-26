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

const jwt = require('../utils/jwt')(process.env.AUTH_JWT_SECRET);
const dbConnect = require('../lib/db-auth');

/**
 * @param {String} token
 * @param {String} resource
 * @return {Promise}
 */
const authorizeJWT = (jsonWebToken, resource) => {
    return jwt.verify(jsonWebToken)
        .then(id => {
            if (!id) throw 'No id decoded from the JWT';
            return id;
        })
        .then(id => Promise.all([id, dbConnect(),]))
        .then(([id, db,]) => db.authorize(id)
            .then(authorized => generatePolicy(id, authorized ? EFFECT_ALLOW : EFFECT_DENY, resource)));
};

const EFFECT_ALLOW = 'Allow';
const EFFECT_DENY = 'Deny';

const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {
        principalId,
    };

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
        'stringKey': 'stringval',
        'numberKey': 123,
        'booleanKey': true,
    };
    // These keys can be accessed in the backend Lambda function as part of the input event
    // $event.requestContext.authorizer.<key>.
    // BUT their values are stringified, for example, "stringval", "123", or "true", respectively.

    return authResponse;
};

const generateAllow = (principalId, resource) => {
    return generatePolicy(principalId, EFFECT_ALLOW, resource);
};

const generateDeny = (principalId, resource) => {
    return generatePolicy(principalId, EFFECT_DENY, resource);
};
