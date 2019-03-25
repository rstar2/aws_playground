import { API } from 'aws-amplify';

// call the API Gateway with IAM Auth with AWS Amplify API (with the endpoint that we registered - named 'api')
import { API_NAME } from './auth-amplify';

/**
 * @param {String} path
 * @param {Object} [data]
 * @return {Promise}
 */
export const api = (path, data) => {
    if (data) {
        // POST request
        return API.post(API_NAME, path, {
            body: JSON.stringify(data)
        });
    } else {
        // GET request
        return API.get(API_NAME, path);
    }
};

