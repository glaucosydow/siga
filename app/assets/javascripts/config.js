define({
  //>>includeStart("offline", pragmas.offline);
  debug: false,
  //>>includeEnd("offline");

  defaultCoordinates: {
    latitude: -23.543972,
    longitude: -46.65843
  },

  defaultMapOptions: {
    mapTypeControl: false,
    panControl: false,
    streetViewControl: false,
    zoom: 13,
    // zoomControl: false
  },

  polyLine: {
    strokeWeight: 6,
    strokeOpacity: .5,
    geodesic: true
  },

  infoWindow: {
    width: 150,
    height: 50
  },

  areaRange: {
    strokeColor: '#3498db',
    strokeOpacity: .65,
    strokeWeight: 2,
    fillColor: '#3498db',
    fillOpacity: .15,
    radius: 175 // in meters
  }
});
