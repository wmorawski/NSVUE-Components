<template>
  <Page>
    <ActionBar title="Welcome to NativeScript-Vue!"/>
    <GridLayout columns="*" rows="*">
      <Label ref="displayText" class="message" :text="msg" col="0" row="0" @tap="log"/>
    </GridLayout>
  </Page>
</template>

<script>

import { messaging, Message } from "nativescript-plugin-firebase/messaging";
import * as Toast from "nativescript-toast";
export default {
  data() {
    return {
      msg: "Hello World!"
    }
  },
  methods: {
    log() {
      console.log("clicked");
      Toast.makeText("cliked").show();
    },
    getToken() {
      let that = this;
      messaging.getCurrentPushToken().then(token => {
        console.log(`Current push token: ${token}`);
      }).catch(error=> console.log(error))
    }
  }
};
</script>

<style>
ActionBar {
  display: none;
  background-color: #53ba82;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
