import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { useKakao } from 'vue3-kakao-maps/@utils';

import router from "./router";

const app = createApp(App);

const apiKey = process.env.VUE_APP_KAKAO_MAP_KEY
useKakao(apiKey);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

const vuetify = createVuetify({
    components,
    directives,
});

app.use(router).use(vuetify).mount("#app");
