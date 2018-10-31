import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';

// import { AWS_AMPLIFY_CONFIG } from 'aws-amplify.config.js'
export const API_NAME = 'api';

Amplify.configure({
    // The mandatorySignIn flag for Auth is set to true because we want our users to be signed in
    // before they can interact with our app.
    Auth: Object.assign({ mandatorySignIn: true }, AWS_AMPLIFY_CONFIG.COGNITO),
    API: {
        // The single API named "api" is basically telling Amplify that we want to name our API.
        // Amplify allows you to add multiple APIs that your app is going to work with.
        // In our case our entire backend is just one single API named "api"
        endpoints: [Object.assign({ name: API_NAME }, { ...AWS_AMPLIFY_CONFIG.API, }),],
    }
});


/**
 * @param {String} email 
 * @param {String} password 
 * @return {Promise<String>}
 */
export const login = async ({ email, password }) => {
    return Auth.signIn(email, password)
        .then(data => console.dir(data) || data)
        .then(({ signInUserSession }) => signInUserSession.idToken.jwtToken)
        .catch(() => null);
};

/**
 * @param {String} email 
 * @param {String} password 
 * @return {Promise<String>}
 */
export const register = async ({ email, name, password }) => {
    return Auth.signUp(email, password);
};

/**
 * @return {Promise<String>}
 */
export const logout = async () => {
    return Auth.signOut().then(() => null);
};

/**
 * @return {Promise<String>}
 */
export const getToken = async () => {
    return Auth.currentAuthenticatedUser()
        .then(data => console.dir(data) || data)
        .then(({ signInUserSession }) => signInUserSession.idToken.jwtToken)
        .catch(() => null);
}