const imageSourceModule = require("tns-core-modules/image-source");
import * as mapsModule from "nativescript-google-maps-sdk";
import {
  TWEEN
} from "nativescript-tweenjs";


const MapsHelper = {
  data() {
    return {
      pointsList: null,
      polylineOptions: null,
      line: null,
      customCap: null
    }
  },
  methods: {
    getLatLng(lat, lng) {
      return new com.google.android.gms.maps.model.LatLng(lat, lng);
    },
    androidPolyline(cap) {
      this.line !== null ? this.line.remove() : console.log('No line added yet!')
      this.pointsList = new java.util.ArrayList();
      this.polylineOptions = new com.google.android.gms.maps.model.PolylineOptions();
      /* add polyline to map */
      this.line = this.mapView.gMap.addPolyline(this.polylineOptions);

      /* add points to LatLng pointsList */
      // this.routeCordinates.forEach(point => {
      //   this.pointsList.add(this.getLatLng(point.lat, point.lng));
      // });
      let i = 0;
      let timer = setInterval(() => {
        if (i >= this.routeCordinates.length - 1)
          clearInterval(timer);
        let points = this.line.getPoints();
        points.add(this.getLatLng(this.routeCordinates[i].lat, this.routeCordinates[i].lng));
        this.line.setPoints(points);
        i++;
      }, 30);

      // this.line.setPoints(this.pointsList);

      let icon = imageSourceModule.fromResource(cap);
      let bitmapFactory = com.google.android.gms.maps.model.BitmapDescriptorFactory.fromBitmap(
        icon.android
      );
      this.customCap = new com.google.android.gms.maps.model.CustomCap(
        bitmapFactory,
        10
      );
      this.line.setStartCap(this.customCap);
    },
    clearLines() {
      this.line.remove();
    }
  }
};

export default MapsHelper;