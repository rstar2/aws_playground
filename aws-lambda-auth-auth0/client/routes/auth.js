const request = require('request');

const AUTH0_API_JWT_AUDIENCE = process.env.AUTH0_API_JWT_AUDIENCE;
const AUTH0_API_APP_CLIENT_ID = process.env.AUTH0_API_APP_CLIENT_ID;
const AUTH0_API_APP_CLIENT_SECRET = process.env.AUTH0_API_APP_CLIENT_SECRET;
const AUTH0_API_APP_DOMAIN = process.env.AUTH0_API_APP_DOMAIN;



module.exports = (app) => {

    // Example with express-passport-auth
    // https://github.com/auth0-samples/auth0-nodejs-webapp-sample/tree/embedded-login/01-Embedded-Login

    // Example for bworser-client authentication through Auth0 (not using Auth0 Lock widget, but the Auth0 hosted login page)
    // https://egghead.io/lessons/express-authenticate-users-in-a-single-page-application-with-auth0

    // TODO:
    app.post('/register', (req, res) => {
        // axios.post('https://reliabitaly.eu.auth0.com/dbconnections/signup', {
        //     client_id: 'xx',
        //     email: req.body.email,
        //     password: req.body.password,
        //     connection: 'auth0Username-Password-Authentication'
        // }).then((response) => {
        //     // here we are! user profile data
        //     console.log('Newly registered user');
        //     res.send({ auth: true, token, });
        // }).catch(error => res.status(500).send({ auth: false, error: '' + error }));
    });

    // Our custom login
    app.post('/login', (req, res) => {
        // get passed username/passwords
        const { username, password } = req.body;

        // Implement the Auth0 Resource Owner Password Grant
        // Docs - https://auth0.com/docs/api-auth/tutorials/password-grant
        // Example - https://blog.cloudboost.io/auth0-expressjs-jwt-and-custom-methods-83c8c3e5e914
        const options = {
            method: 'POST',
            url: `https://${AUTH0_API_APP_DOMAIN}/oauth/token`,
            headers: { 'content-type': 'application/json' },
            body: {
                grant_type: 'password',
                client_id: AUTH0_API_APP_CLIENT_ID,
                client_secret: AUTH0_API_APP_CLIENT_SECRET,

                audience: AUTH0_API_JWT_AUDIENCE,
                scope: 'read:all openid', // possible scopes - it's configured in the Auth0 API
                // if 'openid' is present Auth0 will standard scopes such as openid profile email address phone

                username,
                password,

            },
            json: true
        };


        request(options, (error, httpResponse, body) => {
            if (error) {
                res.status(500).send({ auth: false, error: '' + error });
                return;
            }

            // check if the returned response is not an error
            if (body.error) {
                res.status(500).send({ auth: false, error: '' + (body.error_description || body.error) });
                return;
            }

            res.status(200).send({ auth: true, token: body.access_token });
        });
    });

    // Authorize on behalf of the client - e.g when we just want to get JWT access token
    // actual check for user credentials are optional and can be done if necessary
    // Actually this means that access to the protected API (in this case the AWS Lambda) can be got only from this server
    // as only it knows the AUTH0_API_APP_CLIENT_ID and AUTH0_API_APP_CLIENT_SECRET with which it can issue a JWT access token
    app.get('/auth', (req, res) => {
        const options = {
            method: 'POST',
            url: `https://${AUTH0_API_APP_DOMAIN}/oauth/token`,
            headers: { 'content-type': 'application/json' },
            body: {
                grant_type: 'client_credentials',
                client_id: AUTH0_API_APP_CLIENT_ID,
                client_secret: AUTH0_API_APP_CLIENT_SECRET,

                audience: AUTH0_API_JWT_AUDIENCE,
                scope: 'read:all', // possible scopes - it's configured in the Auth0 API
                // cannot have 'openid' when grant_type is  'client_credentials'
            },
            json: true
        };

        request(options, (error, httpResponse, body) => {
            if (error) {
                res.status(500).send({ auth: false, error: '' + error });
                return;
            }

            // check if the returned response is not an error
            if (body.error) {
                res.status(500).send({ auth: false, error: '' + (body.error_description || body.error) });
                return;
            }

            res.status(200).send({ auth: true, token: body.access_token });
        });
    });
};
