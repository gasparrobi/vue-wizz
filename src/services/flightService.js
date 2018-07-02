import axios from "axios";

export default class FlightService {
  stationsApi = "https://mock­-air.herokuapp.com/asset/stations";
  searchFlightsApi = "https://mock­-air.herokuapp.com/search";

  constructor() {}

  async getFlights() {
    const stations = await axios.get(this.stationsApi);
    return stations;
  }

  async searchFlights(origin, destination, date) {
    const searchUrl = `${this.searchFlightsApi}?departureStation=${origin}&arrivalStation=${destination}&date=${date}`;

    const flights = await axios.get(searchUrl);

    return flights.data;
  }
}
