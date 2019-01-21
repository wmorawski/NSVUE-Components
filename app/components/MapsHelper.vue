<script>
export default {
  methods: {
    getLatLng(lat, lng) {
      return new com.google.android.gms.maps.model.LatLng(lat, lng);
    },
    androidPolyline() {
      var pointsList = new java.util.ArrayList();
      pointsList.add(this.getLatLng(this.origin.latitude), this.getLatLng(this.origin.longitude))
      pointsList.add(this.getLatLng(this.destination.latitude), this.getLatLng(this.destination.longitude))
      let polylineOptions = new com.google.android.gms.maps.model.PolylineOptions();
      let line = map.addPolyline(polylineOptions);
      line.setPoints(pointsList);


      let icon = imageSourceModule.fromResource("redcar");
      let bitmapFactory = com.google.android.gms.maps.model.BitmapDescriptorFactory.fromBitmap(
        icon.android
      );
      let customCap = new com.google.android.gms.maps.model.CustomCap(
        bitmapFactory,
        26
      );
      line.setEndCap(customCap);
    }
  }
};
</script>