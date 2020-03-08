import React, { Component } from 'react';
import styles from './LocationUI.module.css';

import { Form, Checkbox } from 'semantic-ui-react';

class MapUI extends Component {
    render() {
        const placeCheckbox = (
            <div>
                <Form>
                    <Form.Field>
                        <Checkbox label="Coffee Shop" onChange={this.props.toggleCoffeeShop} />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox label="Food" onChange={this.props.toggleFood} />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox label="Gas Station" onChange={this.props.toggleGasStation} />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox label="Parks and Outdoors" onChange={this.props.toggleParksAndOutdoors} />
                    </Form.Field>
                </Form>
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