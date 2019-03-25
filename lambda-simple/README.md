### Using serverless-cli

# Create AWS IAM user with permissions and access key/secret
1. This is in AWS portal
2. Next configure the serverless cli
```
$ sls config credentials --provider aws --key XXXX --secret YYYY
```

# Create a NodeJS template using serverless-cli
```
$ sls create --template aws-nodejs
```

#  Update the serverless.yml file 
1. Change the service.name
2. Change the provider.region and provider.stage

# Deploy the project
```
$ sls deploy
```

# Test
Assuming a function is called "my-demo-simple" in serverless.yml. Note more than 1 function can be configured for a stack/project

1. This will invoke a deployed function
```
$ sls invoke --function my-demo-simple
```
2. This will invoke the function locally
```
$ sls invoke local --function my-demo-simple
```

# Integrate it with API Gateway (e.g attach HTTP endpoint to it)

1. Update serverless.yml(attach HTTP event to the function-handler events):
    ```
    ...
    functions:
        my-demo-simple:
            handler: handler.handle
            events:
                - http:
                    path: execute
                    method: get
                ....
    ```
2. Deploy again
    ```
    $ sls deploy
    ```

    As result AWS Lambda (through serverless-cli) will generate a real HTTP endpoint for triggering the function, for example : _https://wc3kc8ltne.execute-api.eu-central-1.amazonaws.com/dev/execute_
    Note it has also the stage inside (in ths case 'dev')

# Integrate with other AWS services
1. Add resources (CloudFormation resources)


# Setup environment variables (for usage later in the functions)
1. Global environment variables:

```
provider:
  ...

  # these env-variables will be global for all functions
  environment:
    GOOGLE_MAPS_API_KEY: XXXYYY111ZZZZ
```

1. Function local environment variables:
```
functions:
  my-demo-simple:
    handler: ...
    events:
      ...

    # Visible only for the specific function
    environment:
      OTHER_API_KEY: XXX111ZZZ

```    