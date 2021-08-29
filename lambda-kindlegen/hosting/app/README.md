## Use Vite with Vue2

https://www.mathew-paul.nz/posts/how-to-use-vue2-with-vite/
https://medium.com/nerd-for-tech/from-vue-cli-to-vitejs-648d2f5e031d

1. Create a Vite app with the template for Vue3

```npm init vite@latest my-vue-app -- --template vue```

1. Install Vue2 and needed plugin for Vite

```npm install vite-plugin-vue2 vue@2```

1. Fix the main.js to use Vue2 syntax

```js
import Vue from 'vue';
import App from './App.vue';

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

1. Fix xxx.vue component files to use Vue2 syntax

1. Fix vite.config.js

```js
const { createVuePlugin } = require('vite-plugin-vue2');

module.exports = {
  plugins: [createVuePlugin()],
};
```

## Make "optional" customizations to the Vite configuration

1. The output dist folder to be one level up

## Local dev

```npm run dev```

## Build

```npm run build```
