import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { Map } from 'immutable';
import { Types, Creators } from './store.js';

import City from '../lib/City.js';
import cityIDsSource from '../lib/cityIDs.json';


const fetchCurrentWeather = id => {
  return fetch(`http://api.openweathermap.org/data/2.5/weather?id=${id}&APPID=508b3137b4a792978e3ee7f105145c4c&units=metric&lang=ru`)
  .then(r => r.json());
}

const fetchForecast = id => {
  return fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${id}&APPID=508b3137b4a792978e3ee7f105145c4c&units=metric&lang=ru`)
  .then(r => r.json());
}

function* addCityToFavorites({city: cityName}) {
  yield put (Creators.saveCityToFavorites(cityName));

  let city = yield select(state => state.getIn(['cities', cityName]));

  yield put (Creators.saveCity(city));
  yield call(getWeather, cityName);
  yield call(getForecast, cityName);
}

function* getWeather(cityName) {
  try {
    let city = yield select(state => state.getIn(['cities', cityName]));
    const apiResult = yield call (fetchCurrentWeather, city.id);

    const updatedCity = city.set('currentTemperature', apiResult.main.temp)
    .set('weatherCondition', apiResult.weather[0].description)
    .set('lastUpdate', Date.now());

    yield put (Creators.saveCity(updatedCity));
  } catch (e) {
    console.log('fetching failed with ', e);
  }
}

function* saveCity(city) {
  yield put (Creators.saveCity(city));
}

function* createCityData (action) {
  try {
    const cities = Map(cityIDsSource).map((id, name) => new City({ id, name }))
    yield put (Creators.setCities(cities));
  } catch (e) {
    console.log('error when creating city data ', e);
  }
}

function* getForecast (cityName) {
  let city = yield select(state => state.getIn(['cities', cityName]));
  const apiResult = yield call (fetchForecast, city.id);

  let forecast = Map();
  apiResult.list.map(forecastFrame => {
    forecast = forecast.set(forecastFrame.dt_txt, forecastFrame.weather[0].description);
  });

  yield put (Creators.saveCity(city.set('forecast', forecast)));
}

function* saveToCash() {
  const state = yield select(state => state);
  const listOfFavouriteCities =state.get('favouriteCities');
  const favouriteCitiesData = listOfFavouriteCities.map(favCityName => {
    localStorage.setItem(favCityName, JSON.stringify(state.getIn(['cities', favCityName])));
  });
  localStorage.setItem('favouriteCities', JSON.stringify(listOfFavouriteCities.toJS()));
}

function* mySaga() {
  yield takeLatest(Types.CREATE_CITY_DATA, createCityData);
  yield takeEvery(Types.ADD_CITY_TO_FAVORITES, addCityToFavorites);
  yield takeEvery([Types.SAVE_CITY, Types.REMOVE_CITY_FROM_FAVORITES], saveToCash);
}

export default mySaga;
