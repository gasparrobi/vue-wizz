<template>
	<div class='main-wrapper'>

		<div class="left">

			<div class="select-wrapper">
				<h5>Origin</h5>
				<v-select 
					class="vue-select"
					id="origin-v-select" 
					v-bind:class="{error_outline: errors.originSelectedError}"
					label="shortName" 
					v-model="originSelected"
					:options="flightData"
					:searchable=false
					:filterable=false>
				</v-select>
				<span class="error-span" v-if="errors.originSelectedError">Please select origin city</span>
			</div>
			
			<div class="select-wrapper">
				<h5>Destination</h5>
				<v-select 
					class="vue-select"
					id="dest-v-select"
					v-bind:class="{error_outline: errors.destinationSelectedError}"
					:disabled="destinationDisabled" 
					label="shortName" 
					v-model="destinationSelected" 
					:options="destinationCities"
					:searchable=false
					:filterable=false>
				</v-select>
				<span class="error-span" v-if="errors.destinationSelectedError">Please select destination city</span>
			</div>
		
			<div class="datepicker-section">
				<!-- DEPARTURE DATEPICKER -->
				<div class="datepicker-item">

					<h5>Departure</h5>
					<datepicker 
						class='vue-datepicker'
						format="yyyy-MM-dd"
						:placeholder="today"
						:monday-first=true
						:disabledDates="datePickerConfig.disabledDates"
						v-model="departureDate"
						:clear-button=true
					>
						<span slot="afterDateInput" class="animated-placeholder"></span>
					</datepicker>
					<span class="error-span" v-if="errors.departureDateError">Date required</span>
				</div>
				
				<!-- RETURN DATEPICKER -->
				<div class="datepicker-item">
					<h5>Return</h5>
					<datepicker 
						class='vue-datepicker'
						:disabled="returnDateDisabled"
						format="yyyy-MM-dd"
						:placeholder="returnPlaceholder"
						monday-first
						:disabledDates="returnDateFrom"
						v-model="returnDate"
						clear-button
					>
						<span slot="afterDateInput" class="animated-placeholder"></span>
					</datepicker>
				</div>
				
			</div>

			

			<input
				id="search-submit" 
				type="submit"
				@click="submitForm"
				:value="searchTitle"
				v-bind:class="{loading: loading}"
			/>

		</div>

		<div class="right" v-if="outBoundFlights.length > 0" >

			<flight-list 
			:flights="outBoundFlights"
			v-model="selectedOutboundFlight"
			v-on:ticket-selected="outboundFlightSelected"
			>

		</flight-list>

		</div>

		

	</div>
</template>

<script>
import FlightService from "../services/flightService.js";
import FlightList from "./FlightList.vue";
import moment from "moment";

