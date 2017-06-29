import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { createReducer, createActions } from 'reduxsauce';
import { Map, List } from 'immutable';
import City from '../lib/City.js'

import mySaga from './saga.js';

const favCitiesAtLocStorage = JSON.parse(localStorage.getItem('favouriteCities'));
const INITIAL_STATE = Map({
  cities: favCitiesAtLocStorage ?
    Map(favCitiesAtLocStorage.map(favCityName =>
      [favCityName, City.loadCity(JSON.parse(localStorage.getItem(favCityName)))]
    ))
    : Map(),
  favouriteCities: favCitiesAtLocStorage ?
  List(favCitiesAtLocStorage)
  : List(),
});

const actions = createActions({
  createCityData: null,
  setCities: ['cities'],
  addCityToFavorites: ['city'],
  saveCityToFavorites: ['cityName'],
  saveCity: ['city'],
  removeCityFromFavorites: ['cityName'],
  getForecast: ['cityName'],
});

export const { Types, Creators } = actions;

const saveCityToFavorites = (state = INITIAL_STATE, {cityName}) => {
  const index = state.get('favouriteCities').indexOf(cityName);
  if (index === -1) {
    return state.set('favouriteCities', state.get('favouriteCities').push(cityName));
  }
  return state;
}

const removeCityFromFavorites = (state = INITIAL_STATE, {cityName}) => {
  const index = state.get('favouriteCities').indexOf(cityName);
  if (index !== -1) {
    return state.set('favouriteCities', state.get('favouriteCities').delete(index));
  }
  return state;
}

const saveCity = (state = INITIAL_STATE, {city}) => {
  return state.setIn(['cities', city.name], city)
}

const setCities = (state = INITIAL_STATE, {cities}) => {
  let mergedCities = cities;
  state.get('cities').map((city, cityName) => {
    mergedCities = mergedCities.set(cityName, city)
  })
  return (state.set('cities', mergedCities));
};

const HANDLERS = {
  [Types.SET_CITIES]: setCities,
  [Types.SAVE_CITY_TO_FAVORITES]: saveCityToFavorites,
  [Types.SAVE_CITY]: saveCity,
  [Types.REMOVE_CITY_FROM_FAVORITES]: removeCityFromFavorites,
}

const reducers = createReducer(INITIAL_STATE, HANDLERS);
const sagaMiddleware = createSagaMiddleware();

const Store = createStore(
  reducers,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(mySaga);

export default Store;
