import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Store, {Creators} from './redux/store.js';
import PropTypes from 'prop-types';

import CitiesTable from './components/CitiesTable.js';
import AddCity from './components/AddCity.js';

injectTapEventPlugin();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <MuiThemeProvider>
          <Container />
        </MuiThemeProvider>
      </Provider>
    );
  }
}

class _Container extends React.Component {
  componentDidMount() {
    this.props.createCityData();
  }
  render() {
    return (
      <div>
        <CitiesTable />
        <AddCity />
      </div>
    );
  }
}
_Container.propTypes = {
  createCityData: PropTypes.func.isRequired,
}
const Container = connect( null, dispatch => bindActionCreators({
  createCityData: Creators.createCityData,
}, dispatch))(_Container);
