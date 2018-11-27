const AuthenticationClient = require('auth0').AuthenticationClient;
const auth0 = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/auth/login-auth0-callback'
});


module.exports = (app) => {

    // https://github.com/auth0-samples/auth0-nodejs-webapp-sample/tree/embedded-login/01-Embedded-Login

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
    // });

    // Our custom login
    app.post('/login', (req, res) => {
        auth0.clientCredentialsGrant({
            audience: 'https://{YOUR_ACCOUNT}.auth0.com/api/v2/',
            scope: '{MANAGEMENT_API_SCOPES}'
        })
            .then(response => res.status(200).send({ auth: true, token: response.access_token }))
            .catch(error => res.status(500).send({ auth: false }));
    });

    // TODO: this shold open the Auth0's hosted login page
    app.get('/login-auth0', (req, res) => {
        auth0.clientCredentialsGrant({
            audience: 'https://{YOUR_ACCOUNT}.auth0.com/api/v2/',
            scope: '{MANAGEMENT_API_SCOPES}'
        })
            .then(response => res.status(200).send({ auth: true, token: response.access_token }))
            .catch(error => res.status(500).send({ auth: false }));
    });
    app.get('/login-auth0-callback', (req, res) => {

    });
};
