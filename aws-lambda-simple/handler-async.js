'use strict';

module.exports.main = async (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: `Go Serverless v1.0! ${(await message({ time: 1, msg: 'Function executed successfully!' }))}`,
        }),
    };

    callback(null, response);
};

const message = ({ time, ...rest }) => new Promise((resolve, reject) =>
    setTimeout(() => {
        resolve(`${rest.msg} (with a delay)`);
    }, time * 1000)
);
