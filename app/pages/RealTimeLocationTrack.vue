<template>
  <Page>
    <StackLayout>
      <WrapLayout top="0" left="0" itemWidth="60">
        <Button @tap="getDirections">Get Directions</Button>
        <Button @tap="clearLines">Clear Lines</Button>
        <Button @tap="startJourney">Start Journey</Button>
        <button @tap="endJourney">End Journey</button>
      </WrapLayout>
      <AbsoluteLayout>
        <TextView top="10" left="10" v-model="journeyDetails" v-if="journeyStarted"/>
        <TextView top="100" left="10" text="Destination Reached." v-if="destinationReached"/>
        <MapView
          top="0"
          left="0"
          height="100%"
          width="100%"
          :zoom="zoom"
          :latitude="origin.latitude"
          :longitude="origin.longitude"
          @mapReady="mapReady"
          @coordinateLongPress="locationSelected"
        />
      </AbsoluteLayout>
    </StackLayout>
  </Page>
</template>

<script>
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import * as mapsModule from "nativescript-google-maps-sdk";
const decodePolyline = require("decode-google-map-polyline");
import * as http from "http";
import * as platform from "tns-core-modules/platform";
import { Position, Marker } from "nativescript-google-maps-sdk";
import { Image } from "ui/image";
const imageSourceModule = require("tns-core-modules/image-source");
import { error } from "tns-core-modules/trace/trace";
import { TWEEN } from "nativescript-tweenjs";
import * as geometery from "spherical";
import {
  DirectionsAPIHelper,
  LocationHelper,
  DistanceMatrixAPIHelper
} from "~/components/RealTimeLocationHelper.js";

export default {
  mixins: [DirectionsAPIHelper, LocationHelper, DistanceMatrixAPIHelper],
  data() {
    return {
      mapView: null
    };
  },
  methods: {
    mapReady(args) {
      this.mapView = args.object;
      this.turnOnMyLocation();
      this.addMarkerToMap(this.destinationMarker, false);
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
    startJourney() {
      this.journeyStarted = true;
      /* add car marker to map pointing to user location */
      this.addMarkerToMap(this.myLocationMarker, true);
      /* start watching for location changes and update the journey accordingly*/
      this.watchLocationAndUpdateJourney();
    },
    endJourney() {
      geolocation.clearWatch(this.watch);
      this.journeyStarted = false;
    }
  }
};
</script>