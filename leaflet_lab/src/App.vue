<template>
  <div id="app">
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      style="height: 500px; width: 100%"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
    </l-map>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import L from "leaflet";
import LDraw from "leaflet-draw";
/* eslint-enable no-unused-vars */
import "leaflet-draw/dist/leaflet.draw.css";
import { LMap, LTileLayer } from "vue2-leaflet";
export default {
  name: "App",
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      zoom: 11,
      center: [47.31322, -1.319482],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      map: null,
      featureGroup: []
    };
  },
  mounted() {
    console.log(LDraw);
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject;
      // Tell leaflet that the map is exactly as big as the image
      this.map.setMaxBounds(this.bounds);
      // Leaflet Draw
      // Add new FeatureGroup from leaflet for Draw objects on map

      this.featureGroup = new window.L.FeatureGroup().addTo(this.map);

      const drawControl = new window.L.Control.Draw({
        position: "topright",
        draw: {
          polyline: {
            allowIntersection: false,
            showArea: true,
          },
          polygon:  {
            allowIntersection: false,
            drawError: {
              color: 'orange',
              timeout: 2000,
              message: '<strong>Not allowed!<strong>',
            },
          },
          rectangle: false,
          circle: false,
          marker: false,
        },
        edit: {
          featureGroup: this.featureGroup,
          remove: true,
          edit: {
            // Set color and fill for edited element
            selectedPathOptions: {
              color: '#000',
              fillColor: '#000',
            },
          },
        }
      });
      this.map.addControl(drawControl);
      // const editableLayers = new window.L.FeatureGroup().addTo(this.map);
      this.map.on(window.L.Draw.Event.CREATED, (e) => {
        // const type = e.layerType;
        const layer = e.layer;
        console.log(layer);
        const coords = layer._latlngs[0].map(objCoordinates => [objCoordinates.lng, objCoordinates.lat] );
        console.log("Coordinates ", coords);
        // Do whatever else you need to. (save to db, add to map etc)
        this.featureGroup.addLayer(layer);
      });
      
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
