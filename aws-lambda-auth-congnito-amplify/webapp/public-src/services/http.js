import { Auth } from 'aws-amplify';
import * as aws4 from 'aws4';

// eslint-disable-next-line
const http = (url, data, authToken) => {
    const opts = {
        headers: {},
    };

    if (authToken) {
        Object.assign(opts.headers, {
            'Authorization': 'Bearer ' + authToken,
        });
    }

    // if sending data as JSON body must be JSON encoded string
    // AND !!! 'Content-Type' header must be valid JSON one
    if (data) {
        Object.assign(opts, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        // !!! this is obligatory for JSON encoded data so that the Express 'body-parser' to parse it properly
        Object.assign(opts.headers, {
            'Content-Type': 'application/json',
        });
    }


    return fetch(url, opts)
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => Promise.reject(err));
            }
            return res;
        })
        .then(res => res.json());
};

export default http;


// TODO:
export const authenticatedHttp = async (region, endpoint, path) => {
    const opts = {
        method: "GET",
        service: "execute-api",
        region,
        path,
        // host: apiHost,
        // headers: { "x-api-key": apiKey },
        url: endpoint + path
    }; 
    const credentials = await Auth.currentCredentials();
    const { accessKeyId, secretAccessKey, sessionToken } = credentials;
    const request = aws4.sign(opts, {
        accessKeyId,
        secretAccessKey,
        sessionToken
    });
    delete request.headers.Host;
    return fetch(opts.url, {
        headers: request.headers
    });
}