<template>
	<div class="md-layout">
        <md-toolbar class="md-layout-item md-size-100 md-dense">
            <div class="md-toolbar-section-start">
                <h3 class="md-title">Test Auth-AWS-IAM</h3>
            </div>
            <div class="md-toolbar-section-end">
                <template v-if="auth" >
                    <md-button @click="doLogout" class="md-primary md-raised">Logout</md-button>
				</template>
				<template v-else>
                	<md-button @click="showAuth(ACTIONS.REGISTER)" class="md-primary md-raised">Register</md-button>
                	<md-button @click="showAuth(ACTIONS.LOGIN)" class="md-primary md-raised">Login</md-button>
				</template>
            </div>
        </md-toolbar>

        <md-button @click="doApiWithAmplify(true)" class="md-primary md-raised">API GET (Amplify)</md-button>
        <md-button @click="doApiWithAmplify(false)" class="md-primary md-raised">API POST (Amplify)</md-button>
		<md-button @click="doApiWithDirectHTTP(true)" class="md-secondary md-raised">API GET (direct HTTP)</md-button>
		<md-button @click="doApiWithDirectHTTP(false)" class="md-secondary md-raised">API POST (direct HTTP)</md-button>

        <app-dialog-auth v-model="dialogAuth.show" :action="dialogAuth.action" :userShow="dialogAuth.user" @action="doAuth"></app-dialog-auth>

        <app-notifications v-model="info"></app-notifications>
    </div>
</template>

<script>
import * as auth from "./services/auth-amplify";

import { api as apiAmplify } from "./services/api-amplify";
import { api as apiHttp } from "./services/api-http";

import DialogAuth, { ACTIONS, MixinACTIONS } from "./components/DialogAuth";
import Notifications from "./components/Notifications";

export default {
    mixins: [MixinACTIONS], // add this mixin in order to be able to access 'ACTIONS' in the tempate
    components: {
        "app-dialog-auth": DialogAuth,
        "app-notifications": Notifications
    },
    data() {
        return {
            // describes the current list
            // describes the notification result info to show (e.g. result of the API call)
            info: null,

            auth: false,

            dialogAuth: {
                show: false,
                action: ACTIONS.LOGIN,
                user: {}
            },
        };
    },
    mounted() {
        // TODO:  Listen to authorization changes - e.g. when the authorizaton expires or etc...
        auth.isAuth().then(isAuth => (this.auth = isAuth));
    },
    methods: {
        showAuth(action) {
            this.dialogAuth.action = action;
            this.dialogAuth.show = true;
        },

        doLogout() {
            auth.logout().then(() => (this.auth = false));
        },
        doAuth(user, confirmCode) {
            this.dialogAuth.user = user;

            const action = this.dialogAuth.action;

            let authAction;
            switch (action) {
                case ACTIONS.LOGIN:
                    authAction = auth.login(user).then(isAuth => (this.auth = true));
                    break;
                case ACTIONS.REGISTER:
                    authAction = auth.register(user).then(isAuth => {
                        if (isAuth) {
                            this.auth = true;
                        } else {
                            // show confirm dialog if verification is configured to be with 'CODE' (received either on phone or email)
                            this.showAuth(ACTIONS.REGISTER_CONFIRM);
                        }
                    });
                    break;
                case ACTIONS.REGISTER_CONFIRM:
                    authAction = auth
                        .registerConfirm(user, confirmCode)
                        .then(() => auth.login(user))
                        .then(isAuth => (this.auth = true));
                    break;
            }

            authAction.then(() => (this.info = this.getInfo(action))).catch(data => {
                // error response must be of the form { error: 'xxxxx' }
                this.info = (data && data.error) || this.getInfo(action, true);
            });
        },

        getInfo(action, isFailed) {
            switch (action) {
                case ACTIONS.LOGIN:
                    return isFailed ? "Failed to login" : "Logged in";
                case ACTIONS.REGISTER:
                    return isFailed ? "Failed to register" : "Registered";
                case ACTIONS.REGISTER_CONFIRM:
                    return isFailed
                        ? "Failed to confirm register"
                        : "Confirmed registration";
            }
        },

        doApiWithAmplify(isGET) {
            const api = isGET
                ? apiAmplify("/api/test-get")
                : apiAmplify("/api/test-post", { a: 1 });
            api
                .then(data => (this.info = data.message))
                .catch(() => (this.info = "Failed API Test"));
        },

        doApiWithDirectHTTP(isGET) {
            // call the API Gateway with IAM Auth directly (we need to sign the request)
            const api = isGET
                ? apiHttp("/api/test-get")
                : apiHttp("/api/test-post", { a: 1 });
            api
                .then(data => (this.info = data.message))
                .catch(() => (this.info = "Failed API Test"));
        }
    }
};
</script>

<style>
@import "./styles.css";
</style>

