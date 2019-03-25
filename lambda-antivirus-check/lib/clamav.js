const fs = require('fs');
const execSync = require('child_process').execSync;
const path = require('path');

const AWS = require('aws-sdk');

const constants = require('./config');
const util = require('./util');

const S3 = new AWS.S3();

/**
 * Updates the definitions using freshclam.
 *
 * It will download the definitions to the current work dir.
 */
function updateAVDefinitions() {
    try {
        util.logSystem('Update with freshclam');

        // execSync(`chmod o+x ${constants.PATH_TO_FRESHCLAM}`);
        const executionResult = execSync(`${constants.PATH_TO_FRESHCLAM} --config-file=${constants.FRESHCLAM_CONFIG} --datadir=${constants.FRESHCLAM_WORK_DIR}`);

        util.log(executionResult.toString());
        if (executionResult.stderr) {
            util.log('stderr');
            util.log(executionResult.stderr.toString());
        }

        return true;
    } catch (err) {
        util.log(err);
        return false;
    }
}

/**
 * Download the Antivirus definition from S3.
 * The definitions are stored on the local disk, ensure there's enough space.
 */
function downloadAVDefinitions() {
    util.logSystem('Downloading definition files');

    util.ensureExistFolder(constants.FRESHCLAM_WORK_DIR);

    const downloadPromises = constants.CLAMAV_DEFINITIONS_FILES.map((filenameToDownload) => {
        return new Promise((resolve, reject) => {
            const destinationFile = path.join(constants.FRESHCLAM_WORK_DIR, filenameToDownload);

            // flag 'w+' means it will be created if not exist (and truncated if exists)
            const localFileWriteStream = fs.createWriteStream(destinationFile, { flags: 'w+' });

            const options = {
                Bucket: constants.CLAMAV_BUCKET_NAME,
                Key: `${constants.PATH_TO_AV_DEFINITIONS}/${filenameToDownload}`,
            };

            util.logSystem(`Downloading ${filenameToDownload} from S3 to ${destinationFile}`);
            S3.getObject(options).createReadStream()
                .on('end', function () {
                    util.logSystem(`Finished download ${filenameToDownload}`);
                    resolve();
                })
                .on('error', function (err) {
                    util.logSystem(`Error downloading definition file ${filenameToDownload}`);
                    util.log(err);
                    reject();
                })
                .pipe(localFileWriteStream);
        });
    });

    return Promise.all(downloadPromises);
}

/**
 * Uploads the AV definitions to the S3 bucket.
 */
function uploadAVDefinitions() {
    util.logSystem('Uploading definition files');

    const uploadPromises = constants.CLAMAV_DEFINITIONS_FILES.map((filenameToUpload) => {
        return new Promise((resolve, reject) => {
            util.logSystem(`Uploading ${filenameToUpload}`);

            let options = {
                Bucket: constants.CLAMAV_BUCKET_NAME,
                Key: `${constants.PATH_TO_AV_DEFINITIONS}/${filenameToUpload}`,
                Body: fs.createReadStream(path.join(constants.FRESHCLAM_WORK_DIR, filenameToUpload))
            };

            S3.putObject(options, function (err) {
                if (err) {
                    util.logSystem(`Error uploading ${filenameToUpload}`);
                    util.log(err);
                    reject();
                    return;
                }

                util.logSystem(`Finished uploading ${filenameToUpload}`);
                resolve();
            });

        });
    });

    return Promise.all(uploadPromises);
}

/**
 * Function to scan the given file. This function requires ClamAV and the definitions to be available.
 * This function does not download the file so the file should also be accessible.
 *
 * Three possible case can happen:
 * - The file is clean, the clamAV command returns 0 and the function return "CLEAN"
 * - The file is infected, the clamAV command returns 1 and this function will return "INFECTED"
 * - Any other error and the function will return null; (falsy)
 *
 * @param pathToFile Path in the filesystem where the file is stored.
 */
function scanLocalFile(pathToFile) {
    util.logSystem(`Scanning ${pathToFile}`);

    // execSync(`chmod o+x ${constants.PATH_TO_CLAMAV}`);

    try {
        execSync(`${constants.PATH_TO_CLAMAV} -v -a --stdout -d ${constants.FRESHCLAM_WORK_DIR} ${pathToFile}`);

        util.logSystem('SUCCESSFUL SCAN, FILE CLEAN');

        return constants.STATUS_CLEAN_FILE;
    } catch (err) {
        // Error status 1 means that the file is infected.
        if (err.status === 1) {
            util.logSystem('SUCCESSFUL SCAN, FILE INFECTED');
            return constants.STATUS_INFECTED_FILE;
        }

        util.logSystem('SCAN FAILED');
        util.log(err);
        return constants.STATUS_ERROR_PROCESSING_FILE;
    }
}

module.exports = {
    updateAVDefinitions,
    downloadAVDefinitions,
    uploadAVDefinitions,
    scanLocalFile,
};