import { Record, Map } from 'immutable';
class City extends Record({
  name: '',
  currentTemperature: 0,
  weatherCondition: '',
  lastUpdate: Date.now(),
  id: 0,
  forecast: Map({}),
}){
  static loadCity(cityObj) {
    return new City({
      name: cityObj.name,
      currentTemperature: cityObj.currentTemperature,
      weatherCondition: cityObj.weatherCondition,
      lastUpdate: cityObj.lastUpdate,
      id: cityObj.id,
      forecast: Map(cityObj.forecast),
    })
  }
}

export default City;
