// Various paths and application names on S3
const CLAMAV_BUCKET_NAME = process.env.S3_BUCKET_CLAMAV;
const PATH_TO_AV_DEFINITIONS = process.env.PATH_TO_AV_DEFINITIONS || 'freshclam';

const PATH_TO_FRESHCLAM = './freshclam';
const PATH_TO_CLAMAV = './clamscan';
const FRESHCLAM_CONFIG = 'freshclam.conf';
const FRESHCLAM_WORK_DIR = '/tmp/freshclam';
const CLAMAV_WORK_DIR = '/tmp/clamav';

// Constants for tagging file after a virus scan.
const STATUS_CLEAN_FILE = process.env.STATUS_CLEAN_FILE || 'CLEAN';
const STATUS_INFECTED_FILE = process.env.STATUS_INFECTED_FILE || 'INFECTED';
const STATUS_ERROR_PROCESSING_FILE = process.env.STATUS_ERROR_PROCESSING_FILE || 'ERROR';

const VIRUS_SCAN_STATUS_KEY = process.env.VIRUS_SCAN_STATUS_KEY || 'virusScanStatus';
const VIRUS_SCAN_TIMESTAMP_KEY = process.env.VIRUS_SCAN_TIMESTAMP_KEY || 'virusScanTimestamp';

// List of CLAMAV definition files. These are the compressed files.
const CLAMAV_DEFINITIONS_FILES = ['main.cvd', 'daily.cvd', 'bytecode.cvd'];

const EMAIL_SENDER = process.env.EMAIL_SENDER || 'rstardev@abv.bg';
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER || 'rstar2@abv.bg';


module.exports = {
    CLAMAV_BUCKET_NAME,
    PATH_TO_AV_DEFINITIONS,

    PATH_TO_FRESHCLAM,
    PATH_TO_CLAMAV,
    FRESHCLAM_CONFIG,
    FRESHCLAM_WORK_DIR,
    CLAMAV_WORK_DIR,
    CLAMAV_DEFINITIONS_FILES,

    STATUS_CLEAN_FILE,
    STATUS_INFECTED_FILE,
    STATUS_ERROR_PROCESSING_FILE,
    
    VIRUS_SCAN_STATUS_KEY,
    VIRUS_SCAN_TIMESTAMP_KEY,

    EMAIL_SENDER,
    EMAIL_RECEIVER,
};