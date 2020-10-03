import Vue from 'vue';
import App from './App.vue';
import * as firebase from 'firebase';
import './registerServiceWorker';
import router from './router';
import { store } from './store';
import vuetify from './plugins/vuetify';

import DateFilter from './filters/date';
import AlertCmp from './components/Shared/Alert.vue';

Vue.config.productionTip = false;

Vue.filter('date', DateFilter);

Vue.component('app-alert', AlertCmp);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoSignIn', user);
      }
    });

    this.$store.dispatch('loadMeetups');
  }
}).$mount('#app');
