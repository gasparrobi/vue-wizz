<template>
  <div id="app">
    <span v-if="serviceError !== null" id="error">{{ serviceError }}</span>
    <FlightSelector 
      v-on:ERROR="handleError"
    />
  </div>
</template>

<script>
import FlightSelector from "./components/FlightSelector.vue";

export default {
  name: "app",
  components: {
    FlightSelector
  },
  data() {
    return {
      serviceError: null
    };
  },

  methods: {
    handleError(message) {
      this.serviceError = message;
      setTimeout(() => {
        this.serviceError = null;
      }, 5000);
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  background: #fafafa;
  min-width: 320px;
  width: 100%;
  padding: 20px;
  max-height: 100vh;
}

#error {
  position: absolute;
  top: 440px;
  font-size: 12px;
  color: red;
  font-weight: 500;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  color: #2c3e50;
  width: 100%;
  max-width: 1000px;
}

.vue-select {
  width: 100%;
}

#origin-v-select .selected-tag::before {
  font-family: "Font Awesome 5 Free";
  /* display: inline-block; */
  font-weight: 700;
  content: "\f5b0";
  margin: 0px 10px 0px 5px;
}

#dest-v-select .selected-tag::before {
  font-family: "Font Awesome 5 Free";
  /* display: inline-block; */
  font-weight: 700;
  content: "\f5af";
  margin: 0px 10px 0px 5px;
}

.vue-select .dropdown-toggle {
  display: flex;
  align-items: flex-start;
  border-radius: 0px !important;
}

.vue-select .selected-tag {
  order: 1;
}

.vueselect.single.open .selected-tag {
  left: 0;
  order: 1;
}

.vue-select input[type="search"] {
  width: 0px !important;
  order: 2;
}

.vue-datepicker input {
  background: transparent;
  height: 36px;
  border-radius: 0px;
  border: 1px solid rgba(60, 60, 60, 0.26);
  padding: 5px;
  padding-left: 40px;
  width: 130px;
  font-size: 14px;
}

.vue-datepicker input:focus {
  outline: none;
}

.vue-datepicker span.vdp-datepicker__clear-button {
  position: absolute;
  top: 7px;
  right: -15px;
  font-size: 18px;
}

.vue-datepicker input::-webkit-input-placeholder {
  opacity: 0.4;
}

.error_outline {
  border: 1px solid red;
}
</style>
