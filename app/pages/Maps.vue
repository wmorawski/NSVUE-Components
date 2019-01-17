<template>
  <Page>
    <AbsoluteLayout>
      <GridLayout top="0" left="0" height="100%" width="100%">
        <MapView
          :latitude="origin.latitude"
          :longitude="origin.longitude"
          :zoom="zoom"
          @mapReady="mapReady"
          @markerSelect="onMarkerSelect"
          @coordinateLongPress="pointSelected"
          mapAnimationsEnabled="false"
          :tilt="tilt"
          @cameraChanged="onCameraChanged"
        />
      </GridLayout>
      <Button @tap="getDirections" top="20" left="20">Get Directions</Button>
    </AbsoluteLayout>
  </Page>
</template>

<script>
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import { Position, Marker } from "nativescript-google-maps-sdk";
import * as mapsModule from "nativescript-google-maps-sdk";
import * as platform from "tns-core-modules/platform";
import * as Toast from "nativescript-toast";
const decodePolyline = require("decode-google-map-polyline");
import * as http from "http";


export default {
  data() {
    return {
      latitude: 0,
      longitude: 0,
      zoom: 17,
      minZoom: 0,
      maxZoom: 22,
      bearing: 0,
      tilt: 0,
      padding: [40, 40, 40, 40],
      mapView: null,
      marker: new Marker(),
      secondMarker: null,
      origin: { latitude: 0, longitude: 0 },
      destination: { latitude: 0, longitude: 0 },
      APIKEY: "AIzaSyCeXREu81qPlViAQ0eiy2FrnfyutxxsTo8",
      encodedPolyline : "",
      routeCordinates : [],
      polyline: new mapsModule.Polyline(),
    };
  },
  methods: {
    mapReady(args) {
      this.fetchLocation();
      this.mapView = args.object;
      this.mapView.infoWindowTemplate = `
				<StackLayout orientation="vertical" width="200">
					<Label text="{{title}}" className="title"/>
					<Label text="{{snippet}}" textWrep="true" class="snippet"/>
				</StackLayout>
			`;

      this.marker.position = Position.positionFromLatLng(0, 0);
      this.marker.title = "Test";
      this.marker.snippet = "test";
      this.marker.userData = { test: "test" };
      this.marker.draggable = true;
      this.mapView.addMarker(this.marker);
      let gMap = this.mapView.gMap;

      /* enable compass (enabled by default on android */
      this.mapView.settings.compassEnabled = true;

      if (platform.isAndroid) {
        let uiSettings = gMap.getUiSettings();
        uiSettings.setMyLocationButtonEnabled(true);
        uiSettings.setCompassEnabled(true);
        /* enable my location button on android */
        gMap.setMyLocationEnabled(true);
      } else {
        /* enable my location button on iOS */
        gMap.myLocationEnabled = true;
        gMap.settings.myLocationButton = true;
      }
      this.addMarkerToMap();

    },
    addMarkerToMap() {
      this.secondMarker = new Marker();
      this.secondMarker.draggable = true;
      this.secondMarker.position = Position.positionFromLatLng(34, 74);
      this.mapView.addMarker(this.secondMarker);
    },
    onMarkerSelect(args) {
      console.log(args.marker);
    },
    pointSelected(args) {
      console.log("point selected");
      this.marker.position = Position.positionFromLatLng(
        args.position.latitude,
        args.position.longitude
      );
      this.destination.latitude = args.position.latitude;
      this.destination.longitude = args.position.longitude;
    },
    onCameraChanged(args) {
      var bounds = this.mapView.projection.visibleRegion.bounds;
      console.log(bounds.southwest.latitude);
      bounds.southwest.latitude = 50;
      console.log(bounds.southwest.latitude);
    },
    log(string) {
      Toast.makeText(string.toString()).show();
      console.log(string);
    },
    fetchLocation() {
      geolocation
        .getCurrentLocation({
          desiredAccuracy: Accuracy.high,
          maximumAge: 1000,
          timeout: 20000
        })
        .then(res => {
          this.origin.latitude = res.latitude;
          this.origin.longitude = res.longitude;
        })
        .catch(e => {
          console.log("oh frak, error", e);
        });
    },
    drawPolyline() {
      this.polyline = new mapsModule.Polyline();
      this.routeCordinates.forEach(point => this.polyline.addPoint(mapsModule.Position.positionFromLatLng(point.lat, point.lng)));
      this.polyline.visible = true;
      this.polyline.width = 7;
      this.polyline.geodesic = false;
      // polyline.color = new Color("#DD00b3fd");
      this.mapView.addPolyline(this.polyline);
    },
    getDirections() {
      let originCordinates = this.origin.latitude + "," + this.origin.longitude;
      let destinationCordinates =
        this.destination.latitude + "," + this.destination.longitude;
      let APIURL =
        "https://maps.googleapis.com/maps/api/directions/json?origin=" +
        originCordinates +
        "&destination=" +
        destinationCordinates +
        "&key=" +
        this.APIKEY;
      http.getJSON(APIURL).then(
        result => {
          console.log(result)
          this.encodedPolyline = result.routes[0].overview_polyline.points;
          this.routeCordinates = decodePolyline(this.encodedPolyline);
          this.drawPolyline();
        },
        error => {
          console.log(error);
        }
      );
    },
    iOS() {
 
    }
  }
};
</script>









