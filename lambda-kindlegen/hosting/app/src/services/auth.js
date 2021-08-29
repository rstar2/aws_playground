import createAuth0Client, { Auth0Client } from "@auth0/auth0-spa-js";

const AUTH0_CLIENT_ID = import.meta.env.VITE_GET_AUTH0_CLIENT_ID;
const AUTH0_DOMAIN = import.meta.env.VITE_GET_AUTH0_DOMAIN;

// internal url/route in SPA - use it for redirectUrl/logoutUrl/loginUrl
const AUTH_URL = "/";

/**
 * @type {Auth0Client}
 */
let auth0;

// TODO: Better to make it a Vue-plugin as then it will be accessible from all components
//      more easily

export default {
    /**
     *
     * @return {Promise<boolean>}
     */
    async init() {
        auth0 = await createAuth0Client({
            domain: AUTH0_DOMAIN,
            client_id: AUTH0_CLIENT_ID,

            // NOTE: the silent re-authentication is not working in Chrome with the default cookies store
            // so "localstorage" had to be used
            // see https://community.auth0.com/t/why-is-authentication-lost-after-refreshing-my-single-page-application/56276
            useRefreshTokens: true,
            cacheLocation: "localstorage",
        });

        // NEW - check for the code and state parameters
        const query = window.location.search;
        if (query.includes("code=") && query.includes("state=")) {
            // Process the login state
            await auth0.handleRedirectCallback();

            // Use replaceState to redirect the user away and remove the querystring parameters
            window.history.replaceState({}, document.title, AUTH_URL);
        }

        return this.isAuthenticated();
    },
    /**
     *
     * @return {Promise<void>}
     */
    async login() {
        // await auth0.loginWithPopup();

        // NOTE: for not the same domain (e.g. app's and auth0.com) it's better
        // to use the redirect method as some browsers lik Firefox by default block popups,
        // and it's not very nice user experience.
        // Still if CustomDomain is configured (its paid option in Auth0) the popup method is better
        await auth0.loginWithRedirect({
            redirect_uri: window.location.origin + AUTH_URL,
        });
    },
    /**
     *
     * @return {Promise<void>}
     */
    async logout() {
        auth0.logout({
            returnTo: window.location.origin + AUTH_URL,
        });
    },
    /**
     *
     * @return {Promise<boolean>}
     */
    async isAuthenticated() {
        return await auth0.isAuthenticated();
    },
    /**
     *
     * @return {Promise<TUser|undefined>}
     */
    async getUser() {
        return await auth0.getUser();
    },
    /**
     *
     * @return {Promise<string|undefined>}
     */
    async getIdToken() {
        const idTokenClaims = await auth0.getIdTokenClaims();

        return idTokenClaims?.__raw;
    }
};
