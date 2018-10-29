/**
 * Lambda function that will be perform the scan and tag the file accordingly.
 */

const path = require('path');
const fs = require('fs');

const AWS = require('aws-sdk');

const clamav = require('./lib/clamav');
const util = require('./lib/util');
const constants = require('./lib/config');

const s3 = new AWS.S3();
const SES = new AWS.SES();

function downloadFileFromS3(s3ObjectKey, s3ObjectBucket) {
    const downloadDir = constants.CLAMAV_WORK_DIR;

    util.ensureExistFolder(downloadDir);

    const localPath = path.join(downloadDir, path.basename(s3ObjectKey));

    const writeStream = fs.createWriteStream(localPath);

    const options = {
        Bucket: s3ObjectBucket,
        Key: s3ObjectKey,
    };

    util.logSystem(`Downloading file s3://${s3ObjectBucket}/${s3ObjectKey}`);
    return new Promise((resolve, reject) => {
        s3.getObject(options).createReadStream().on('end', function () {
            util.logSystem(`Finished downloading new object ${s3ObjectKey}`);
            resolve(localPath);
        }).on('error', function (err) {
            util.log(err);
            reject();
        }).pipe(writeStream);
    });
}

async function tagScannedFile(s3ObjectKey, s3ObjectBucket, virusScanStatus) {
    try {
        util.logSystem(`Tag scanned file ${s3ObjectKey}`);

        const taggingParams = {
            Bucket: s3ObjectBucket,
            Key: s3ObjectKey,
            Tagging: generateTagSet(virusScanStatus),
        };

        await s3.putObjectTagging(taggingParams).promise();
    } catch (err) {
        util.log(err);
    }
}

/**
 * Generates the set of tags that will be used to tag the files of S3.
 * @param virusScanStatus String representing the status.
 * @return {{TagSet: *[]}} TagSet ready to be attached to an S3 file.
 */
function generateTagSet(virusScanStatus) {
    return {
        TagSet: [
            {
                Key: constants.VIRUS_SCAN_STATUS_KEY,
                Value: virusScanStatus
            },
            {
                Key: constants.VIRUS_SCAN_TIMESTAMP_KEY,
                Value: new Date().getTime().toString()
            }
        ]
    };
}

/**
* Sends SMS to a phone (For trial accounts this 'to' must be verified email)
* @returns {Promise<SES.Types.SendEmailResponse>}
*/
async function sendEmail(s3ObjectKey, s3ObjectBucket, virusScanStatus) {
    try {
        util.logSystem(`Send email for scanned file ${s3ObjectKey}`);


        const emailParams = {
            Source: constants.EMAIL_SENDER, // SES SENDING EMAIL
            Destination: {
                ToAddresses: [
                    constants.EMAIL_RECEIVER, // SES RECEIVING EMAIL
                ],
            },
            Message: {
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: `Newly uploaded item ${s3ObjectKey} in ${s3ObjectBucket} was scanned for viruses and result is: ${virusScanStatus}`,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'S3 Upload scan for viruses report',
                },
            },
        };
        await SES.sendEmail(emailParams).promise();
    } catch (err) {
        util.log(err);
    }
}

module.exports.handle = async (event, context, callback) => {
    process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

    const s3ObjectKey = util.extractKeyFromS3Event(event);
    const s3ObjectBucket = util.extractBucketFromS3Event(event);

    await clamav.downloadAVDefinitions(constants.CLAMAV_BUCKET_NAME, constants.PATH_TO_AV_DEFINITIONS);

    const pathToFile = await downloadFileFromS3(s3ObjectKey, s3ObjectBucket);

    const virusScanStatus = clamav.scanLocalFile(pathToFile);

    await tagScannedFile(s3ObjectKey, s3ObjectBucket, virusScanStatus);

    // for the eu-central AWS is not available
    const isSesAvailable = false;

    if (isSesAvailable && virusScanStatus !== constants.STATUS_CLEAN_FILE) {
        await sendEmail(s3ObjectKey, s3ObjectBucket, virusScanStatus);
    }

    callback();
};