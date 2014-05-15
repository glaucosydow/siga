define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'modules/map',
  'services/getStationById',
  'helpers/toLatLng',
  'text!partials/sections/station.html'
], function(
  $,
  Vue,
  gmaps,
  Map,
  getStationById,
  toLatLng,
  template
) {

  return Vue.extend({
    template: template,

    data: {
      id: 'estacao-barra-funda',
      info: {}
    },

    attached: function() {
      // make sure dom is loaded and then fire the initialization method
      $($.proxy(this.initialize, this));
    },

    methods: {
      initialize: function() {
        // Notifying section ready.
        this.$dispatch('app:sectionReady', this);
        this.setupMap();
      },

      setupMap: function() {
        this.station = getStationById(this.id);
        console.log(this.station.schedule);
        this.location = toLatLng(this.station.location);
        this.stationMap = new Map('#station-map', {
          center: this.location,
          zoom: 17,
          // mapTypeId: gmaps.MapTypeId.TERRAIN
        });
        this.stationMap.initialize();
        this.stationMap.on.loaded.addOnce(this.setMarker, this);

        console.log('station :: setupMap() :: Creating map for "%s" station', this.id);
      },

      setMarker: function() {
        console.log('station :: setMarkers()');
        var marker,
            area;

        marker = this.stationMap.setMarker({
          position: this.location,
          animation: gmaps.Animation.BOUNCE
        });

        area = this.stationMap.setAreaRange({
          marker: marker
        });
      }
    }
  });

});
