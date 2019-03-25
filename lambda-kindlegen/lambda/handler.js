
const kindlegen = require('./kindlegen');

module.exports.handle = async (event, context) => {
    if (!event.Records) {
        console.log('not an s3 invocation!');
        return;
    }

    for (const record of event.Records) {
        if (!record.s3) {
            console.log('not an s3 invocation!');
            continue;
        }
        if (record.s3.object.key.endsWith('.mobi')) {
            console.log('already a mobi file');
            continue;
        }

        await kindlegen(record);
    }
};
