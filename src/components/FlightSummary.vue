<template>
    <div class="summary-wrapper">
			<span class="summary-title">Summary</span>
			<div class="summary-item">

				<div class="date-and-place">
					<span class="date">{{ outBoundFlight.departure | date }}</span>
					<span class="from-to">{{ originIata }} - {{ destinationIata }}</span>
				</div>
				<div class="price">{{ this.outBoundTicketFare }}<span class="currency">$</span></div>
				
			</div>

			<div class="summary-item" v-if="returnTicketId">

				<div class="date-and-place">
					<span class="date">{{ returnFlight.departure | date }}</span>
					<span class="from-to">{{ destinationIata }} - {{ originIata }}</span>
				</div>
				<div class="price">{{ this.returnTicketFare }}<span class="currency">$</span></div>
				
			</div>

			<div class="total-item">
				<span class="total-title">Total:</span>
				<span class="price total-price">{{ this.totalPrice }}<span class="currency">$</span></span>
			</div>

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

  computed: {
    totalPrice() {
      return this.returnTicketId ? this.outBoundTicketFare + this.returnTicketFare : this.outBoundTicketFare;
    },

    outBoundTicketFare() {
      let outBoundFare = null;
      outBoundFare = this.outBoundFlight.fares.find(fare => fare.fareSellKey === this.outBoundTicketId);
      return outBoundFare.price;
    },

    returnTicketFare() {
      let returnFare = null;
      returnFare = this.returnFlight.fares.find(fare => fare.fareSellKey === this.returnTicketId);
      return returnFare.price;
    }
  },

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
  background: -webkit-linear-gradient(to right, #24243e, #302b63, #0f0c29); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  color: #fff;

  padding: 20px;
  box-shadow: 1px 1px 13px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.summary-title {
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 700;
  padding-bottom: 10px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px;
}

.date-and-place {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.price {
  font-size: 28px;
  font-weight: 500;
}

.currency {
  font-size: 16px;
  margin-left: 5px;
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  margin-top: 15px;
}
</style>
