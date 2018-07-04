<template>
    <div class="header-wrapper">
      <div class="from-to-wrapper">
        <div class="from-to">
          <span class="iata">{{ origin.iata }}</span>
          <span class="city" >{{ origin.shortName }}</span>
        </div>
        <div class="from-to-wrapper">
          <span class="one sp"></span>
          <span class="two sp"></span>
          <span class="three sp"></span>
          <span class="four sp"></span>
          <span class="five sp"></span>
          <span class="item"><i class="fas fa-plane "></i></span>
          <span class="six sp"></span>
          <span class="seven sp"></span>
          <span class="eight sp"></span>
          <span class="nine sp"></span>
          <span class="ten sp"></span>
        </div>
        <div class="from-to">
          <span class="iata">{{ destination.iata }}</span>
          <span class="city" >{{ destination.shortName }}</span>
        </div>
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
  position: relative;
  width: 100%;
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #fff;
  box-shadow: 1px 1px 13px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  /* border-radius: 3px; */
  justify-content: space-between;
  align-items: center;

  background: #0f0c29; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #24243e, #302b63, #0f0c29); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  color: #fff;
}

.flight-date {
  font-weight: 500;
  position: absolute;
  bottom: 10px;
  color: rgba(255, 255, 255, 0.9);
}

.from-to-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.fas {
  color: #fff;
}

.sp {
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 1);
  border-radius: 50%;
}

.one {
  background: rgba(255, 255, 255, 0.1);
}

.two {
  background: rgba(255, 255, 255, 0.3);
}

.three {
  background: rgba(255, 255, 255, 0.5);
}

.four {
  background: rgba(255, 255, 255, 0.7);
}

.five {
  background: rgba(255, 255, 255, 0.9);
}

.six {
  background: rgba(255, 255, 255, 0.9);
}

.seven {
  background: rgba(255, 255, 255, 0.7);
}

.eight {
  background: rgba(255, 255, 255, 0.5);
}

.nine {
  background: rgba(255, 255, 255, 0.3);
}

.ten {
  background: rgba(255, 255, 255, 0.1);
}

.from-to {
  padding: 10px 30px;
  font-weight: 500;
  letter-spacing: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 1);
}

.iata {
  font-size: 38px;
}

.city {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  width: 150px;
  position: absolute;
  bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
