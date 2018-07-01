<template>
    <div class="header-wrapper">
      <div class="from-to-wrapper">
        <span class="flight-from flight-time">{{ origin.shortName }} ({{ origin.iata }}) </span>
        --->
        <span class="flight-to flight-time">{{ destination.shortName }} ({{ destination.iata }}) </span>
      </div>
      
      <span class="flight-date">{{ flightDate | date }}</span>
    </div>
</template>

<script>
import moment from "moment";

export default {
  name: "FlightListHeader",
  props: {
    origin: Object,
    destination: Object,
    flightDate: Date
  },

  created() {},

  data() {
    return {};
  },

  watch: {},

  methods: {},

  computed: {},

  filters: {
    date(date) {
      return moment(date).format("YYYY MMMM Do");
    }
  }
};
</script>

<style scoped>
.header-wrapper {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  box-shadow: 1px 1px 13px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  justify-content: space-between;
  align-items: center;

  background: #0f0c29; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  color: #fff;
}

.from-to-wrapper {
  display: flex;
  align-items: center;
}

.flight-time {
  padding: 10px;
}

.flight-date {
  font-weight: 700;
}
</style>
