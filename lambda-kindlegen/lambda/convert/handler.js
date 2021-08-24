
const kindlegen = require('./kindlegen');

module.exports.onUpload = async (event, context) => {
    for (const record of event.Records) {
        if (record.s3.object.key.endsWith('.mobi')) {
            console.log('Already a mobi file');
            continue;
        }

        await kindlegen(record);
    }
};
