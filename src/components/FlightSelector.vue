<template>
  <div class='main-wrapper'>

    <section class="left">

      <div class="flight-search">

        <div class="select-wrapper">
          <h5>Origin</h5>
          <v-select 
            class="vue-select"
            id="origin-v-select" 
            v-bind:class="{error_outline: errors.originSelectedError}"
            label="shortName" 
            v-model="originSelected"
            :options="cities"
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
          <div class="datepicker-item" >
            <h5>Return</h5>
            <datepicker 
              class='vue-datepicker'
              :disabled="returnDateDisabled"
              format="yyyy-MM-dd"
              :placeholder="returnPlaceholder"
              monday-first
              :disabledDates="returnDateFromValue"
              v-model="returnDate"
              clear-button
            >
              <span slot="afterDateInput" class="animated-placeholder"></span>
            </datepicker>
          </div>
          
        </div> <!-- datepicker section END -->
      
        <input
          id="search-submit" 
          type="submit"
          @click="submitForm"
          :value="searchButtonTitle"
          v-bind:class="{loadingResults: loadingResults}"
        />
      </div> <!-- flight-search END -->


      <flight-summary v-if="selectedOutboundFlight !== null && originSelected !== null"
        :outBoundFlight="selectedOutboundFlight"
        :outBoundTicketId="selectedOutboundTicketId"
        :returnFlight="selectedReturnFlight"
        :returnTicketId="selectedReturnTicketId"
        :originIata="originSelected.iata"
        :destinationIata="destinationSelected.iata"
        />
      
    </section> <!-- left END -->

    <flight-map 
      v-if="!showResults"
      :originS="this.originSelected"
      :destinationS="this.destinationSelected"
    />
        
    <section class="right" v-if="outBoundFlights.length > 0 && showResults" >
      <flight-list-header
        :origin="originSelected"
        :destination="destinationSelected"
        :flightDate="departureDate"
      />
      
      <flight-list 
        :flights="outBoundFlights"
        :flightType="'outBoundFlight'"
        v-model="selectedOutboundFlight"
        v-on:outBoundFlight="outboundFlightSelected"
      />

      <div class="extra-datepicker-item" v-if="showResults && !extraReturnDate && !returnDate">
        <h5>Return</h5>
        <datepicker 
          class='vue-datepicker'
          :disabled="returnDateDisabled"
          format="yyyy-MM-dd"
          :placeholder="returnPlaceholder"
          monday-first
          :disabledDates="returnDateFromValue"
          clear-button
          v-on:selected="extraReturnSubmit"
        >
          <span slot="afterDateInput" class="animated-placeholder"></span>
        </datepicker>
      </div>

      <div class="return-flight-list" v-if="returnFlights.length > 0 && showResults && (extraReturnDate || returnDate)">
        <flight-list-header
          :origin="destinationSelected"
          :destination="originSelected"
          :flightDate="returnDate || extraReturnDate"
        />
        <flight-list 
          :flights="returnFlights"
          :flightType="'returnFlight'"
          v-model="selectedReturnFlight"
          v-on:returnFlight="returnFlightSelected"
        />
      </div>
      
    </section> <!-- right END -->
        
  </div> <!-- main-wrapper END -->
</template>
<script>
import FlightService from "../services/flightService.js";
import FlightList from "./FlightList.vue";
import FlightListHeader from "./FlightListHeader.vue";
import FlightSummary from "./FlightSummary.vue";
import FlightMap from "./FlightMap.vue";
import moment from "moment";

