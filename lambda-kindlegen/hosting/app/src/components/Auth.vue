<template>
  <div>
    <Button v-if="!isAuth" @click="login"> Login </Button>
    <Button v-else @click="logout"> Logout </Button>
  </div>
</template>

<script>
import Button from './Button.vue';

import auth from "../services/auth.js";

export default {
  components: {
    Button,
  },
  data() {
    return {
      isAuth: false
    };
  },
  mounted() {
      auth.init()
        .then(isAuth => {
          this.isAuth = isAuth;
          this._notify();
        });
    },
  methods: {
    login() {
      auth.login()
        .then(() => {
          this.isAuth = true;
          this._notify();
        });
    },
    logout() {
      auth.logout()
        .then(() => {
          this.isAuth = false;
          this._notify();
        });

    },

    _notify() {
      this.$emit("change", this.isAuth);
    }
  }
}
</script>
