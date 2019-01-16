<template>
  <Page>
    <ActionBar title="Dialogs"/>
    <StackLayout>
      <Button
        v-for="(dialog, index) in dialogs"
        :key="index"
        @tap="createDialog(dialog)"
      >{{ dialog }}</Button>
    </StackLayout>
  </Page>
</template>

<script>
import * as Toast from "nativescript-toast";
const dialogs = require("tns-core-modules/ui/dialogs");

export default {
  data() {
    return {
      dialogs: ["Action", "Alert", "Confirm", "Login", "Prompt"]
    };
  },
  methods: {
    createDialog(type) {
      switch (type) {
        case "Action":
          action("Action Dialog", "Cancel button", ["Do this", "Do that"]).then(
            result => {
              this.log(result);
            }
          );
          break;
        case "Alert":
          alert({
            title: "Alert Title!",
            message: "Alert message",
            okButtonText: "Okay Button Text"
          }).then(() => {
            this.log("Alert dialog closed");
          });
          break;
        case "Confirm":
          confirm({
            title: "Confirmation",
            message: "Are you sure?",
            okButtonText: "Yes! Absolutely.",
            cancelButtonText: "Nah!"
          }).then(result => {
            console.log(result);
            this.log(result);
          });
          break;
        case "Login":
          login({
            title: "Login!",
            message: "Please login to continue!",
            okButtonText: "Login",
            cancelButtonText: "Someother Time!",
            userName: "Username",
            password: "Password"
          }).then(result => {
            console.log(
              `Dialog result: ${result.result}, user: ${
                result.userName
              }, pwd: ${result.password}`
            );
          });
          break;
        case "Prompt":
          prompt({
            title: "Email Prompt",
            message: "Provide your email address:",
            okButtonText: "OK",
            cancelButtonText: "Cancel",
            defaultText: "name@domain.com",
            inputType: dialogs.inputType.email
          }).then(result => {
            console.log(
              `Dialog result: ${result.result}, text: ${result.text}`
            );
          });
          break;
      }
    },
    log(string) {
      Toast.makeText(string.toString()).show();
      console.log(string);
    }



// log(string) {
//       Toast.makeText(string.toString()).show();
//       console.log(string);
//     },
//     fetchLocation() {
//       console.log("lets get your location");
//       geolocation
//         .getCurrentLocation({
//           desiredAccuracy: Accuracy.high,
//           maximumAge: 1000,
//           timeout: 20000
//         })
//         .then(res => {
//           let lat = res.latitude;
//           let lng = res.longitude;
//           this.log("lat-> " + lat + "| long-> " + lng);
//         })
//         .catch(e => {
//           console.log("oh frak, error", e);
//         });
//     },

  }
};
</script>

<style>
</style>
