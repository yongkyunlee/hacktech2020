import React, { Component } from 'react';

import WebMap from '../WebMap/WebMap';
import MapUI from '../MapUI/MapUI';

class MainPage extends Component {
    state = {
        locations: {
            checkCoffeeShop: false,
            checkGasStation: false,
            checkFood: false,
            checkParksAndOutdoors: false
        }
    }

    toggleCoffeeShop = () => {
        this.setState({
            locations: {
                ...this.state.locations,
                checkCoffeeShop: !this.state.locations.checkCoffeeShop
            }
        });
        // console.log('toogle Coffee Shop');
    }

    toggleGasStation = () => {
        this.setState({
            locations: {
                ...this.state.locations,
                checkGasStation: !this.state.locations.checkGasStation
            }
        });
        // console.log('toogle Gas Station');
    }
    
    toggleFood = () => {
        this.setState({
            locations: {
                ...this.state.locations,
                checkFood: !this.state.locations.checkFood
            }
        });
        // console.log('toogle Food');
    }

    toggleParksAndOutdoors = () => {
        this.setState({
            locations: {
                ...this.state.locations,
                checkParksAndOutdoors: !this.state.locations.checkParksAndOutdoors
            }
        });
        // console.log('toogle Parks and Outdoors');
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <WebMap
                    locations={this.state.locations}
                />
                <MapUI
                    toggleGasStation={this.toggleGasStation}
                    toggleCoffeeShop={this.toggleCoffeeShop}
                    toggleFood={this.toggleFood}
                    toggleParksAndOutdoors={this.toggleParksAndOutdoors}
                />
            </div>
        )
    }
}

export default MainPage;