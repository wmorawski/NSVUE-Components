<template>
  <Page>
    <StackLayout>
      <button @tap="pickPlace">Pick Place</button>
    </StackLayout>
  </Page>
</template>

<script>
import * as GooglePlaces from "nativescript-plugin-gplaces";

export default {
  methods: {
    pickPlace() {
      GooglePlaces.pickPlace()
        .then(place => console.log(JSON.stringify(place)))
        .catch(error => console.log(error));
    }
  }
};
</script>
