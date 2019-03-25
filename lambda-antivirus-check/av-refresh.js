/**
 * Lambda function handler that will update the definitions stored in S3.
 */

const execSync = require('child_process').execSync;

const clamav = require('./lib/clamav');
const util = require('./lib/util');
const { FRESHCLAM_WORK_DIR } = require('./lib/config');


/**
 * This function will do the following
 * 0. Cleanup the folder beforehand to make sure there's enough space.
 * 1. Download the S3 definitions from the S3 bucket.
 * 2. Invoke freshclam to download the newest definitions
 * 3. Cleanup the folders
 * 4. Upload the newest definitions to the existing bucket.
 *
 * @param event Event fired to invoke the new update function.
 * @param context
 */
module.exports.handle = async (event, context, callback) => {
    process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];
    
    util.logSystem(`AV definition update start time: ${new Date()}`);

    await util.ensureExistFolder(FRESHCLAM_WORK_DIR);
    
    await util.cleanupFolder(FRESHCLAM_WORK_DIR);

    await clamav.updateAVDefinitions();

    const result = execSync(`ls -l ${FRESHCLAM_WORK_DIR}`);

    util.logSystem(`Folder ${FRESHCLAM_WORK_DIR} after freshclam`);
    util.log(result.toString());

    await clamav.uploadAVDefinitions();

    util.logSystem(`AV definition update end time: ${new Date()}`);

    callback();
};