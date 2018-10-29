
/* globals AWS_AMPLIFY */

import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';

Amplify.configure({
    // The mandatorySignIn flag for Auth is set to true because we want our users to be signed in
    // before they can interact with our app.
    Auth: Object.assign({ mandatorySignIn: true }, AWS_AMPLIFY.cognito),
    API: {
        // The single API named "api" is basically telling Amplify that we want to name our API.
        // Amplify allows you to add multiple APIs that your app is going to work with.
        // In our case our entire backend is just one single API named "api"
        endpoints: [AWS_AMPLIFY.endpoint]
    }
});


/**
 * 
 * @param {String} email 
 * @param {String} password 
 * @return {Promise}
 */
export const login = async ({ email, password }) => {
    return Auth.signIn(email, password);
};

/**
 * 
 * @param {String} email 
 * @param {String} password 
 * @return {Promise}
 */
export const register = async ({ email, password }) => {
    return Auth.signUp(email, password);
};