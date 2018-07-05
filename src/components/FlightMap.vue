<template>
    <div id="mapbox">

    </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  name: "FlightMap",
  props: {
    originS: Object,
    destinationS: Object
  },

  mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZ2FzcGFycm9iaSIsImEiOiJjamo2MzM2amYxems2M3BzMmpkZDYyaTN0In0.96VTDGeFhnhI_cknbHG1aw";
    this.map = new mapboxgl.Map({
      container: "mapbox",
      style: "mapbox://styles/gasparrobi/cjj7be9kd28lc2sp17a05qu7p",
      center: [16.51895, 48.490118], // starting position
      zoom: 3.01 // starting zoom
    });
    try {
      this.setOriginMarker(this.originS.longitude, this.originS.latitude);
    } catch (error) {
      // origin data hasn't arrived
    }
    try {
      this.setDestinationMarker(this.destinationS.longitude, this.destinationS.latitude);
    } catch (error) {
      // destination data hasn't arrived
    }
  },

  destroyed() {},

  data() {
    return {
      selectedOrigin: this.originS,
      originMarker: null,
      destinationMarker: null,
      originIcon: this.getOriginIcon(),
      destinationIcon: this.getDestinationIcon()
    };
  },

  watch: {
    originS(val) {
      if (val === null) {
        this.originMarker.remove();
      } else {
        if (this.originMarker !== null) {
          this.originMarker.remove();
        }
        this.map.flyTo({
          center: [val.longitude, val.latitude],
          zoom: 6
        });
        this.originMarker = new mapboxgl.Marker(this.originIcon)
          .setLngLat([val.longitude, val.latitude])
          .addTo(this.map);
      }
    },

    destinationS(val) {
      if (val === null) {
        this.destinationMarker.remove();
      } else {
        if (this.destinationMarker !== null) {
          this.destinationMarker.remove();
        }
        this.map.flyTo({
          center: [val.longitude, val.latitude],
          zoom: 6
        });
        this.destinationMarker = new mapboxgl.Marker(this.destinationIcon)
          .setLngLat([val.longitude, val.latitude])
          .addTo(this.map);
      }
    }
  },

  methods: {
    setOriginMarker(long, lat) {
      this.originMarker = new mapboxgl.Marker(this.originIcon).setLngLat([long, lat]).addTo(this.map);
    },

    setDestinationMarker(long, lat) {
      this.destinationMarker = new mapboxgl.Marker(this.destinationIcon).setLngLat([long, lat]).addTo(this.map);
    },

    getOriginIcon() {
      let el = document.createElement("div");
      el.className = "origin-marker";
      return el;
    },

    getDestinationIcon() {
      let el = document.createElement("div");
      el.className = "destination-marker";
      return el;
    }
  },

  computed: {}
};
</script>

<style scoped>
#mapbox {
  width: 660px;
  height: 415px;
  margin-left: 20px;
}

.origin-marker {
  background: #c6007e;
  width: 15px;
  height: 15px;
}
</style>
