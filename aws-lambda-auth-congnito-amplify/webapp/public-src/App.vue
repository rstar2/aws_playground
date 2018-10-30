<template>
	<div class="md-layout">
        <md-toolbar class="md-layout-item md-size-100 md-dense">
            <div class="md-toolbar-section-start">
                <h3 class="md-title">Test Auth-AWS-IAM</h3>
            </div>
            <div class="md-toolbar-section-end">
                <template v-if="auth" >
					<md-button @click="doApiWithAmplify" class="md-primary md-raised">API Test (Amplify)</md-button>
					<md-button @click="doApiWithDirectHTTP" class="md-primary md-raised">API Test (direct HTTP)</md-button>
                    <md-button @click="doLogout" class="md-primary md-raised">Logout</md-button>
				</template>
				<template v-else>
                	<md-button @click="dialogAuth.isRegister = true; dialogAuth.show = true;" class="md-primary md-raised">Register</md-button>
                	<md-button @click="dialogAuth.isRegister = false; dialogAuth.show = true;" class="md-primary md-raised">Login</md-button>
				</template>
            </div>
        </md-toolbar>
    
        <app-dialog-auth v-model="dialogAuth.show" :isRegister="dialogAuth.isRegister" @action="doAuth">
        </app-dialog-auth>

        <app-notifications v-model="info"></app-notifications>
    </div>
</template>

<script>
import * as auth from "./services/auth";
import { API } from "aws-amplify";

import { authenticatedHttp as http } from "./services/http";

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

    doApiWithAmplify() {
      // call the API Gateway with IAM Auth with AWS Amplify API (with the endpoint that we registered - named 'api')
      API.post("api", "/test", {
        body: JSON.stringify({ a: 1, b: "string" })
      })
        .then(data => (this.info = data.message))
        .catch(() => (this.info = "Failed API Test"));
    },

    doApiWithDirectHTTP() {
      // call the API Gateway with IAM Auth directly (we need to sign the request)
      http(AWS_AMPLIFY.api.region, AWS_AMPLIFY.api.endpoint, '/test')
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

