import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators } from '../redux/store.js';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

class _AddCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      filteredCities: List(),
      selectedCities: List(),
    };
  }
  handleChange = (event) => {
    const value = event.target.value;
    this.setState({
      value,
      filteredCities: this.props.cities
        .filter(el => el.toLowerCase().search(value.toLowerCase()) >= 0)
        .slice(0,20)
    });
  };

  onUserSelect = (event) => {
    const selectedCities = List(event.map(num => this.state.filteredCities.get(num)));
    this.setState({ selectedCities });
  }

  addCities = (event) => {
    event.preventDefault();
    this.state.selectedCities.map(cityName => this.props.addCityToFavorites(cityName));
    this.setState({ value: '', selectedCities: List(), filteredCities: List() });
  }

  render() {
    return (
      <div>
        <Table
          onRowSelection={this.onUserSelect}
          multiSelectable
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn>
                Введите название города латиницей, и выберите из списка (можно несколько)
              </TableHeaderColumn>
              <TableHeaderColumn>
                <TextField
                  id="text-field-controlled"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} deselectOnClickaway={false}>
            {
              this.state.filteredCities.map( city => (
                <TableRow key={city} selected={this.state.selectedCities.indexOf(city) >= 0}>
                  <TableRowColumn>{city}</TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <RaisedButton
          label="Добавить города"
          primary={true}
          onTouchTap={this.addCities}
        />
      </div>
    );
  }
}
_AddCity.propTypes = {
  cities: PropTypes.instanceOf(List).isRequired,
  addCityToFavorites: PropTypes.func.isRequired,
}

const AddCity = connect((state) => {
  return { cities: state.get('cities').keySeq().toList() };
}, dispatch => bindActionCreators({
  addCityToFavorites: Creators.addCityToFavorites,
}, dispatch))(_AddCity);

export default AddCity;
