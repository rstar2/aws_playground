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
                	<md-button @click="dialogAuth.isRegister = true; dialogAuth.show = true;" class="md-primary md-raised">Register</md-button>
                	<md-button @click="dialogAuth.isRegister = false; dialogAuth.show = true;" class="md-primary md-raised">Login</md-button>
				</template>
            </div>
        </md-toolbar>

        <md-button @click="doApiWithAmplify(true)" class="md-primary md-raised">API GET (Amplify)</md-button>
        <md-button @click="doApiWithAmplify(false)" class="md-primary md-raised">API POST (Amplify)</md-button>
		<md-button @click="doApiWithDirectHTTP(true)" class="md-secondary md-raised">API GET (direct HTTP)</md-button>
		<md-button @click="doApiWithDirectHTTP(false)" class="md-secondary md-raised">API POST (direct HTTP)</md-button>
    
        <app-dialog-auth v-model="dialogAuth.show" :isRegister="dialogAuth.isRegister" @action="doAuth">
        </app-dialog-auth>

        <app-notifications v-model="info"></app-notifications>
    </div>
</template>

<script>
import * as auth from "./services/auth-amplify";

import { api as apiAmplify } from "./services/api-amplify";
import { api as apiHttp } from "./services/api-http";

import DialogAuth from "./components/DialogAuth";
import Notifications from "./components/Notifications";

export default {
  components: {
    "app-dialog-auth": DialogAuth,
    "app-notifications": Notifications
  },
  data() {
    return {
      // describes the current list
      // describes the notification result info to show (e.g. result of the api call)
      info: null,

      authJWT: null,

      dialogAuth: {
        show: false,
        isRgister: false
      }
    };
  },
  computed: {
    auth() {
      return !!this.authJWT;
    }
  },
  watch: {},
  methods: {
    doLogout() {
      auth.logout().then(() => (this.authJWT = null));
    },
    doAuth(user) {
      let action;
      if (this.dialogAuth.isRegister) {
        action = auth.register(user.email, user.password);
      } else {
        action = auth.login(user);
      }
      action
        .then(token => {
          if (!token) throw "Failed auth";
          return token;
        })
        .then(token => (this.authJWT = token))
        .then(
          data =>
            (this.info = this.dialogAuth.isRegister
              ? "Registered"
              : "Logged in")
        )
        .catch(data => {
          // error response must be of the form { error: 'xxxxx' }
          this.info =
            (data && data.error) ||
            (this.dialogAuth.isRegister
              ? "Failed to register"
              : "Failed to login");
        });
    },

    doApiWithAmplify(isGET) {
      const api = isGET
        ? apiAmplify("/test-get")
        : apiAmplify("/test-post", { a: 1 });
      api
        .then(data => (this.info = data.message))
        .catch(() => (this.info = "Failed API Test"));
    },

    doApiWithDirectHTTP(isGET) {
      // call the API Gateway with IAM Auth directly (we need to sign the request)
      const api = isGET
        ? apiHttp("/test-get")
        : apiHttp("/test-post", { a: 1 });
      api
        .then(data => (this.info = data.message))
        .catch(() => (this.info = "Failed API Test"));
    }
  },
  mounted() {
    auth.getToken().then(token => (this.authJWT = token));
  }
};
</script>

<style>
@import "./styles.css";
</style>

