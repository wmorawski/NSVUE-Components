<template>
  <Page>
    <StackLayout>
      <WrapLayout top="0" left="0" itemWidth="60">
        <Button @tap="getDirections">Get Directions</Button>
        <Button @tap="clearLines">Clear Lines</Button>
        <Button @tap="startJourney">Start Journey</Button>
        <button @tap="watchLocation">Watch Location</button>
        <button @tap="clearWatch">Clear watch</button>
        <button @tap="animateMarker">Animate Marker</button>
      </WrapLayout>
      <AbsoluteLayout>
        <MapView
          top="0"
          left="0"
          height="100%"
          width="100%"
          :zoom="zoom"
          :latitude="origin.latitude"
          :longitude="origin.longitude"
          @mapReady="mapReady"
          @coordinateLongPress="pinDropped"
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
import MapsHelper from "~/components/MapsHelper.js";

export default {
  mixins: [
    MapsHelper
  ],
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
      southWestBounds: { lat: 0, lng: 0 },
      journeyStarted: false,
      watch: null,
      originMarker: null
    };
  },
  methods: {
    mapReady(args) {
      this.fetchLocation();
      this.mapView = args.object;
      this.marker.position = Position.positionFromLatLng(0, 0);
      this.marker.draggable = true;

      this.marker.icon = "redcar";
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

          this.originMarker = new Marker();
          this.originMarker.position = Position.positionFromLatLng(lat, lng);
          this.originMarker.draggable = true;
          this.mapView.addMarker(this.originMarker);
        })
        .catch(e => {
          console.log("oh frak, error", e);
        });
    },
    watchLocation() {
      this.watch = geolocation.watchLocation(
        success => {
          console.log(success.latitude);
          console.log(success.longitude);
        },
        error => console.log(error),
        {
          desiredAccuracy: Accuracy.high,
          updateDistance: 1,
          updateTime: 3000,
          minimumUpdateTime: 3000
        }
      );
    },
    clearWatch() {
      geolocation.clearWatch(this.watch);
    },
    pinDropped(args) {
      let lat = args.position.latitude;
      let lng = args.position.longitude;
      // this.marker.position = Position.positionFromLatLng(lat, lng);

      if (!this.journeyStarted) {
        this.destination.latitude = lat;
        this.destination.longitude = lng;
        this.animateMarker(lat, lng);
        return;
      }
      /* update polyline logic */
      this.origin.latitude = lat;
      this.origin.longitude = lng;
      this.getDirections();
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
      // this.mapView.removeAllPolylines();
      // this.polyline = new mapsModule.Polyline();
      // this.mapView.addPolyline(this.polyline);
      // this.routeCordinates.forEach(point =>
      //   this.polyline.addPoint(
      //     Position.positionFromLatLng(point.lat, point.lng)
      //   )
      // );
      // this.polyline.visible = true;
      // this.polyline.geodesic = true;
      // this.polyline.width = 10;
      // // polyline.color = new Color("#DD00b3fd");
 
    
      // let icon = imageSourceModule.fromResource("redcar");
      // let bitmapFactory = com.google.android.gms.maps.model.BitmapDescriptorFactory.fromBitmap(
      //   icon.android
      // );
      // let customCap = new com.google.android.gms.maps.model.CustomCap(
      //   bitmapFactory,
      //   10
      // );
      // this.mapView.mainPolyline.setStartCap(customCap);
      this.androidPolyline("redcar");

      if (!this.journeyStarted) this.animateCamera();
    },
    getCustomCap(source) {
      return customCap;
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
    },
    startJourney() {
      // this.marker.position = Position.positionFromLatLng(
      //   this.origin.latitude,
      //   this.origin.longitude
      // );
      this.journeyStarted = true;
    },
    animateMarker(lat, lng) {
      var tween = new TWEEN.Tween(this.marker.position)
        .to({ latitude: lat, longitude: lng }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(object => {
          this.marker.position = Position.positionFromLatLng(
            object.latitude,
            object.longitude
          );
        })
        .start();
      let heading = geometery.heading(
        [lat, lng],
        [
          this.originMarker.position.latitude,
          this.originMarker.position.longitude
        ]
      );
      this.marker.rotation = heading + 90;
    }
  }
};
</script>

<style <style scoped>
button {
  font-size: 10px;
  padding: 3;
}
</style>
