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
        <ScrollView top="50" left="0" orientation="vertical">
        <TextView class="log" v-model="logData" />
    </ScrollView>
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
      zoom: 18,
      logData: "Console Log:"
    };
  },
  methods: {
    mapReady(args) {
      this.mapView = args.object;
      /* turn on my location button on map */
      this.turnOnMyLocation(true);
      /* add destination marker to map */
      this.addMarkerToMap(this.destinationMarker, false);
      /* add car marker to map  */
      this.addMarkerToMap(this.myLocationMarker, true);
      /* hide car marker until journey has started */
      this.myLocationMarker.visible = false;
      /* set origin coordinates */
      this.fetchLocation();
    },
    locationSelected(args) {
      let lat = args.position.latitude;
      let lng = args.position.longitude;
      this.destination.latitude = lat;
      this.destination.longitude = lng;
      this.setMarker(this.destinationMarker, lat, lng, false);
    },
    clearRoute() {
      this.mapView.removeAllPolylines();
    },
    startJourney() {
      this.turnOnMyLocation(false);
      this.myLocationMarker.visible = true;
      this.journeyStarted = true;
      this.destinationReached = false;

      /* start watching for location changes and update the journey accordingly*/
      this.watchLocationAndUpdateJourney();

    },
    endJourney() {
      this.turnOnMyLocation(true);
      this.myLocationMarker.visible = false;
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
.log {
  font-size: 9;
}
</style>