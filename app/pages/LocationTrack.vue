<template>
  <Page>
    <AbsoluteLayout>
      <StackLayout top="0" left="0" orientation="horizontal">
        <Button @tap="getDirections">Get Directions</Button>
        <Button @tap="clearRoute">Clear Route</Button>
      </StackLayout>
      <MapView
        top="65"
        left="0"
        height="90%"
        width="100%"
        :zoom="zoom"
        :latitude="origin.latitude"
        :longitude="origin.longitude"
        @mapReady="mapReady"
        @coordinateLongPress="pinDropped"
      />
    </AbsoluteLayout>
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
import { ImageSource } from "image-source";

export default {
  data() {
    return {
      mapView: null,
      zoom: 17,
      origin: { latitude: 0, longitude: 0 },
      destination: { latitude: 0, longitude: 0 },
      APIKEY: "AIzaSyCeXREu81qPlViAQ0eiy2FrnfyutxxsTo8",
      marker: new Marker(),
      encodedPolyline: "",
      routeCordinates: [],
      polyline: new mapsModule.Polyline(),
      northEastBounds: { lat: 0, lng: 0 },
      southWestBounds: { lat: 0, lng: 0 }
    };
  },
  methods: {
    mapReady(args) {
      this.fetchLocation();
      this.mapView = args.object;
      this.marker.position = Position.positionFromLatLng(0, 0);
      this.marker.draggable = true;

      this.marker.icon = 'redcar';
      this.mapView.addMarker(this.marker);

      let gMap = this.mapView.gMap;

      /* enable compass (enabled by default on android */
      this.mapView.settings.compassEnabled = true;

      if (platform.isAndroid) {
        let uiSettings = gMap.getUiSettings();
        uiSettings.setMyLocationButtonEnabled(true);
        /* enable my location button on android */
        gMap.setMyLocationEnabled(true);
      } else {
        /* enable my location button on iOS */
        gMap.myLocationEnabled = true;
        gMap.settings.myLocationButton = true;
      }
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
        })
        .catch(e => {
          console.log("oh frak, error", e);
        });
    },
    pinDropped(args) {
      let lat = args.position.latitude;
      let lng = args.position.longitude;
      this.marker.position = Position.positionFromLatLng(lat, lng);
      this.destination.latitude = lat;
      this.destination.longitude = lng;
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
          this.northEastBounds.lat = result.routes[0].bounds.northeast.lat;
          this.northEastBounds.lng = result.routes[0].bounds.northeast.lng;
          this.southWestBounds.lat = result.routes[0].bounds.southwest.lat;
          this.southWestBounds.lng = result.routes[0].bounds.southwest.lng;

          this.encodedPolyline = result.routes[0].overview_polyline.points;
          this.routeCordinates = decodePolyline(this.encodedPolyline);
          this.drawRoute();
        },
        error => {
          console.log(error);
        }
      );
    },
    drawRoute() {
      this.polyline = new mapsModule.Polyline();
      this.routeCordinates.forEach(point =>
        this.polyline.addPoint(
          Position.positionFromLatLng(point.lat, point.lng)
        )
      );
      this.polyline.visible = true;
      this.polyline.width = 5;
      this.polyline.geodesic = false;
      // polyline.color = new Color("#DD00b3fd");
      this.mapView.addPolyline(this.polyline);
      this.animateCamera();
    },
    clearRoute() {
      this.mapView.removeAllPolylines();
    },
    animateCamera() {
      if (platform.isAndroid) {
        let builder = new com.google.android.gms.maps.model.LatLngBounds.Builder();
        let position1 = new com.google.android.gms.maps.model.LatLng(
          this.northEastBounds.lat,
          this.northEastBounds.lng
        );
        let position2 = new com.google.android.gms.maps.model.LatLng(
          this.southWestBounds.lat,
          this.southWestBounds.lng
        );
        builder.include(position1);
        builder.include(position2);
        let bounds = builder.build();
        let padding = 150;
        let cu = com.google.android.gms.maps.CameraUpdateFactory.newLatLngBounds(
          bounds,
          padding
        );
        this.mapView.gMap.animateCamera(cu, 1000, null);
      } else {
        let bounds = GMSCoordinateBounds.alloc().init();
        let position1 = CLLocationCoordinate2DMake(
        this.northEastBounds.lat,
          this.northEastBounds.lng
        );
        let position2 = CLLocationCoordinate2DMake(
            this.southWestBounds.lat,
          this.southWestBounds.lng
        );
        bounds = bounds.includingCoordinate(position1);
        bounds = bounds.includingCoordinate(position2);
        let update = GMSCameraUpdate.fitBoundsWithPadding(bounds, 100);
        this.mapView.gMap.animateWithCameraUpdate(update);
      }
    }
  }
};
</script>