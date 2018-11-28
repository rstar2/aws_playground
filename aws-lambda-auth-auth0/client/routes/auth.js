const request = require('request');

const AUTH0_API_JWT_AUDIENCE = process.env.AUTH0_API_JWT_AUDIENCE;
const AUTH0_API_APP_CLIENT_ID = process.env.AUTH0_API_APP_CLIENT_ID;
const AUTH0_API_APP_CLIENT_SECRET = process.env.AUTH0_API_APP_CLIENT_SECRET;


module.exports = (app) => {

    // https://github.com/auth0-samples/auth0-nodejs-webapp-sample/tree/embedded-login/01-Embedded-Login
    // https://egghead.io/lessons/express-authenticate-users-in-a-single-page-application-with-auth0
    // https://scotch.io/tutorials/building-and-securing-a-modern-backend-api

    // TODO:
    // app.post('/register', (req, res) => {
    //     dbConnect()
    //         .then(db => db.register(req.body))
    //         .then(user => jwt.sign(user.id))
    //         .then(token => {
    //             console.log('Newly registered user');
    //             res.send({ auth: true, token, });
    //         })
    //         .catch(error => {
    //             console.error(error);
    //             res.status(500).send({ auth: false, error, });
    //         });

    // https://blog.cloudboost.io/auth0-expressjs-jwt-and-custom-methods-83c8c3e5e914
    //     axios.post('https://reliabitaly.eu.auth0.com/dbconnections/signup', {
    //     client_id: 'xx',
    //     email: req.body.email,
    //     password: req.body.password,
    //     connection: 'Username-Password-Authentication'
    //   }).then((response) => {
    //     // here we are! user profile data
    //   }).catch(error => next(error));
    // });

    // Our custom login
    app.post('/login', (req, res) => {
        // get passed username/passwords
        const { username, password } = req.body;


        // Implement the Auth0 Resource Owner Password Grant
        // Docs - https://auth0.com/docs/api-auth/tutorials/password-grant
        // Example - https://blog.cloudboost.io/auth0-expressjs-jwt-and-custom-methods-83c8c3e5e914
        const options = {
            method: 'POST',
            url: 'https://rstardev.eu.auth0.com/oauth/token',
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

    // TODO: this should open the Auth0's hosted login page
    app.get('/login-auth0', (req, res) => {
        auth0.clientCredentialsGrant({
            audience: 'https://{YOUR_ACCOUNT}.auth0.com/api/v2/',
            scope: '{MANAGEMENT_API_SCOPES}'
        })
            .then(response => res.status(200).send({ auth: true, token: response.access_token }))
            .catch(error => res.status(500).send({ auth: false }));
    });
    app.get('/callback', (req, res) => {

    });
};
