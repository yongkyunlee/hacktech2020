import React, { Component, useRef } from 'react';
import { loadModules } from 'esri-loader';
import styles from './WebMap.module.css';
import { Button } from 'semantic-ui-react'

import MapUI from '../MapUI/MapUI';

class WebMap extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.showCoordinates.bind(this);
    }

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
    
    showCoordinates = (elem, pt) => {
        var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) + 
                    " | Scale 1:" + Math.round(this.view.scale * 1) / 1 +
                    " | Zoom " + this.view.zoom;
        elem.innerHTML = coords;
    }

    findPlaces(categories, pt) {
        return this.locator.addressToLocations({
            location: pt,
            categories: categories,
            maxLocations: 25,
            outFields: ["Place_addr", "PlaceName"]
        })
    }

    updateFilter = (graphic) => {
        // apply locations
        const categories = [];
        if (this.state.locations.checkCoffeeShop) {
            categories.push('Coffee shop');
        }
        if (this.state.locations.checkFood) {
            categories.push('Food');
        }
        if (this.state.locations.checkGasStation) {
            categories.push('Gas station');
        }
        if (this.state.locations.checkParksAndOutdoors) {
            categories.push('Parks and Outdoors')
        }
        console.log(categories);
        this.findPlaces(categories, this.view.center)
            .then(results => {
                console.log(results);
                this.view.popup.close();
                this.view.graphics.removeAll();
                results.forEach(result => {
                    this.view.graphics.add(
                        new graphic({
                            attributes: result.attributes,
                            geometry: result.location,
                            symbol: {
                                type: "simple-marker",
                                color: "#000000",
                                size: "12px",
                                outline: {
                                color: "#ffffff",
                                width: "2px"
                                }
                            },
                            popupTemplate: {
                                title: "{PlaceName}",
                                content: "{Place_addr}"
                            }
                        }));
                    });
                });
    }

    componentDidMount() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        loadModules(['esri/Map', 'esri/views/MapView', "esri/widgets/BasemapGallery", "esri/tasks/Locator",
                     "esri/Graphic"], { css: true })
            .then(([ArcGISMap, MapView, BasemapGallery, Locator, Graphic]) => {
                const map = new ArcGISMap({
                    basemap: 'topo-vector'
                });
        
                this.view = new MapView({
                    container: this.mapRef.current,
                    map: map,
                    center: [-73.965519, 40.783474], // central park
                    zoom: 13
                });

                // ***** BASIC MAP CONFIG ***** 
                const coordsWidget = document.createElement("div");
                coordsWidget.id = "coordsWidget";
                coordsWidget.className = "esri-widget esri-component";
                coordsWidget.style.padding = "7px 15px 5px";
                this.view.ui.add(coordsWidget, "bottom-right");
                
                // Add event and show center coordinates after the view is finished moving e.g. zoom, pan ***//
                this.view.watch(["stationary"], () => {
                    this.showCoordinates(coordsWidget, this.view.center);
                });
            
                // Add event to show mouse coordinates on click and move ***//
                this.view.on(["pointer-down","pointer-move"], evt => {
                    this.showCoordinates(coordsWidget, this.view.toMap({ x: evt.x, y: evt.y }));
                });

                const basemapGallery = new BasemapGallery({
                    view: this.view,
                    source: {
                        portal: {
                            url: "https://www.arcgis.com",
                            useVectorBasemaps: true  // Load vector tile basemaps
                        }
                    }
                });
                // this.view.ui.add(basemapGallery, "top-right");

                // ***** LOCATION FINDER ***** 
                this.locator = new Locator({
                    url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
                });
  
                document.getElementById('updateButton').addEventListener('click', () => {
                    this.updateFilter(Graphic);
                });

                
            //   // Listen for category changes and find places
            //   select.addEventListener('change', function (event) {
            //     findPlaces(event.target.value, view.center);
            //   });
            });
    }
    
    componentWillUnmount() {
        if (this.view) {
            // destroy the map view
            this.view.container = null;
        }
    }
    
    render() {
        
        return (
            <div>
                <div className={styles.webmap} ref={this.mapRef} />
                <MapUI
                    toggleGasStation={this.toggleGasStation}
                    toggleCoffeeShop={this.toggleCoffeeShop}
                    toggleFood={this.toggleFood}
                    toggleParksAndOutdoors={this.toggleParksAndOutdoors}
                />
                <Button id='updateButton'>
                    Update Filter
                </Button>
            </div>  
        );
    }
}

export default WebMap;
