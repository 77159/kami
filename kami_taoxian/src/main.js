// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/*配置路由*/
import Vue from 'vue'
import App from './App'
import router from './router'
import VueClipboard from 'vue-clipboard2'

import lrz from 'lrz';

import {Toast,Popup,Loadmore,Picker, MessageBox} from 'mint-ui';
import 'mint-ui/lib/style.min.css'

Vue.component(Toast);
Vue.config.productionTip = false;
Vue.component(Popup.name, Popup);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Picker.name, Picker);
Vue.component(MessageBox.name, MessageBox);

Vue.use(VueClipboard)


/* eslint-disable no-new */
var vm=new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
export default vm;
