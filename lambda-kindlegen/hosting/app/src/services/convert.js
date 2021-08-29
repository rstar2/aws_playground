import auth from "./auth.js";

// get env variable from Vite (e.g. specified in .env)
const GET_UPLOAD_URL = import.meta.env.VITE_GET_UPLOAD_URL;
const GET_DOWNLOAD_URL = import.meta.env.VITE_GET_DOWNLOAD_URL;

export async function convert(file) {
    const name = file.name;
    console.log(`Convert ${name}`);
    await wait(10000)

    // generate a presigned url for uploading to S3
    const getUploadSignedURL = new URL(GET_UPLOAD_URL);
    getUploadSignedURL.search = new URLSearchParams({ name }).toString();
    const auth = await getAuthorization();
    const { signedURL: uploadSignedURL } = await fetch(getUploadSignedURL, {
        method: "GET",
        ...auth,
    })
        .then((res) => {
            if (!res.ok) {
                return res.json().then(({ error }) => Promise.reject(error));
            }
            return res;
        })
        .then((res) => res.json());

    // upload to S3
    await fetch(uploadSignedURL, {
        method: "PUT",
        body: file,
    });

    // generate a presigned url for downloading from S3
    const getDownloadSignedURL = new URL(GET_DOWNLOAD_URL);
    getDownloadSignedURL.search = new URLSearchParams({
        name: name + ".mobi",
    }).toString();
    const downloadSignedURL = await pollForDownloadSignedURL(
        getDownloadSignedURL
    );

    // download from S3
    window.open(downloadSignedURL, "_blank");
}

async function wait(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 *
 * @param {URL} getDownloadSignedURL
 * @return {Promise<string>}
 */
async function pollForDownloadSignedURL(getDownloadSignedURL) {
    const maxTime = Date.now() + 2 * 60 * 1000; // 2 minutes
    const period = 10 * 1000; // 10 seconds polling

    do {
        await wait(period);
        try {
            const auth = await getAuthorization();
            const { signedURL } = await fetch(getDownloadSignedURL, {
                method: "GET",
                ...auth,
            })
                .then((res) => {
                    if (!res.ok) {
                        return res
                            .json()
                            .then(({ error }) => Promise.reject(error));
                    }
                    return res;
                })
                .then((res) => res.json());

            // if it's available then return it
            if (signedURL) return signedURL;
        } catch (err) {
            // continue with next poll iteration
        }
    } while (Date.now() <= maxTime);

    throw new Error("Could not generate a signedURL for downloading");
}

/**
 * @return {{headers: any}|undefined}
 */
async function getAuthorization() {
    // pass Authorization header and use lambda authorizer
    const token = await auth.getIdToken();
    return token
        ? {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
        : undefined;
}
