import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Popover from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators } from '../redux/store.js';
import moment from 'moment';

class FavCityRow extends React.Component {

  constructor(props){
    super(props);
    this.state= {
      openDetails: false,
    };
  }

  openDetails = (event) => {
    //this.props.getForecast();

    this.setState({
      openDetails: true,
      detailsPopoverTarget: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      openDetails: false,
    });
  };

  render() {
    const {city} = this.props;
    const tomorrow = moment().add(1,'days').format('YYYY-MM-DD 12:00:00');
    const afterTomorrow = moment().add(2,'days').format('YYYY-MM-DD 12:00:00');
    return(
      <TableRow>
        <TableRowColumn>{city.name}</TableRowColumn>
        <TableRowColumn>{city.currentTemperature}</TableRowColumn>
        <TableRowColumn>{city.weatherCondition}</TableRowColumn>
        <TableRowColumn>
          <RaisedButton
            label="подробнее"
            primary
            onClick={(event)=> this.openDetails(event)}
          />
          <Popover
            open={this.state.openDetails}
            anchorEl={this.state.detailsPopoverTarget}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
            <h1>прогноз погоды</h1>
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
                  <TableHeaderColumn>Завтра</TableHeaderColumn>
                  <TableHeaderColumn>Послезавтра</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody  displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn>{city.forecast.get(tomorrow)}</TableRowColumn>
                  <TableRowColumn>{city.forecast.get(afterTomorrow)}</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </Popover>
          <RaisedButton
            label="удалить"
            secondary
            onClick={this.props.removeCityFromFavorites}
            style={{margin: 12}}
          />
        </TableRowColumn>
      </TableRow>
    )
  }
}

export default FavCityRow;
