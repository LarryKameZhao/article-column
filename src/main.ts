import axios from 'axios';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';

const code = '21FDC709F2A7D980';
axios.defaults.baseURL = 'http://apis.imooc.com/api/';
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: code };
  return config
});
axios.get(`/columns`).then(resp => {
  console.log(resp.data);
});
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
