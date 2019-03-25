
const gifmaker = require('./gifmaker');

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
        if (record.s3.object.key.endsWith('.gif')) {
            console.log('already a gif');
            continue;
        }

        await gifmaker(record);
    }
};
