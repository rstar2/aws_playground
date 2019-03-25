/* globals Auth0Lock */

(() => {
    const lock = new Auth0Lock(process.env.AUTH0_API_APP_CLIENT_ID, process.env.AUTH0_API_APP_DOMAIN, {
        autoclose: true,
        allowShowPassword: true,

        // username and password sign in form only
        allowedConnections: ['Username-Password-Authentication'],
        // explicitly specify - which if 'allowedConnections' is missing the all configured will be added
        // by default in Auth0 the 'google-oauth2' connection is auto added for trying (with Auth0 Dev keys)
        // allowedConnections: ['Username-Password-Authentication', 'google-oauth2', 'twitter', 'facebook', 'linkedin'],

        auth: {
            // The URL Auth0 will redirect back to after authentication - if not set it's the current url
            // in a SPA it can be set so that it opens later a new internal SPA route
            redirectUrl: process.env.AUTH0_API_APP_REDIRECT_URL, // If not specified, defaults to the current page

            params: {
                // state: 'foo',
                scope: 'openid read:all'
            },

            // the value of responseType should be set to "token" for Single Page Applications,
            // and "code" otherwise. - if code then additional server ca
            responseType: 'token',

            // the audience this resulted signed JWT will be able to verify
            audience: process.env.AUTH0_API_JWT_AUDIENCE,
        }
    });

    // Listening for the authenticated event
    lock.on('authenticated', function (authResult) {
        // save our JWT access token
        AuthApp.setAuthToken(authResult.accessToken);

        // // Use the token in authResult to getUserInfo() and save it to localStorage
        // lock.getUserInfo(authResult.accessToken, function (error, profile) {
        //     if (error) {
        //         // Handle error
        //         return;
        //     }

        //     document.getElementById('nick').textContent = profile.nickname;
        //     localStorage.setItem('accessToken', authResult.accessToken);
        //     localStorage.setItem('profile', JSON.stringify(profile));
        // });
    });

    document.getElementById('loginAuth0_LockWidget').addEventListener('click', lock.show.bind(lock));
    // the same
    // document.getElementById('loginAuth0_LockWidget').addEventListener('click', () => {
    //     lock.show();
    // });
})();

