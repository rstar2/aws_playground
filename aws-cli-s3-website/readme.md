# AWS CLI to create a website

1. Make bucket
```
$ aws s3 md s3://<bucketName> --region <region>
```

2. Make it publicly available - e.g add AccessControlLists 'public-read' permission
```
$ aws s3api put-bucket-acl --bucket <bucketName> --acl public-read
```

3. Sync/upload contents of a local folder to the bucket - giving the files themselves the same public-read permissions as the bucket
```
$ aws s3 sync . s3://<bucketName> --acl public-read
```

4. Specify this is a "website hosting" bucket - add root-index file as well as error one if necessary
```
$ aws s3 website s3://<bucketName>/ --index-document index.html --error-document error.html
```

5. Getting info:
- AWS S3 Website configurations can be seen with:
```
$ aws s3api get-bucket-website --bucket <bucketName>
```
- Get the bucket region - if returned location/region is null this means 'us-east-1'
```
$ aws s3api get-bucket-location --bucket <bucketName>
```

**Website is accessible on http://<bucket-name>.s3-website-<region>.amazonaws.com**

## Notes:

- If needed all commands can have --profile aws-cli in order to specify the credentials if there's no credentials or profile configured with 'aws configure'
  Also ```$ export AWS_PROFILE=aws-cli``` can be used to set such a common profile ```> set AWS_PROFILE=aws-cli``` for Windows

- If custom domain is to be added it's a MUST to name the bucket as the domain - for example 'mladostbg.com'
  See https://serverfault.com/questions/584635/no-targets-available-when-trying-to-set-alias-target-from-route-53-to-s3
  This will also allow to alias the S3 bucket in a Route53 A-record
