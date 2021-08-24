# Deploy to AWS

## Deploy the 'Layer' first

```bash
cd layer && sls deploy
```

## Deploy the 'Lambda' after that

```bash
cd lambda && sls deploy
```

## Deploy the static client app

```bash
cd hosting && sls deploy
```

It will sync local directories and S3 prefixes.

```bash
sls remove --nos3sync
```

can be used when removing the stack without removing S3 objects from the target S3

## Why use qemu-i386-static in the Layer?

The 'kindlegen' binary is 32 bin BUT the AWS lambda cannot run it normally.
Even though the EC2 or the Docker "awslinux" image can.
So use qemu-i386-static

See https://forums.aws.amazon.com/thread.jspa?threadID=166825

## Remove the CloudFormations

This time the removal process ust be the other way around, e.g first remove the Lambda and then the Layer as the Lambda uses a reference to the Layer.
Note for the Lambda stack to be deleted the S# bucket has to be empty.
