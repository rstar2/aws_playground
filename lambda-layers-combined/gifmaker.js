const { spawnSync } = require('child_process');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');

const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const gifmaker = async (record) => {
    // get the file
    const s3Object = await s3
        .getObject({
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key
        })
        .promise();

    // write file to disk
    writeFileSync(`/tmp/${record.s3.object.key}`, s3Object.Body);

    // convert to gif!
    spawnSync(
        '/opt/ffmpeg/ffmpeg',
        [
            '-i',
            `/tmp/${record.s3.object.key}`,
            '-f',
            'gif',
            `/tmp/${record.s3.object.key}.gif`
        ],
        { stdio: 'inherit' }
    );

    // read gif from disk
    const gifFile = readFileSync(`/tmp/${record.s3.object.key}.gif`);

    // delete the temp files
    unlinkSync(`/tmp/${record.s3.object.key}.gif`);
    unlinkSync(`/tmp/${record.s3.object.key}`);

    // upload gif to s3
    await s3
        .putObject({
            Bucket: record.s3.bucket.name,
            Key: `${record.s3.object.key}.gif`,
            Body: gifFile
        })
        .promise();
};

module.exports = gifmaker;
