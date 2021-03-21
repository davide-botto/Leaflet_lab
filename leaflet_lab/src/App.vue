<template>
  <div id="app" style="margin: 0">
    <h2>Esperimento con Vue2Leaflet</h2>
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      style="height: 80vh; width: 100%"
      id="yardMap"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <div
        v-show="comp_selected_layer_coords.length > 0"
        style="
          position: absolute;
          bottom: 0;
          z-index: 800;
          background-color: #fff;
        "
      >
        Coordinates
        <table>
          <tbody>
            <tr
              v-for="(coord, index) in comp_selected_layer_coords"
              :key="index"
            >
              <td>{{ coord[0].toFixed(4) }}</td>
              <td>{{ coord[1].toFixed(4) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div id="app1" class="infoDiv">
        Coordinates
        <table>
          <tbody>
            <tr
              v-for="(coord, index) in comp_selected_layer_coords"
              :key="index"
            >
              <td>{{ coord[0].toFixed(4) }}</td>
              <td>{{ coord[1].toFixed(4) }}</td>
            </tr>
          </tbody>
        </table>
        <button id="close_infoDivButton" @click="hide_infoDiv()">Chiudi</button>
      </div>
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
      center: [44.6602192077551, 7.815419714144042],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      map: null,
      featureGroup: [],
      coords: [],
    };
  },
  mounted() {
    // ** Following https://github.com/vue-leaflet/Vue2Leaflet/issues/331
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject;

      // Leaflet Draw
      // ** Add new FeatureGroup from leaflet for Draw objects on map

      this.featureGroup = new window.L.FeatureGroup().addTo(this.map);
      // ** Controlli per disegnare un poligono sulla mappa
      const drawControl = new window.L.Control.Draw({
        position: "topright",
        draw: {
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "orange",
              timeout: 2000,
              message: "<strong>Not allowed!<strong>",
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
              color: "#000",
              fillColor: "#000",
            },
          },
        },
      });

      // ** Pulsanti toolbar corrispondenti ai controlli
      window.L.DrawToolbar.include({
        getModeHandlers(_map) {
          return [
            {
              enabled: true,
              handler: new window.L.Draw.Polygon(_map),
              title: "Draw a polygon",
            },
          ];
        },
      });

      this.map.addControl(drawControl);

      // ** Listener creazione
      this.map.on(window.L.Draw.Event.CREATED, (e) => {
        // const type = e.layerType;
        const layer = e.layer;
        this.coords = this.get_coords(layer);
        this.featureGroup.addLayer(layer);
        this.$store.dispatch("layers/act_add_layer", layer);
      });
      // ** Listener cancellazione
      this.map.on(window.L.Draw.Event.DELETED, (e) => {
        let keys = Object.keys(e.layers._layers);
        this.$store.dispatch("layers/act_delete_layers", keys);
      });

      this.featureGroup.on("click", (e) => {
        console.log("Event click ", e);
        this.$store.dispatch(
          "layers/act_get_selected_layer_coords",
          e.layer._leaflet_id
        );
        this.show_infoDiv(e.originalEvent);
      });
    });
  },
  methods: {
    get_coords(layer) {
      return layer._latlngs[0].map((objCoordinates) => [
        objCoordinates.lng,
        objCoordinates.lat,
      ]);
    },
    show_infoDiv(e) {
      var left = e.clientX + "px";
      var top = e.clientY + "px";
      var div = document.getElementById("app1");
      div.style.top = top;
      div.style.left = left;
      div.style.display = "block";
    },
    hide_infoDiv() {
      var div = document.getElementById("app1");
      div.style.display = "none";
    }
  },
  computed: {
    comp_selected_layer_coords() {
      return this.$store.getters["layers/get_selected_layer_coords"];
    },
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
table {
  margin: 0 auto;
  padding: 4px 4px;
}
#close_infoDivButton{
  margin: 4px;
}
.infoDiv {
  min-width: 150px;
  min-height: 100px;
  text-align: center;
  position: absolute;
  display: none;
  top: 0;
  left: 0;
  z-index: 800;
  background-color: #fff;
  background-size: cover;
}
</style>
