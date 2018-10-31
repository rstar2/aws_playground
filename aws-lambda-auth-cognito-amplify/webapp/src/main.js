import Vue from 'vue';

import VueMaterialDesign from './md';

import App from './App';

Vue.use(VueMaterialDesign);

new Vue({
    el: '#app',
    render: h => h(App),
});