export default {
  name: "FlightSelector",
  flightService: null,
  props: {
    msg: String
  },

  components: {
    "flight-list": FlightList
  },

  beforeCreate() {
    this.flightService = new FlightService();
  },

  async mounted() {
    const response = await this.flightService.getFlights();
    this.flightData = response.data;
    // getting saved data from earlier search
    // this.getDataFromLocalStorage();
  },

  data() {
    return {
      // for searching
      errors: {
        originSelectedError: false,
        destinationSelectedError: false,
        departureDateError: false
      },
      flightData: [],
      originSelected:
        JSON.parse(localStorage.getItem("originSelected")) || null,
      destinationSelected:
        JSON.parse(localStorage.getItem("destinationSelected")) || null,
      departureDate: null,
      returnDate: null,
      datePickerConfig: {
        disabledDates: {
          to: new Date(Date.now() - 60000)
        }
      },
      loading: false,

      //for flight results
      outBoundFlights: [],
      returnFlights: [],

      selectedOutboundFlight: null,
      selectedReturnFlight: null
    };
  },

  watch: {
    originSelected(val) {
      localStorage.setItem(
        "originSelected",
        JSON.stringify(this.originSelected)
      );
      if (val === null) {
        this.destinationSelected = null;
      } else {
        this.errors.originSelectedError = false;
      }
    },

    destinationSelected(val) {
      localStorage.setItem(
        "destinationSelected",
        JSON.stringify(this.destinationSelected)
      );
      console.log("destination selected?: " + val === null);
      if (val !== null) {
        this.errors.destinationSelectedError = false;
      }
    },

    departureDate(val) {
      if (val === null) {
        this.returnDate = null;
      } else {
        this.errors.departureDateError = false;
      }
    }
  },

  methods: {
    async submitForm(e) {
      this.errors.originSelectedError = this.originSelected === null;
      this.errors.destinationSelectedError = this.destinationSelected === null;
      this.errors.departureDateError = this.departureDate === null;

      if (!this.validateForm() || this.loading) {
        return;
      }
      this.loading = true;

      this.outBoundFlights = await this.flightService.searchFlights({
        origin: this.originSelected.iata,
        destination: this.destinationSelected.iata,
        date: moment(this.departureDate).format("YYYY-MM-DD")
      });

      if (this.returnDate !== null) {
        this.returnFlights = await this.flightService.searchFlights({
          origin: this.destinationSelected.iata,
          destination: this.originSelected.iata,
          date: moment(this.returnDate).format("YYYY-MM-DD")
        });
      }

      this.loading = false;
    },

    getDataFromLocalStorage() {
      this.originSelected =
        JSON.parse(localStorage.getItem("originSelected")) || null;
      this.destinationSelected =
        JSON.parse(localStorage.getItem("destinationSelected")) || null;
    },

    outboundFlightSelected(flight) {
      console.log(flight);
    },

    validateForm() {
      return (
        this.originSelected !== null &&
        this.destinationSelected !== null &&
        this.departureDate !== null
      );
    }
  },

  computed: {
    originFiltered() {
      // if(this.originSelected)
      return this.flightData.filter(flight => {
        return flight.shortName
          .toLowerCase()
          .startsWith(this.originSelected === null ? "" : this.originSelected);
      });
    },

    destinationCities() {
      if (this.originSelected) {
        return this.originSelected.connections.map(connection =>
          this.flightData.find(station => station.iata === connection.iata)
        );
      }
    },

    destinationDisabled() {
      return this.originSelected === null ? true : false;
    },

    returnDateFrom() {
      if (null !== this.departureDate) {
        return {
          to: new Date(this.departureDate.getTime() + 86400000)
        };
      }
    },

    returnDateDisabled() {
      return this.departureDate === null;
    },

    today() {
      return moment(new Date()).format("YYYY-MM-DD");
    },

    returnPlaceholder() {
      return this.departureDate
        ? moment(this.departureDate)
            .add(1, "days")
            .format("YYYY-MM-DD")
        : moment(new Date())
            .add(1, "days")
            .format("YYYY-MM-DD");
    },

    searchTitle() {
      return this.loading ? "Loading..." : "Search";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.select-wrapper {
  width: 100%;
}

.select-wrapper:nth-of-type(2) {
  margin-bottom: 30px;
}

.vue-datepicker input {
  background: transparent;
}

.vue-datepicker input::-webkit-input-placeholder {
  opacity: 0.2;
}

.animated-placeholder::before {
  font-family: "Font Awesome 5 Free";
  font-weight: 700;
  content: "\f073";
  left: 10px;
  top: 9px;
  position: absolute;
}

.main-wrapper {
  display: flex;
  /* padding: 20px; */
}

.left {
  display: flex;
  justify-content: center;
  min-width: 320px;
  max-height: 415px;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  background-color: #fff;
  box-shadow: 0px 0px 13px 3px rgba(0, 0, 0, 0.05);
}

.datepicker-section {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
}

h5 {
  margin-bottom: 7px;
  padding-left: 1px;
  color: rgba(198, 0, 126, 1);
  font-weight: 700;
}

#search-submit {
  width: 100%;
  height: 36px;
  /* border: 1px solid rgba(60, 60, 60, 0.26); */
  border: none;
  background: rgba(198, 0, 126, 1);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: 200ms all;
}

#search-submit:focus {
  outline: none;
}

#search-submit:hover {
  background: rgba(198, 0, 126, 0.7);
}

.error-span {
  position: absolute;
  font-size: 11px;
  color: rgb(255, 0, 0);
  font-weight: 700;
}

.right {
  padding-left: 20px;
  padding-right: 20px;
  animation: section-fade-in 500ms forwards;
  overflow-y: scroll;
  max-height: calc(100vh - 80px);
}

@keyframes section-fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.loader,
.loader:after {
  border-radius: 50%;
  width: 15px;
  height: 15px;
}
.loader {
  margin: 0px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 4px solid rgba(255, 255, 255, 0.2);
  border-right: 4px solid rgba(255, 255, 255, 0.2);
  border-bottom: 4px solid rgba(255, 255, 255, 0.2);
  border-left: 4px solid #ffffff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
