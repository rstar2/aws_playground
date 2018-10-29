## Create User Pool
....

## Create User Pool Client app
....


## Stack Outputs
UserPoolClientId: 3nnu6s2t0se8jmo1lppirdp5t8
UserPoolId: eu-central-1_3UwYWOxmP
ApiLambdaFunctionQualifiedArn: arn:aws:lambda:eu-central-1:592755008084:function:my-auth-congnito-amplify-dev-api:3
IdentityPoolId: eu-central-1:5cbd3c7e-1eb1-4c6e-b3e8-d346223fd500
ServiceEndpoint: https://0lay1skif0.execute-api.eu-central-1.amazonaws.com/dev
ServerlessDeploymentBucketName: my-auth-congnito-amplify-serverlessdeploymentbuck-17ptbmacwa55b

## Create a test user to the pool.
1. Using the AWS Console for Cognito User pool

2. Using the AWS CLI
```
aws cognito-idp sign-up \
  --profile aws-cli \
  --region eu-central-1 \
  --client-id 3nnu6s2t0se8jmo1lppirdp5t8 \
  --username sls@test.com \
  --password Passw0rd!
```

Confirm the newly created user:
```
aws cognito-idp admin-confirm-sign-up \
  --profile aws-cli \
  --region eu-central-1 \
  --user-pool-id eu-central-1_3UwYWOxmP \
  --username sls@test.com
```

## Test
1. Try 
```
$ npm install -g aws-api-gateway-cli-test
$ apig-test \
--username='sls@test.com' \
--password='Passw0rd!' \
--user-pool-id='eu-central-1_3UwYWOxmP' \
--app-client-id='3nnu6s2t0se8jmo1lppirdp5t8' \
--cognito-region='eu-central-1' \
--identity-pool-id='eu-central-1:5cbd3c7e-1eb1-4c6e-b3e8-d346223fd500' \
--invoke-url='https://0lay1skif0.execute-api.eu-central-1.amazonaws.com/dev' \
--path-template='/api/test' \
--method='GET' \
--api-gateway-region='eu-central-1'
```

### For Windows 
```
$ npx apig-test --username sls@test.com --password Passw0rd! --user-pool-id eu-central-1_3UwYWOxmP --app-client-id 3nnu6s2t0se8jmo1lppirdp5t8 --cognito-region eu-central-1 --identity-pool-id eu-central-1:5cbd3c7e-1eb1-4c6e-b3e8-d346223fd500 --invoke-url https://0lay1skif0.execute-api.eu-central-1.amazonaws.com/dev --path-template /api/test --api-gateway-region eu-central-1
```