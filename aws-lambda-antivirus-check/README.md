# Setup NPM
```
$ npm init
$ npm i -D aws-sdk
```


# Setup ClamAV (Unix only)
## Use Docker and an Amazon Linux image ('amazonlinux")
```
$ ./build_clamav.sh
```



# Setup Serverless
```
$ sls create -t aws-nodejs --name my-antivirus-check
$ sls deploy
```

### Inspired by https://blog.truework.com/2018-07-09-s3-antivirus-lambda-function/