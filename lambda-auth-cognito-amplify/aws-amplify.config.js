// these IDs are get after the Serverless Stack (e.g. CloudFormation) has been created/deployed
// using the command 'sls info -v'

const AWS_AMPLIFY_CONFIG = {
    COGNITO: {
        region: 'eu-central-1',
        userPoolId: 'eu-central-1_W89fpRhEJ',
        userPoolWebClientId: '2qhve4sgk14837c1svli1pbh42',
        identityPoolId: 'eu-central-1:a3ae2586-0592-491a-b024-34e4a6a4768c'
    },
    // only a single API endpoint is gonna be used
    API: {
        region: 'eu-central-1',
        endpoint: 'https://nb1wo0ea0k.execute-api.eu-central-1.amazonaws.com/dev',
    }
};

module.exports = AWS_AMPLIFY_CONFIG;
