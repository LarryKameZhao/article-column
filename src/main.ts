import axios from 'axios';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';

const code = '21FDC709F2A7D980';
axios.defaults.baseURL = 'http://apis.imooc.com/api/';
axios.interceptors.request.use(config => {
  store.commit('setLoading', true);
  config.params = { ...config.params, icode: code };
  return config;
});
axios.interceptors.response.use(config => {
  setTimeout(() => {
    store.commit('setLoading', false);
  }, 200);

  return config;
});
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
