import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import './md.css';

/**
 * This is the main Vue Material plugin
 */
export default {
    install(Vue) {
        Vue.use(VueMaterial);
    },
};
