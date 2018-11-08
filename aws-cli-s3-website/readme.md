# AWS CLI to create a website

1. Make bucket
```
$ aws s3 md s3://<bucketName> --region <region>
```

2. Make it publicly available - e.g add AccessControlLists 'public-read' permission
```
$ aws s3api
```

3. Sync/upload contents of a local folder to the bucket - giving the files themselves the same public-read permissions as the bucket
```
$ aws s3 sync . s3://<bucketName> --acl public-read
```

4. Specify this is a "website hosting" bucket - add root-index file as well as error one if necessary
```
$ aws s3 website s3://<bucketName>/ --index-document index.html --error-document error.html
```

So **Website is accessible on http://<bucket-name>.s3-website-<region>.amazonaws.com**

----------

5. Getting info:
- AWS S3 Website configurations can be seen with:
```
$ aws s3api get-bucket-website --bucket <bucketName>
```
- Get the bucket region - if returned location/region is null this means 'us-east-1'
```
$ aws s3api get-bucket-location --bucket <bucketName>
```

----------

## Notes:

- If needed all commands can have --profile aws-cli in order to specify the credentials if there's no credentials or profile configured with 'aws configure'
  Also ```$ export AWS_PROFILE=aws-cli``` can be used to set such a common profile ```> set AWS_PROFILE=aws-cli``` for Windows

- If custom domain is to be added it's a MUST to name the bucket as the domain - for example 'mladostbg.com'
  See https://serverfault.com/questions/584635/no-targets-available-when-trying-to-set-alias-target-from-route-53-to-s3
  This will also allow to alias the S3 bucket in a Route53 A-record

----------

## Extra:

Example with website domain 'mladostbg.com':
So the bucket SHOULD BE named also 'mladostbg.com'.

1. Create a Route53 hosted zone
- It should be named again 'mladostbg.com'
- Add its nameservers to the DNS registrar like in GoDaddy if the domain 'mladostbg.com' is hosted registered there.
    Example: ns-864.awsdns-44.net.  ns-1858.awsdns-40.co.uk.  ns-453.awsdns-56.com.  ns-1094.awsdns-08.org
- Now a A-record set can be created (for 'mladostbg.com') that is aliased to the SAME NAMED S3 bucket - 'mladostbg.com'

2. Make it accessible on 'www.mladostbg.com':
- Create a new A-record set for 'www.mladostbg.com' that is aliased to the previous record set.
- Create a new S3 bucket that SHOULD be named again 'www.mladostbg.com' - and which is configured for the public-read access and website-hosting with redirecting to the main bucket 'mladostbg.com'

As result the website is also accessible on http://mladostbg.com and  http://www.mladostbg.com (which will just redirect with 301 to http://mladostbg.com).

2. Add SSL so we would have: https://mladostbg.com and https://www.mladostbg.com
- In AWS Certificate Manager request a new certificate for 'mladostbg.com' and 'www.mladostbg.com'. Put the needed CNAME records in Route53 - actually thw ACM should make it for us with a click of a button, but manually also can be done. The pending validation status should pass after some time (and be set to 'issued')

- S3 SSL is not possible so we should put CloudFront in front of it.
  https://www.youtube.com/results?search_query=aws+s3+ssl+certificate
  - create a AWS CloudFront Distribution with origin set to the S3 bucket
  - set the previous AWS certificate to be used for this distribution
  - point the Route53 A-record set to be alias for the CloudFront distribution and not the S3 bucket

  *NOTE!!! To use an ACM certificate with CloudFront, you must request or import the certificate in the US East (N. Virginia) region.*

