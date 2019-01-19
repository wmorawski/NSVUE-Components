<template>
  <Page actionBarHidden="false">
    <AbsoluteLayout>
      <GridLayout top="65" left="0" height="90%" width="100%">
        <MapView
          :latitude="origin.latitude"
          :longitude="origin.longitude"
          :zoom="zoom"
          @mapReady="mapReady"
          @markerSelect="onMarkerSelect"
          @coordinateLongPress="pointSelected"
          mapAnimationsEnabled="true"
          :tilt="tilt"
          @cameraChanged="onCameraChanged"
        />
      </GridLayout>
      <Button @tap="getDirections" top="20" left="10">Get Directions</Button>
      <button @tap="animateCamera" top="20" left="130">Fit route to view</button>
      <button @tap="moveMarker" top="20" left="240">Move Marker</button>
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
      encodedPolyline: "",
      routeCordinates: [],
      polyline: new mapsModule.Polyline(),
      positionOrigin: null,
      positionDestination: null
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
      let lat = args.position.latitude;
      let lng = args.position.longitude;
      this.marker.position = Position.positionFromLatLng(lat, lng);
      this.destination.latitude = lat;
      this.destination.longitude = lng;
      this.positionDestination = this.marker.position;
      this.reverseGeocode(lat, lng);
    },
    reverseGeocode(lat, lng) {
      let APIKEY = "AIzaSyAPw4owHD6nyUOMGQDI1pzyaELFndKXUe8";
      let GEOAPIURL =
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        lat +
        "," +
        lng +
        "&key=" +
        APIKEY;
      let PLACESAPIURL =
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        lat +
        "," +
        lng +
        "&rankby=distance&type=sublocality,&key=" +
        APIKEY;

      http
        .getJSON(GEOAPIURL)
        .then(
          response => console.log("reverse geocode: " + response.results[0].formatted_address),
          error => console.log(error)
        );

      http
        .getJSON(PLACESAPIURL)
        .then(
          response => console.log("place: " + response.results[0].vicinity),
          error => console.log(error)
        );
    },
    onCameraChanged(args) {
      var bounds = this.mapView.projection.visibleRegion.bounds;
      console.log(bounds.southwest.latitude);
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
          let lat = res.latitude;
          let lng = res.longitude;

          this.origin.latitude = lat;
          this.origin.longitude = lng;
          this.positionOrigin = Position.positionFromLatLng(lat, lng);
        })
        .catch(e => {
          console.log("oh frak, error", e);
        });
    },
    drawPolyline() {
      this.polyline = new mapsModule.Polyline();
      this.routeCordinates.forEach(point =>
        this.polyline.addPoint(
          mapsModule.Position.positionFromLatLng(point.lat, point.lng)
        )
      );
      this.polyline.visible = true;
      this.polyline.width = 7;
      this.polyline.geodesic = false;
      // polyline.color = new Color("#DD00b3fd");
      this.mapView.addPolyline(this.polyline);
      this.animateCamera();
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
          console.log(result);
          this.encodedPolyline = result.routes[0].overview_polyline.points;
          this.routeCordinates = decodePolyline(this.encodedPolyline);
          this.drawPolyline();
        },
        error => {
          console.log(error);
        }
      );
    },
    animateCamera() {
      if (platform.isAndroid) {
        let builder = new com.google.android.gms.maps.model.LatLngBounds.Builder();
        let position1 = new com.google.android.gms.maps.model.LatLng(
          this.origin.latitude,
          this.origin.longitude
        );
        let position2 = new com.google.android.gms.maps.model.LatLng(
          this.destination.latitude,
          this.destination.longitude
        );
        builder.include(position1);
        builder.include(position2);
        let bounds = builder.build();
        let padding = 100;
        let cu = com.google.android.gms.maps.CameraUpdateFactory.newLatLngBounds(
          bounds,
          padding
        );
        this.mapView.gMap.animateCamera(cu, 1000, null);
      } else {
        let bounds = GMSCoordinateBounds.alloc().init();
        let position1 = CLLocationCoordinate2DMake(
          this.origin.latitude,
          this.origin.longitude
        );
        let position2 = CLLocationCoordinate2DMake(
          this.destination.latitude,
          this.destination.longitude
        );
        bounds = bounds.includingCoordinate(position1);
        bounds = bounds.includingCoordinate(position2);
        let update = GMSCameraUpdate.fitBoundsWithPadding(bounds, 100);
        this.mapView.gMap.animateWithCameraUpdate(update);
      }

      // var bounds = mapsModule.Bounds.fromCoordinates(this.positionOrigin, this.positionDestination);
      // this.mapView.setViewport(bounds, 150);
    },
    moveMarker() {
      this.destination.latitude+= 0.0001;
      this.destination.longitude+= 0.0001;
      this.marker.position = Position.positionFromLatLng(this.destination.latitude, this.destination.longitude);
      this.marker.rotation= this.marker.rotation + 5;
    }
  }
};
</script>









