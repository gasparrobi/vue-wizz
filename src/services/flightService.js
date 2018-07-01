import axios from "axios";

export default class FlightService {
  stationsApi = "https://mock­-air.herokuapp.com/asset/stations";
  searchFlightsApi = "https://mock­-air.herokuapp.com/search";

  constructor() {}

  async getFlights() {
    const stations = await axios.get(this.stationsApi);
    return stations;
  }

  async searchFlights(searchData) {
    // const searchUrl = `${this.searchFlightsApi}?departureStation=${
    //   searchData.origin
    // }&arrivalStation=${searchData.destination}&date=${searchData.date}`;

    const fakeUrl =
      "https://mock-air.herokuapp.com/search?departureStation=BUD&arrivalStation=LTN&date=2018-04-24";

    // const flights = await axios.get(searchUrl);
    const flights = await axios.get(fakeUrl);

    return flights.data;
  }
}
