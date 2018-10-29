const fs = require('fs');
const { execSync }= require('child_process');

function ensureExistFolder(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
}

/**
 * Cleanup the specific folder by removing all of its content.
 */
function cleanupFolder(folderToClean) {
    if (!fs.existsSync(folderToClean)) {
        logSystem(`Folder ${folderToClean} missing - no cleanup`);
        return;
    }

    let result = execSync(`ls -l ${folderToClean}`);

    logSystem(`Folder ${folderToClean} before cleanup`);
    log(result.toString());

    execSync(`rm -rf ${folderToClean}/*`);

    result = execSync(`ls -l ${folderToClean}`);

    logSystem(`Folder ${folderToClean} after cleanup`);
    log(result.toString());
}

/**
 * Extract the key from an S3 event.
 * @param s3Event Inbound S3 event.
 * @return {string} decoded key.
 */
function extractKeyFromS3Event(s3Event) {
    let key = s3Event['Records'][0]['s3']['object']['key'];

    if (!key) {
        throw new Error('Unable to retrieve key information from the event');
    }

    return key.replace(/\+/g, ' ');
}

/**
 * Extract the bucket from an S3 event.
 * @param s3Event Inbound S3 event.
 * @return {string} Bucket
 */
function extractBucketFromS3Event(s3Event) {
    let bucketName = s3Event['Records'][0]['s3']['bucket']['name'];

    if (!bucketName) {
        throw new Error('Unable to retrieve bucket information from the event');
    }

    return bucketName;
}

/**
 * Logs a system message (simple --- the message here ---)
 * @param message Inbound message to log and generate.
 */
function logSystem(message) {
    log(`--- ${message} ---`);
}

/**
 * Logs a system message
 * @param message Inbound message to log and generate.
 */
const log = console.log;

module.exports = {
    ensureExistFolder,
    cleanupFolder,
    extractKeyFromS3Event,
    extractBucketFromS3Event,
    logSystem,
    log,
};