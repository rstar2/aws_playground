<template>
	<div class="md-layout">
        <md-toolbar class="md-layout-item md-size-100 md-dense">
            <div class="md-toolbar-section-start">
                <h3 class="md-title">Test Auth-AWS-IAM</h3>
            </div>
            <div class="md-toolbar-section-end">
                <!-- <template v-if="auth" > -->
					<md-button @click="doApiTest" class="md-primary md-raised">API Test</md-button>
				<!-- </template> -->
				<!-- <template v-else> -->
                	<md-button @click="dialogAuth.isRegister = true; dialogAuth.show = true;" class="md-primary md-raised">Register</md-button>
                	<md-button @click="dialogAuth.isRegister = false; dialogAuth.show = true;" class="md-primary md-raised">Login</md-button>
				<!-- </template> -->
            </div>
        </md-toolbar>
    
        <app-dialog-auth v-model="dialogAuth.show" :isRegister="dialogAuth.isRegister" @action="doAuth">
        </app-dialog-auth>

        <app-notifications v-model="info"></app-notifications>
    </div>
</template>

<script>
import api from "./services/api";
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
      },
    };
  },
  computed: {
    auth() {
      return !!this.authJWT;
    }
  },
  watch: {
    authJWT(newValue) {
      // store it in cookie/localStorage (see the notes about it in mounted())
      if (newValue) localStorage.setItem("authJWT", newValue);
      else localStorage.removeItem("authJWT");
    },
  },
  methods: {
    fetch() {
		const args = Array.prototype.slice.call(arguments);
		if (args.length === 1) {
			args.push(null);
		}
		args.push(this.authJWT);
		return api.apply(null, args);
    },
    
    doAuth(user) {
      const action = this.dialogAuth.isRegister ? "register" : "login";
      this.fetch(`auth/${action}`, user)
        .then(({ token }) => (this.authJWT = token))
        .then(
          () =>
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

    doApiTest() {
      this.fetch(`${API_BASE_URL}/api/test`)
        .then(data => this.info = data.message)
        .catch(() => (this.info = "Failed API Test"));
    },

  },
  mounted() {
    // restore it from cookie/localStorage
    // It's not adviceable to store it in localStorage/sessionStorage
    // as thus it's vulnerable to XSS (injected or unintentionaly added by outself with 3rd-party library script -npm, bower, CDN)
    // It's better to be stored in HttpOnly Cookie and added a CSRF token in a header (X-XSRF-TOKEN)
    // From AngularJS https://docs.angularjs.org/api/ng/service/$http#cross-site-request-forgery-xsrf-protection
    // Cross Site Request Forgery (XSRF) Protection:
    // XSRF is an attack technique by which the attacker can trick an authenticated user into unknowingly executing actions on your website. AngularJS provides a mechanism to counter XSRF. When performing XHR requests, the $http service reads a token from a cookie (by default, XSRF-TOKEN) and sets it as an HTTP header (by default X-XSRF-TOKEN). Since only JavaScript that runs on your domain could read the cookie, your server can be assured that the XHR came from JavaScript running on your domain.
    // To take advantage of this, your server needs to set a token in a JavaScript readable session cookie called XSRF-TOKEN on the first HTTP GET request. On subsequent XHR requests the server can verify that the cookie matches the X-XSRF-TOKEN HTTP header, and therefore be sure that only JavaScript running on your domain could have sent the request. The token must be unique for each user and must be verifiable by the server (to prevent the JavaScript from making up its own tokens). We recommend that the token is a digest of your site's authentication cookie with a salt for added security.
    // The header will — by default — not be set for cross-domain requests. This prevents unauthorized servers (e.g. malicious or compromised 3rd-party APIs) from gaining access to your users' XSRF tokens and exposing them to Cross Site Request Forgery. If you want to, you can whitelist additional origins to also receive the XSRF token, by adding them to xsrfWhitelistedOrigins. This might be useful, for example, if your application, served from example.com, needs to access your API at api.example.com. See $httpProvider.xsrfWhitelistedOrigins for more details.

    //https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage
    this.authJWT = localStorage.getItem("authJWT");

    // TODO: when api request responds with Unauthorized then clear/invalidate the stored token
    //this.authJWT = null;
  }
};
</script>

<style>
@import "./styles.css";
</style>

