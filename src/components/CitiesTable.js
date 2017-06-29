import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators } from '../redux/store.js';
import { List } from 'immutable';
import PropTypes from 'prop-types';

import FavCityRow from './FavCityRow.js';

class _CitiesTable extends React.Component {
  constructor() {
    super();
  }
  render () {
    return (
      <Table
        selectable={false}
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
          >
          <TableRow>
            <TableHeaderColumn>город</TableHeaderColumn>
            <TableHeaderColumn>температура</TableHeaderColumn>
            <TableHeaderColumn>погодные условия</TableHeaderColumn>
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {
            !!this.props.cities ?
              this.props.cities.map(city => (
                <FavCityRow
                  city={city}
                  removeCityFromFavorites={() => this.props.removeCityFromFavorites(city.name)}
                  key={city.name}
                />
              ))
              : null
          }
        </TableBody>
      </Table>
    );
  }
}
_CitiesTable.propTypes = {
  cities: PropTypes.instanceOf(List).isRequired,
  removeCityFromFavorites: PropTypes.func.isRequired,
  getForecast: PropTypes.func.isRequired,
}

const CitiesTable = connect((state) => ({
  cities: state.get('favouriteCities').map(cityName =>
    state.getIn(['cities', cityName])
  )}), dispatch => bindActionCreators({
  removeCityFromFavorites: Creators.removeCityFromFavorites,
  getForecast: Creators.getForecast,
}, dispatch))(_CitiesTable);

export default CitiesTable;
