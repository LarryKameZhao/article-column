import axios from 'axios';
import { createApp, computed } from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';

const code = '21FDC709F2A7D980';
axios.defaults.baseURL = 'http://apis.imooc.com/api/';
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: code };
  if (config.data instanceof FormData) {
    config.data.append('icode', code);
  } else {
    config.data = { ...config.data, icode: code };
  }
  store.commit('setError', { status: false, message: '' });
  store.commit('setLoading', true);
  return config;
});
axios.interceptors.response.use(
  config => {
    setTimeout(() => {
      store.commit('setLoading', false);
    }, 100);

    return config;
  },
  e => {
    const { error } = e.response.data;
    store.commit('setError', { status: true, message: error });
    store.commit('setLoading', false);
    return Promise.reject(error);
  },
);
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
