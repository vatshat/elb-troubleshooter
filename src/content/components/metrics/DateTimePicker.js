import React, { Component } from 'react';
import moment from 'moment';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import { Panel } from 'react-bootstrap';

class DatetimePicker extends Component {
    state = { moment: moment() };
  
    handleChange = (moment) => { this.setState({ moment }); }

    render() {
        const shortcuts = {
            'Today': moment(),
            'Yesterday': moment().subtract(1, 'days'),
            'Clear': ''
        };

        return (
            <Panel className={`col-sm-3`} >
                <Panel.Heading>
                    <Panel.Title toggle>Time ranges:</Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                    <Panel.Body>
                        <div className={`timeRange`}>
                            <label><span className="glyphicon glyphicon-time"></span>{' '}Start Time</label>
                            <DatetimePickerTrigger
                                shortcuts={shortcuts} 
                                moment={this.state.moment}
                                onChange={this.handleChange}>
                                <input type="text" value={this.state.moment.format('YYYY-MM-DD HH:mm')} readOnly />
                            </DatetimePickerTrigger>
                        </div>

                        <div className={`timeRange`}>
                            <label><span className="glyphicon glyphicon-time"></span>{' '}End Time</label>
                            <DatetimePickerTrigger
                                shortcuts={shortcuts} 
                                moment={this.state.moment}
                                onChange={this.handleChange}>
                                <input type="text" value={this.state.moment.format('YYYY-MM-DD HH:mm')} readOnly />
                            </DatetimePickerTrigger>
                        </div>
                    </Panel.Body>
                </Panel.Collapse>            
            </Panel>
        );
    }
}

export default DatetimePicker;