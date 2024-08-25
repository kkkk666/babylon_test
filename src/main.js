import Vue from 'vue'
import ElementUI from 'element-ui';
import App from './App.vue'
import '@/assets/tailwindcss.css'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')
