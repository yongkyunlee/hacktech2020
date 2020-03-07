import React, { Component } from 'react';
import styles from './MapUI.module.css';

import { Checkbox, Button } from 'semantic-ui-react';

class MapUI extends Component {
    render() {
        const placeCheckbox = (
            <div>
                <Checkbox label="Coffee Shop" onChange={this.props.toggleCoffeeShop} />
                <Checkbox label="Food" onChange={this.props.toggleFood} />
                <Checkbox label="Gas Station" onChange={this.props.toggleGasStation} />
                <Checkbox label="Parks and Outdoors" onChange={this.props.toggleParksAndOutdoors} />
            </div>
        )
        return (
            <div>
                { placeCheckbox }
            </div>
        )
    }
}

export default MapUI;