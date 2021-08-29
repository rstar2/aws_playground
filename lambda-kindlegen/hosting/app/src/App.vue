<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/kindle.png" class="logo" />

    <Auth @change="onAuth" />


    <FileSelect
      :disabled="isConverting"
      @select="onFileSelect"
      class="fileselect"
    >
      <p v-if="isConverting">Converting {{ file.name }} <Spinner/></p>
      <p v-else>
        Drag your file here
        <br />
        or click to browse

        <br />
        {{ file && file.name }}
      </p>
    </FileSelect>

    <Button @click="convert" :disabled="!canConvert"> Convert </Button>
  </div>
</template>

<script>
import Spinner from './components/Spinner.vue';
import Button from './components/Button.vue';
import Auth from './components/Auth.vue';
import FileSelect from './components/FileSelect.vue';

import { convert } from "./services/convert.js";

export default {
  components: {
    Spinner,
    Button,
    Auth,
    FileSelect,
  },
  data() {
    return {
      /**
       * The authenticated/logged-in state
       */
      isAuth: false,

      /**
       * Selected file
       * @type {File}
       */
      file: undefined,

      /**
       * The converting state
       */
      isConverting: false,
    };
  },
  computed: {
    canConvert() {
      return this.isAuth && this.file && !this.isConverting;
    }
  },
  methods: {
    onAuth(isAuth) {
      this.isAuth = isAuth;
    },
    onFileSelect(file) {
      this.file = file;
    },
    convert() {
      this.isConverting = true;
      const file = this.file;
      convert(file)
        .then(() => {
          console.log(`Convert ${this.file.name} finished`);
        })
        .catch(err => {
          // TODO: show error
          console.error(`Convert ${this.file.name} failed`, err);
        })
        .then(() => this.reset());
    },
    reset() {
      this.file = undefined;
      this.isConverting = false;
    }
  }
};
</script>

<style>
:root {
  --margin: 60px;
  --background-color: #101010;
  --color-white: #fff;
  --text-color: #fff;
  --color-black: #030303;
  --secondary-text-color: #fff;
  --font-size: 16px;
  --line-height: 26px;
  --header-height: 48px;
  --panel-width: 300px;
  --panel-padding: 16px;
  --icon-size: 20px;

  --light: #232423;
  --dark: #161616;
}

html,
body {
  margin: 0;
  padding: 0;
}
body {
  background-color: var(--background-color);
  color: var(--text-color);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: var(--margin) var(--margin) 0 var(--margin);
}

.logo {
  width: 180px;
  position: absolute;
  top: 10px;
  left: -15px;
}
.fileselect {
  margin: 20px 0;
}
</style>
