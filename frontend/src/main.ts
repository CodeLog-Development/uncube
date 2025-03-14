import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { AuthService } from './services/authService';
import { authServiceKey } from './keys';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.provide(authServiceKey, new AuthService());

app.mount('#app');
