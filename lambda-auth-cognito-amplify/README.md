# Create a Serverless CloudFormation (Stack)
It will create for us
1. User Pool
2. User Pool Client
3. Federated Identities Pool

## Serverless Stack Outputs
```
$ sls info -v
```
UserPoolClientId: 2qhve4sgk14837c1svli1pbh42
UserPoolId: eu-central-1_W89fpRhEJ
ApiLambdaFunctionQualifiedArn: arn:aws:lambda:eu-central-1:592755008084:function:my-auth-cognito-amplify-dev-api:1
IdentityPoolId: eu-central-1:a3ae2586-0592-491a-b024-34e4a6a4768c
ServiceEndpoint: https://nb1wo0ea0k.execute-api.eu-central-1.amazonaws.com/dev
ServerlessDeploymentBucketName: my-auth-cognito-amplify-serverlessdeploymentbuck-1jmlfj5ps1fhd

## Create a test user in the pool.
1. Using the AWS Console for Cognito User pool

2. Using the AWS CLI
```
$ aws cognito-idp sign-up \
  --profile aws-cli \
  --region eu-central-1 \
  --client-id 2qhve4sgk14837c1svli1pbh42 \
  --username sls@test.com \
  --password Passw0rd!
```

Confirm the newly created user:
```
$ aws cognito-idp admin-confirm-sign-up \
  --profile aws-cli \
  --region eu-central-1 \
  --user-pool-id eu-central-1_W89fpRhEJ \
  --username sls@test.com
```

## Test
```
$ npm install -g aws-api-gateway-cli-test
```

1. Unix
```
$ apig-test \
--username='sls@test.com' \
--password='Passw0rd!' \
--user-pool-id='eu-central-1_W89fpRhEJ' \
--app-client-id='2qhve4sgk14837c1svli1pbh42' \
--cognito-region='eu-central-1' \
--identity-pool-id='eu-central-1:a3ae2586-0592-491a-b024-34e4a6a4768c' \
--invoke-url='https://nb1wo0ea0k.execute-api.eu-central-1.amazonaws.com/dev' \
--path-template='/api/test' \
--method='GET' \
--api-gateway-region='eu-central-1'
```

2. Windows
```
$ npx apig-test --username sls@test.com --password Passw0rd! --user-pool-id eu-central-1_W89fpRhEJ --app-client-id 2qhve4sgk14837c1svli1pbh42 --cognito-region eu-central-1 --identity-pool-id eu-central-1:a3ae2586-0592-491a-b024-34e4a6a4768c --invoke-url https://nb1wo0ea0k.execute-api.eu-central-1.amazonaws.com/dev --path-template /api/test --api-gateway-region eu-central-1
```


# TODO

## Lambda handler

1. ~~Get the authenticated user's info in the UserPool from the protected Lambda~~
    - Add Allowed policy for the Lambda to access the User Pool (e.g. "cognito-idp:AdminGetUser")
    - The call in the Lambda n"AWS.CognitoIdentityServiceProvider().adminGetUser(userPoolId, userId)",
      as before that get userPoolId and userId from the authorized cognito identity in the event's requestContext.
      Note the 'accessKey' inside is the temporary IAM user's access key - not useful in this case.

## Webapp
1. ~~Finish Register (e.g. Auth.signUp() and Auth.confirmSignUp() )~~

2. ~~Manually sign HTTP request to AWS API Gateway protected endpoints - using 'aws4'~~

- ~~Using 'aws4' package~~
```
$ npm i aws4
```
https://medium.freecodecamp.org/how-to-secure-microservices-on-aws-with-cognito-api-gateway-and-lambda-4bfaa7a6583c

- using a signVersion4.js script from
https://serverless-stack.com/chapters/connect-to-api-gateway-with-iam-auth.html

- using AWS.HttpRequest and AWS.Signers.V4 from the Amplify package
https://www.cloudspecialist.uk/2017/04/08/How-to-make-custom-IAM-authenticated-requests-to-AWS-API-Gateway/


3. Check 'aws-amplify-vue' - https://aws-amplify.github.io/docs/js/vue
```
$ npm i aws-amplify-vue
```

4. Webpack optimizations
 - ~~Use DotenvPlugin/WindowGlobalPlugin to pass the AWS_AMPLIFY_CONFIG~~
    Used alias for 'aws-amplify.config.js' to the config file and ProvidePlugin({AWS_AMPLIFY_CONFIG: 'aws-amplify.config.js'})
    https://stackoverflow.com/questions/37656592/define-global-variable-with-webpack
 - ~~Minify the index.html - HtmlWebpackPlugin (in v.4 just setting true is enough, for now it has to be defined explicitly)~~
 - Split the AWS Amplify and/or the VueJS
