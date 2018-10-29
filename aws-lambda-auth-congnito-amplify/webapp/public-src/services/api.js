// eslint-disable-next-line
const api = (url, data, authToken) => {
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

export default api;
