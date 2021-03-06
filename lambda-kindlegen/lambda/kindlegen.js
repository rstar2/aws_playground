const { spawnSync, execSync } = require('child_process');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const path = require('path');

const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const kindlegen = async (record) => {
    // get the file
    const s3Object = await s3
        .getObject({
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key
        })
        .promise();

    const inFilePath = `/tmp/${record.s3.object.key}`;

    // replace the extension (if any) with '.mobi'
    const outFilePath = path.join(path.dirname(inFilePath),
        path.basename(inFilePath, path.extname(inFilePath)) + '.mobi');

    // console.log('inFilePath:', inFilePath);
    // console.log('outFilePath:', outFilePath);

    // write file to disk
    writeFileSync(inFilePath, s3Object.Body);

    // convert using KindleGen
    try {
        const child_process = spawnSync(
            '/opt/qemu-i386-static',
            [
                '/opt/kindlegen',
                inFilePath,
            ],
            { stdio: 'inherit' }
        );
        // const child_process = execSync(
        //     `/opt/kindlegen ${inFilePath}`,
        //     { stdio: 'inherit' }
        // );
        // console.log('kindlegen result:', child_process );

    } catch (e) {
        console.error('kindlegen failed', e);
    }
    execSync('ls -la /tmp',{ stdio: 'inherit' });

    // read 'mobi' from disk
    const mobiFile = readFileSync(outFilePath);

    try {
        // delete the temp files
        unlinkSync(outFilePath);
        unlinkSync(inFilePath);
    } catch(e) {
        console.error(e);
    }

    // upload the 'mobi' file to s3
    await s3
        .putObject({
            Bucket: record.s3.bucket.name,
            Key: `${record.s3.object.key}.mobi`,
            Body: mobiFile
        })
        .promise();
};

module.exports = kindlegen;
