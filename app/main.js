import Vue from 'nativescript-vue'
import HomePage from './components/HomePage'
import * as firebase from 'nativescript-plugin-firebase'
import * as Toast from "nativescript-toast";
import * as platform from 'tns-core-modules/platform'
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

// import { MapViewBase } from 'nativescript-google-maps-sdk/map-view-common';
Vue.registerElement('MapView', ()=> require('nativescript-google-maps-sdk').MapView)

if(platform.isIOS) {
  GMSServices.provideAPIKey("AIzaSyAkfRgvDld05FQn1rp-ta0v0Xlfuo5CLn8");
  // PlacePicker.iosProvideAPIKey("AIzaSyAkfRgvDld05FQn1rp-ta0v0Xlfuo5CLn8");
}

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