<template>
    <div class="summary-wrapper">
			{{ outBoundFlight.departure | date }}
			{{ originIata }}
			{{ outBoundTicketId }}
    </div>
</template>

<script>
import moment from "moment";
export default {
  name: "FlightSummary",
  props: {
    outBoundFlight: Object,
    outBoundTicketId: String,
    returnFlight: Object,
    returnTicketId: String,
    originIata: String,
    destinationIata: String
  },
  data() {
    return {};
  },

  methods: {},

  computed: {},

  watch: {},

  filters: {
    date(date) {
      return moment(date).format("YYYY MMMM Do");
    },
    time(date) {
      return moment(date).format("hh:mm");
    }
  }
};
</script>

<style scoped>
.summary-wrapper {
  margin-top: 20px;
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

  padding: 20px;
  box-shadow: 1px 1px 13px 3px rgba(0, 0, 0, 0.05);
}
</style>
