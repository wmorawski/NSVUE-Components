<template>
  <Page>
    <GridLayout>
      <MapView
        @mapReady="mapReady"
        @markerSelect="onMarkerSelect"
        @coordinateLongPress="pointSelected"
      />
    </GridLayout>
  </Page>
</template>

<script>
// import { MapViewBase } from 'nativescript-google-maps-sdk/map-view-common';
import { Position, Marker } from "nativescript-google-maps-sdk";
import * as platform from "tns-core-modules/platform";

export default {
  data() {
    return {
      latitude: 34.019586,
      longitude: 74.801348,
      zoom: 15,
      minZoom: 0,
      maxZoom: 22,
      bearing: 0,
      tilt: 0,
      padding: [40, 40, 40, 40],
      mapView: null,
      marker: new Marker()
    };
  },
  methods: {
    mapReady(args) {
      console.log("map ready");
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
      //   let uiSettings = gMap.getUiSettings();
      //   uiSettings.setMyLocationButtonEnabled(true);
      if (platform.isAndroid) gMap.setMyLocationEnabled(true);
      else gMap.myLocationEnabled = true;
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
    }
  }
};
</script>









