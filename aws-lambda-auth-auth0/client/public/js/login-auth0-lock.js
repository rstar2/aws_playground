/* globals Auth0Lock */

const lock = new Auth0Lock(process.env.AUTH0_API_APP_CLIENT_ID, process.env.AUTH0_API_APP_DOMAIN ,
    {
        autoclose: true,
        auth: {

            redirectUrl: '#{env.AUTH0_CALLBACK_URL}',
            params: {
                responseType: 'code',
                audience: process.env.AUTH0_API_JWT_AUDIENCE
            }
        }
    });
lock.show();
