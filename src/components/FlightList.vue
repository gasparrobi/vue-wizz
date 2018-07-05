<template>
    <div class="flight-list-section">

			<!-- FLIGHT ROW -->
			<div v-for="flight in flights" v-bind:key="flight.flightNumber" class="flight-row">

				<div class="date-time-wrapper flight-item">
					<span class="flight-time">{{flight.departure | time}} <i class="fas fa-plane"></i>{{flight.arrival | time}}</span>
				</div>

				<div v-for="ticket in flight.fares" v-bind:key="ticket.fareSellKey" 
            class="flight-item" 
            @click="selectTicket(flight, ticket)"
            v-bind:class="{ inactive: flight.remainingTickets === 0 }">
					<img v-bind:src="ticketIcon(ticket.bundle)" alt='' width="30">
					<span class="ticket-bundle">{{ticket.bundle}}</span>
					<span class="ticket-price"> {{ticket.price}}$</span>
				</div>


			</div>

    </div>
</template>

<script>
import moment from "moment";
const basicImg = require("../assets/basic.png");
const standardImg = require("../assets/standard.png");
const plusImg = require("../assets/plus.png");

export default {
  name: "FlightList",
  props: {
    flights: Array,
    flightType: String
  },

  created() {
    this.flights = this.flights.sort((a, b) => (a.departure > b.departure ? 1 : a.departure < b.departure ? -1 : 0));
  },

  data() {
    return {
      selectedTicket: null,
      selectedFlight: null
    };
  },

  watch: {},

  methods: {
    selectTicket(flight, ticket) {
      if (flight.remainingTickets === 0) {
        return;
      }
      this.selectedFlight = flight;
      this.selectedTicket = ticket;
      this.$emit(this.flightType, {
        selectedFlight: this.selectedFlight,
        selectedTicket: this.selectedTicket.fareSellKey
      });
    },

    ticketIcon(ticketType) {
      return ticketType === "basic" ? basicImg : ticketType === "standard" ? standardImg : plusImg;
    }
  },

  computed: {},

  filters: {
    date(date) {
      return moment(date).format("YYYY MMMM Do");
    },
    time(date) {
      return moment(date).format("HH:mm");
    }
  }
};
</script>

<style scoped>
.flight-list-section {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.flight-row {
  display: flex;
  width: 100%;
  margin-bottom: 15px;
  background: #fff;
  padding: 10px 20px;
  box-shadow: 1px 1px 13px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  /* border-radius: 3px; */
}

.flight-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  padding: 10px;
}

.flight-item:not(:last-of-type) {
  margin-right: 20px;
}

.flight-item:not(:first-of-type) {
  border-radius: 3px;
  cursor: pointer;
  transition: all 200ms;
}

/* .flight-item:nth-of-type(2) {
  border: 1px solid rgba(198, 0, 126, 0.5);
}

.flight-item:nth-of-type(2):hover {
  border: 1px solid rgba(198, 0, 126, 1);
}

.flight-item:nth-of-type(3) {
  border: 1px solid rgba(44, 26, 145, 0.5);
}

.flight-item:nth-of-type(4) {
  border: 1px solid rgba(216, 203, 26, 0.5);
} */

.flight-item:not(:first-of-type):hover {
  background: #0f0c2928;
}

.date-time-wrapper {
  width: 200px;
}

.ticket-bundle {
  font-weight: 700;
  margin: 5px 0;
}

.ticket-price {
  color: rgba(198, 0, 126, 1);
}

.fa-plane {
  margin: 0 15px;
}

.flight-time {
  font-size: 18px;
}

.inactive {
  opacity: 0.3;
  filter: grayscale(100%);
  cursor: not-allowed !important;
}
</style>
