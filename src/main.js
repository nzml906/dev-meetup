import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App";
import * as firebase from "firebase";
import router from "./router";
import { store } from "./store";
import DateFilter from "./filters/date";
import AlertCmp from "./components/Shared/Alert.vue";

Vue.use(Vuetify);

Vue.config.productionTip = false;

Vue.filter("date", DateFilter);

Vue.component("app-alert", AlertCmp);

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyCJ74YyBmSnblooY-jbzbjU2vV57QwVOds",
      authDomain: "dev-meet-f8326.firebaseapp.com",
      databaseURL: "https://dev-meet-f8326.firebaseio.com",
      projectId: "dev-meet-f8326",
      storageBucket: "dev-meet-f8326.appspot.com",
      messagingSenderId: "821485982348",
      appId: "1:821485982348:web:1389ba2c9fbd50151061a9",
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch("autoSignIn", user);
      }
    });

    this.$store.dispatch("loadMeetups");
  },
});
