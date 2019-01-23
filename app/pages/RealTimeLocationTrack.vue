<template>
  <Page>
    <StackLayout>
      <WrapLayout top="0" left="0" itemWidth="70">
        <Button @tap="getDirections">Get Directions</Button>
        <Button @tap="clearRoute">Clear Route</Button>
        <Button @tap="startJourney">Start Journey</Button>
        <button @tap="endJourney">End Journey</button>
      </WrapLayout>
      <AbsoluteLayout>
        <MapView
          top="10"
          left="0"
          height="100%"
          width="100%"
          :zoom="zoom"
          :latitude="this.origin.latitude"
          :longitude="this.origin.longitude"
          @mapReady="mapReady"
          @coordinateLongPress="locationSelected"
        />
        <TextView top="0" left="10" v-model="journeyDetails" v-if="journeyStarted"/>
        <TextView top="100" left="10" text="Destination Reached." v-if="destinationReached"/>
      </AbsoluteLayout>
    </StackLayout>
  </Page>
</template>

<script>
import MapsHelper from "~/components/RealTimeLocationHelper.js";

export default {
  mixins: [
    MapsHelper.DirectionsAPIHelper,
    MapsHelper.LocationHelper,
    MapsHelper.DistanceMatrixAPIHelper
  ],
  data() {
    return {
      mapView: null,
      zoom: 15
    };
  },
  methods: {
    mapReady(args) {
      this.mapView = args.object;
      this.turnOnMyLocation();
      this.addMarkerToMap(this.destinationMarker, false);
      /* add car marker to map pointing to user location */

      this.addMarkerToMap(this.myLocationMarker, true);

      /* set origin coordinates */
      this.fetchLocation();
    },
    locationSelected(args) {
      let lat = args.position.latitude;
      let lng = args.position.longitude;
      this.destination.latitude = lat;
      this.destination.longitude = lng;
      this.setMarker(this.destinationMarker, lat, lng);
    },
    clearRoute() {
      this.mapView.removeAllPolylines();
    },
    startJourney() {
      this.journeyStarted = true;
      this.destinationReached = false;

      /* start watching for location changes and update the journey accordingly*/
      this.watchLocationAndUpdateJourney();

    },
    endJourney() {
      this.clearWatch();
      this.clearRoute();
      this.journeyStarted = false;
    }
  }
};
</script>

<style>
button {
  font-size: 9;
  padding: 1;
}
TextView {
  background-color: white;
  color: black;
}
</style>