export default {
  name: "FlightSelector",
  flightService: null,
  props: {},

  components: {
    "flight-list": FlightList,
    "flight-list-header": FlightListHeader,
    "flight-summary": FlightSummary,
    "flight-map": FlightMap
  },

  beforeCreate() {
    this.flightService = new FlightService();
  },

  async mounted() {
    const response = await this.flightService.getFlights();
    this.cities = response.data.sort((a, b) => this.flightCompare(a, b));
  },

  data() {
    return {
      // for searching
      errors: {
        originSelectedError: false,
        destinationSelectedError: false,
        departureDateError: false
      },
      cities: [],
      originSelected: JSON.parse(localStorage.getItem("originSelected")) || null,
      destinationSelected: JSON.parse(localStorage.getItem("destinationSelected")) || null,
      departureDate: null,
      returnDate: null,
      extraReturnDate: null,

      datePickerConfig: {
        disabledDates: {
          to: new Date(Date.now() - 60000)
        }
      },

      //for flight results
      loadingResults: false,
      showResults: false,
      outBoundFlights: [],
      returnFlights: [],
      selectedOutboundFlight: null,
      selectedReturnFlight: null,
      selectedOutboundTicketId: null,
      selectedReturnTicketId: null
    };
  },

  watch: {
    originSelected(val) {
      localStorage.setItem("originSelected", JSON.stringify(this.originSelected));
      if (val === null) {
        this.destinationSelected = null;
      } else {
        this.errors.originSelectedError = false;
      }
      this.showResults = false;
      this.destinationSelected = null;
      this.resetSelectedChoices();
    },

    destinationSelected(val) {
      localStorage.setItem("destinationSelected", JSON.stringify(this.destinationSelected));
      if (val !== null) {
        this.errors.destinationSelectedError = false;
      }
      this.showResults = false;
      this.resetSelectedChoices();
    },

    departureDate(val) {
      if (val !== null) {
        this.errors.departureDateError = false;
      }
      this.returnDate = null;
      this.extraReturnDate = null;
      this.showResults = false;
      this.resetSelectedChoices();
    },

    returnDate() {
      this.showResults = false;
      this.returnFlights = [];
      this.resetSelectedChoices();
    },

    extraReturnDate() {
      this.returnDate = null;
    }
  },

  methods: {
    async submitForm() {
      this.resetSelectedChoices();
      this.errors.originSelectedError = this.originSelected === null;
      this.errors.destinationSelectedError = this.destinationSelected === null;
      this.errors.departureDateError = this.departureDate === null;

      // handle click abuse
      if (!this.isFormValid() || this.loadingResults) return;
      this.loadingResults = true;
      this.extraReturnDate = null;
      try {
        this.outBoundFlights = await this.flightService.searchFlights(
          this.originSelected.iata,
          this.destinationSelected.iata,
          moment(this.departureDate).format("YYYY-MM-DD")
        );
        if (this.returnDate !== null) {
          this.returnFlights = await this.flightService.searchFlights(
            this.destinationSelected.iata,
            this.originSelected.iata,
            moment(this.returnDate).format("YYYY-MM-DD")
          );
        }
      } catch (error) {
        this.$emit("ERROR", "Sorry, we were unable to get results, please try again later");
      }
      this.showResults = true;
      this.loadingResults = false;
    },

    async extraReturnSubmit(date) {
      this.extraReturnDate = date;
      if (date !== null) {
        this.returnFlights = await this.flightService.searchFlights(
          this.destinationSelected.iata,
          this.originSelected.iata,
          moment(date).format("YYYY-MM-DD")
        );
      }
    },

    outboundFlightSelected(choice) {
      this.selectedOutboundFlight = choice.selectedFlight;
      this.selectedOutboundTicketId = choice.selectedTicket;
    },

    returnFlightSelected(choice) {
      this.selectedReturnFlight = choice.selectedFlight;
      this.selectedReturnTicketId = choice.selectedTicket;
    },

    isFormValid() {
      return this.originSelected !== null && this.destinationSelected !== null && this.departureDate !== null;
    },

    resetSelectedChoices() {
      this.selectedOutboundFlight = null;
      this.selectedReturnFlight = null;
      this.selectedOutboundTicketId = null;
      this.selectedReturnTicketId = null;
    },

    flightCompare(a, b) {
      return a.shortName < b.shortName ? -1 : b.shortName < a.shortName ? 1 : 0;
    }
  },

  computed: {
    originFiltered() {
      return this.cities.filter(flight => {
        return flight.shortName.toLowerCase().startsWith(this.originSelected === null ? "" : this.originSelected);
      });
    },

    destinationCities() {
      if (this.originSelected) {
        return this.originSelected.connections
          .map(connection => this.cities.find(station => station.iata === connection.iata))
          .sort((a, b) => this.flightCompare(a, b));
      }
    },

    destinationDisabled() {
      return this.originSelected === null ? true : false;
    },

    returnDateFromValue() {
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

    searchButtonTitle() {
      return this.loadingResults ? "Searching..." : "Search";
    }
  }
};
</script>
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
  height: 100vh;
  padding-top: 20px;
  /* padding: 20px; */
}
.left {
  display: flex;
  flex-direction: column;
  min-width: 320px;
  width: 320px;
}
.flight-search {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 415px;
  height: 415px;
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
  max-height: 100%;
}
@keyframes section-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>