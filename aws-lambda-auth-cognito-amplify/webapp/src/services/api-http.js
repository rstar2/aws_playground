import { Auth } from 'aws-amplify';
import * as aws4 from 'aws4';

const { region, endpoint } = AWS_AMPLIFY.api;

// Note IE don't support "new URL()"
const { host, pathname } = new URL(endpoint);

/**
 * @param {String} path 
 * @param {Object} [data]
 * @return {Promise}
 */
export const api = async (path, data) => {
    const opts = {
        service: "execute-api",
        region,
        host,
        method: "GET",
        path: pathname + path,
    };

    if (data) {
        opts.method = "POST";
        opts.body = JSON.stringify(data);
        opts.headers = {
            'Content-Type': 'application/json; charset=UTF-8',
        };
    }

    const credentials = await Auth.currentCredentials();
    const { accessKeyId, secretAccessKey, sessionToken } = credentials;
    const request = aws4.sign(opts, {
        accessKeyId,
        secretAccessKey,
        sessionToken
    });
    delete request.headers.Host;

    return fetch(endpoint + path, {
        method: opts.method,
        body: opts.body,
        headers: request.headers,
    }).then(res => {
        if (!res.ok) {
            return res.json().then(err => Promise.reject(err));
        }
        return res;
    })
        .then(res => res.json());
}