define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'mout/object/mixIn',
  'config',
  'services/getUserLocation',
  'services/getStations',
  'services/getStationByName',
  'services/getLines',
  'services/getLineStations',
  'modules/map',
  'helpers/toLatLng',
  'text!partials/sections/overview.html'
], function(
  $,
  Vue,
  gmaps,
  mixIn,
  config,
  getUserLocation,
  getStations,
  getStationByName,
  getLines,
  getLineStations,
  Map,
  toLatLng,
  template
) {

  return Vue.extend({
    template: template,

    data: {
      lineOptions: {
        'linha-1-azul': {
          color: 'blue'
        },

        'linha-2-verde': {
          color: 'green'
        },

        'linha-3-vermelha': {
          color: 'red'
        },

        'linha-4-amarela': {
          color: 'yellow'
        },

        'linha-5-lilas': {
          color: 'magenta'
        }
      }
    },

    ready: function() {
      // make sure dom is loaded and then fire the initialization method
      $($.proxy(this.initialize, this));
    },

    methods: {
      initialize: function() {
        this.setupMap();
      },

      setupMap: function() {
        this.overviewMap = new Map('#overview-map');
        this.overviewMap.initialize();
        this.overviewMap.on.loaded.addOnce(this.setUserLocationMarker, this);
        this.overviewMap.on.loaded.addOnce(this.placeLines, this);
        this.overviewMap.on.markerClick.add(this.markerClick, this);
        this.requestUserLocation();
      },

      requestUserLocation: function() {
        var self = this;

        getUserLocation()
          .then(function(response) {
            console.log('overview :: requestUserLocation() :: Got user location');
            return toLatLng(response);
          })
          .catch(function(warn) {
            console.warn('overview :: requestUserLocation() ::', warn);
            return self.overviewMap.getCenter();
          })
          .done(function(position) {
            self.userLocation = position;
            self.setUserLocationMarker(position);
          });
      },

      setUserLocationMarker: function(position) {
        console.log('overview :: setUserLocationMarker ::', position);

        this.userLocationMarker = this.overviewMap.setMarker({
          position: position,
          animation: gmaps.Animation.BOUNCE
        });
      },

      moveToCenter: function() {
        this.overviewMap.panTo(this.userLocation);
      },

      markerClick: function(id) {
        this.$root.$emit('app:setView', 'station', id);
      },

      placeLines: function() {
        var lines = getLines(),
            firstStation,
            lastStation,
            position,
            path,
            points = [],
            allPoints = [],
            map = this.overviewMap,
            lineOptions = this.lineOptions,
            lineStations = {},
            stations;

        console.log('overview :: placeLines() :: Rendering subway stations and lines');

        $.each(lines, function(index, line) {

          stations = getLineStations(line);
          points = [];

          $.each(stations, function(index, station) {

            position = toLatLng(station.location);
            color = lineOptions[line].color;

            // TODO: add a check to only print a marker if there's no marker for that coords
            map.setMarker({
              position: position,
              content: station.title,
              id: station.id,
              // TODO: Move icon options to config file
              icon: {
                path: gmaps.SymbolPath.CIRCLE,
                scale: 3,
                strokeColor: color,
                strokeWeight: 15
              }
            });

            points.push(position);

          });

          // Create subway line path on the map
          new gmaps.Polyline(mixIn(config.polyLine, {
            path: points,
            strokeColor: color,
            map: map.getMap()
          }));
        });

      }
    }
  });

});
