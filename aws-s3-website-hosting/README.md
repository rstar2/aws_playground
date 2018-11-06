# Create serverless project
```
$ sls create -t hello-world -n my-ru-mladost.life
```
The template 'hello-world' is irrelevant it's not gonna be a Lambda function - so delete the handler.js

##. Fix serverless.yml
1. Delete functions tag
2. Create a AWS::S3::Bucket Resource named 'Website' (whatever name)
  - For S3 site hosting, the AccessControl property must be set to PublicRead.
  - The WebsiteConfiguration is where we define the 'index.html' for the site
  - Typically, you don’t need to name a bucket because the CloudFormation
   generated bucket name will do but that is not the case here,
   but it will be used in configuring the AWS::Route53, so name it.
   (For the Route53 Alias record the S3 bucket name and DNS record name)
  - Grant access to the static content, we attach a permissive bucket policy
    - add access-control -> AccessControl: PublicRead
    - add proper bucket policy -> WebsiteS3BucketPolicy ...

3. Use 'serverless-s3-sync' plugin
  - Install
```
$ sls plugin install -n serverless-s3-sync
```
  - Configure it:
    - the bucket name where to sync
    - the local folder to sync (./website in this case)

4. Configure CloudFront to serve it out globally and to also that would let us handle SSL certs
https://medium.com/yld-engineering-blog/caching-in-with-cloudfront-using-serverless-5a174651ab14
https://github.com/serverless/examples/blob/master/aws-node-single-page-app-via-cloudfront/serverless.yml
https://forum.serverless.com/t/cloudfront-distribution/2027/2
https://gist.github.com/TimCoates/13b1ae454154425f7afc421707db2f86


5. Configure Route53 Record
https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html
https://github.com/ServerlessOpsIO/serverless-zombo.com/blob/master/serverless.yml

6. Configure proper SSL Certificate
TODO:
If using the site just through CloudFront domain we can use it's SSL Certificate,
but when a custom domain ("mladost.life") is in front with Route53 it must be set explicitly

## Deploy
```
$ sls deploy -v
```

## Test
Got to: http://<bucket-name>.s3-website-<AWS-region>.amazonaws.com

In this case:
```
$ sls info -v
```
Stack Outputs:
WebsiteCDNDomainName: dkn86cjfasi4h.cloudfront.net
WebsiteName: mladost.life
Region: us-east-1
ServerlessDeploymentBucketName: my-ru-mladostlife-dev-serverlessdeploymentbucket-1uye29urqy82r
WebsiteS3DomainName: mladost.life.s3-website-us-east-1.amazonaws.com

So: http://mladost.life.s3-website-us-east-1.amazonaws.com

