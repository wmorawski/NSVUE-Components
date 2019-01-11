import Vue from 'nativescript-vue'
import App from './components/App'
import HomePage from './components/HomePage'
import * as firebase from 'nativescript-plugin-firebase'
import * as Toast from "nativescript-toast";
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

function initializeFirebase() {
  firebase.init({
    showNotificationsWhenInForeground: true,
    onMessageReceivedCallback: (message) => {
      Toast.makeText("message received").show();
      console.log(message.toString())
    }
  }).then(() => {
    console.log('firebase initialized!!')
  })
}

new Vue({
  render: h => h('frame', [h(HomePage)])
}).$start()