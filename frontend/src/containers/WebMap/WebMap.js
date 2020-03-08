import React, { Component, useRef } from 'react';
import { loadModules } from 'esri-loader';
import axios from 'axios';
import styles from './WebMap.module.css';
import { Button } from 'semantic-ui-react'

import LocationUI from '../LocationUI/LocationUI';
import MyPlaceUI from '../MyPlaceUI/MyPlaceUI';
import ProximityReport from '../ProximityReport/ProximityReport';
import MyPlaceReport from '../MyPlaceReport/MyPlaceReport';
import Score from '../Score/Score';

const FACILITIES_ARR = ['Metro Station', 'Bus Station', 'Park', 'Coffee shop', 'Gas station', 'Hospital', 'Grocery', 'School']
const FACILITIES_ON_ARR = [0, 0, 0, 0, 0, 0, 0, 0];
const FACILITIES_COLOR_MAP = ['#47476b', '#0033cc', '#339933', '#cc6600', '#000000', '#ee0000', '#3399ff', '#cc0099']
const FACILITIES_CNT_ARR = [10, 10, 10, 10, 5, 10, 10, 10];
const FACILITIES_CNT_REPORT_ARR = [10, 10, 20, 25, 5, 10, 25, 15];
// const FACILITIES_CNT_REPORT_ARR = [1, 1, 1, 1, 1, 1, 1, 1];
const TEMP_TOKEN = 'iBKnYbrbgKtQnWich65JzX2hUav5SPngtJNzPgdBf5Z4trzIBMypMViN9DixdG-ygwnC2sGmo2oEiX_RtfSdM-5zrE6LEu0X9r2WntJowWq4EwyOHQCT46ugGicK_DzP3FkzE6sz1poxSXyAE__IfEjJA3LT2lzIwACzmFjp9DCRrnTa_GqsiX3Pi3EYrQ3eUhw60u1uqsEIRiCFg-UeIc5ewVss_73nNwdc55qY0Qc.';

class WebMap extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.showCoordinates.bind(this);
    }

    state = {
        myPlaceInputText: '',
        myPlaceSuggestionArr: [],
        currMyPlace: null,
        myPlaceSaveInputText: '',
        myPlaceArr: [], // [{locationName, locationMagicKey, myPlaceName, x, y}]
        myPlaceDataWalkTime: {}, // {myPlaceName: time}
        myPlaceDataWalkDistance: {},
        myPlaceDataDriveTime: {}, // {myPlaceName: time}
        myPlaceDataDriveDistance: {}, // {myPlaceName: distance}

        targetLocation: null, // {x, y} - The Location to be Looked At

        walkTimeData: {
            'Metro Station': [],
            'Bus Station': [],
            'Coffee shop': [],
            'Park': [],
            'Gas station': [],
            'Hospital': [],
            'Grocery': [],
            'School': []
        }
    }

    showCoordinates = (pt) => {
        var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) + 
                    " | Scale 1:" + Math.round(this.view.scale * 1) / 1 +
                    " | Zoom " + this.view.zoom;
        console.log(coords);
    }

    setTargetLocationOnMap = (graphic, pt) => {
        const point = {
            type: "point",
            longitude: pt.longitude,
            latitude: pt.latitude
        };
        
        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],  // orange
            outline: {
                color: [255, 255, 255], // white
                width: 1
            }
        };
   
        const pointGraphic = new this.graphicModule({
            geometry: point,
            symbol: simpleMarkerSymbol
        });

        this.view.popup.close();
        this.view.graphics.removeAll();
        for (let idx = 0; idx < this.state.myPlaceArr.length; idx++) {
            this.addMyPlaceOnMap({x: this.state.myPlaceArr[idx].x, y: this.state.myPlaceArr[idx].y})
        }
        this.view.graphics.add(pointGraphic);
    }

    addMyPlaceOnMap = (pt) => {
        const point = {
            type: "point",
            longitude: pt.x,
            latitude: pt.y
        };
        
        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 10, 10],  // red
            style: 'diamond',
            outline: {
                color: [0, 0, 0], // black
                width: 1
            }
        };
   
        const pointGraphic = new this.graphicModule({
            geometry: point,
            symbol: simpleMarkerSymbol
        });

        this.view.graphics.add(pointGraphic);
    }

    onToggleFacility = (idx) => {
        console.log(idx);
    }

    onChangeMyPlaceInput = (event) => {
        this.setState({
            myPlaceInputText: event.target.value,
            currMyPlace: null,
            myPlaceSaveInputText: ''
        });
        if (event.target.value !== '') {
            this.myPlaceSuggestion(event.target.value);
        }
    }

    myPlaceSuggestion = (text) => {
        const baseUrl = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&searchExtent=-74.214,40.610,-73.515,41.171";
        const location = this.view.center.longitude + "," + this.view.center.latitude;
        const url = encodeURI(baseUrl + "&text=" + text + "&location=" + location);
        axios.get(url)
            .then(res => {
                // console.log(res.data.suggestions);
                this.setState({myPlaceSuggestionArr: res.data.suggestions});
            })
    }

    onClickSuggestion = (myPlaceInfo) => {
        this.setState({currMyPlace: myPlaceInfo});
    }

    onMyPlaceSaveInput = (event) => {
        this.setState({
            myPlaceSaveInputText: event.target.value
        });
    }

    onMyPlaceSave = () => {
        const locationName = this.state.currMyPlace.text;
        const locationMagicKey = this.state.currMyPlace.magicKey;
        const myPlaceName = this.state.myPlaceSaveInputText
        const baseUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&';
        const url = baseUrl + 'singleLine=' + locationName;
        axios.get(encodeURI(url))
            .then(res => {
                if (res.data.candidates.length > 0) {
                    const longitude = res.data.candidates[0].location.x;
                    const latitude = res.data.candidates[0].location.y;
                    this.setState({
                        myPlaceArr: this.state.myPlaceArr.concat({
                            locationName: locationName,
                            locationMagicKey: locationMagicKey,
                            myPlaceName: myPlaceName,
                            x: longitude,
                            y: latitude
                        }),
                        myPlaceInputText: '',
                        currMyPlace: null,
                        myPlaceSuggestionArr: [],
                        myPlaceSaveInputText: ''
                    }, () => {
                        this.addMyPlaceOnMap({x: longitude, y: latitude})
                    });
                }
            });   
    }

    findPlaces(categories, maxLocations) {
        let pt;
        if (!this.state.targetLocation) {
            pt = this.view.center;
        } else {
            pt = this.state.targetLocation;
        }
        
        return this.locator.addressToLocations({
            location: pt,
            categories: categories,
            maxLocations: maxLocations,
            outFields: ["Place_addr", "PlaceName"]
        })
    }

    updateMap = (graphic) => {
        const categories = [];
        const categoryColors = [];
        const categoryCounts = [];
        for (let idx = 0; idx < FACILITIES_ARR.length; idx++) {
            if (FACILITIES_ON_ARR[idx]) {
                categories.push(FACILITIES_ARR[idx]);
                categoryColors.push(FACILITIES_COLOR_MAP[idx]);
                categoryCounts.push(FACILITIES_CNT_ARR[idx]);
            }
        }
        this.view.popup.close();
        this.view.graphics.removeAll();
        this.setTargetLocationOnMap(graphic, this.state.targetLocation);

        for (let idx = 0; idx < categories.length; idx++) {
            this.findPlaces([categories[idx]], categoryCounts[idx])
                .then(results => {
                    // console.log(results);
                    results.forEach(result => {
                        this.view.graphics.add(
                            new graphic({
                                attributes: result.attributes,
                                geometry: result.location,
                                symbol: {
                                    type: "simple-marker",
                                    style: 'square',
                                    color: categoryColors[idx],
                                    size: "11px",
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
        
    }

    getTravelTime = (pt1, pt2, travelMode) => {
        let url = "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve";
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const data = new FormData();
        data.set('f', 'json');
        data.set('token', TEMP_TOKEN);
        data.set('stops', JSON.stringify({
            "type": "features",
            "features":  [
                {
                    "geometry": {
                        "x": pt1.x,
                        "y": pt1.y,
                        "spatialReference": {
                            "wkid": "4326"
                        }
                    }
                },
                {
                    "geometry": {
                        "x": pt2.x,
                        "y": pt2.y,
                        "spatialReference": {
                            "wkid": "4326"
                        }
                    }
                }
            ]
        }));
        if (travelMode === 'walk') {
            data.set('travelMode', JSON.stringify({"attributeParameterValues":[{"parameterName":"Restriction Usage","attributeName":"Walking",
            "value":"PROHIBITED"},{"parameterName":"Restriction Usage","attributeName":"Preferred for Pedestrians",
            "value":"PREFER_LOW"},{"parameterName":"Walking Speed (km/h)","attributeName":"WalkTime","value":5}],
            "description":"Follows paths and roads that allow pedestrian traffic and finds solutions that optimize travel time. The walking speed is set to 5 kilometers per hour.",
            "impedanceAttributeName":"WalkTime","simplificationToleranceUnits":"esriMeters",
            "uturnAtJunctions":"esriNFSBAllowBacktrack","restrictionAttributeNames":["Preferred for Pedestrians","Walking"],
            "useHierarchy":false,"simplificationTolerance":2,"timeAttributeName":"WalkTime",
            "distanceAttributeName":"Miles","type":"WALK","id":"caFAgoThrvUpkFBW","name":"Walking Time"}))
        }
        return axios.post(url, data, config);
    }

    getMyPlaceTravel = (myPlace) => {
        console.log(myPlace);
        const targetLocation = {
            x: this.state.targetLocation.longitude,
            y: this.state.targetLocation.latitude
        };
        const myPlaceLocation = {
            x: myPlace.x,
            y: myPlace.y
        };
        this.getTravelTime(targetLocation, myPlaceLocation, 'drive')
            .then(res => {
                this.setState({
                    ...this.state,
                    myPlaceDataDriveTime: {
                        ...this.state.myPlaceDataDriveTime,
                        [myPlace.myPlaceName]: res.data.routes.features[0].attributes.Total_TravelTime
                    },
                    myPlaceDataDriveDistance: {
                        ...this.state.myPlaceDataDriveDistance,
                        [myPlace.myPlaceName]: res.data.routes.features[0].attributes.Total_Miles
                    }
                });
            });
        this.getTravelTime(targetLocation, myPlaceLocation, 'walk')
            .then(res => {
                this.setState({
                    ...this.state,
                    myPlaceDataWalkTime: {
                        ...this.state.myPlaceDataWalkTime,
                        [myPlace.myPlaceName]: res.data.routes.features[0].attributes.Total_WalkTime
                    },
                    myPlaceDataWalkDistance: {
                        ...this.state.myPlaceDataWalkDistance,
                        [myPlace.myPlaceName]: res.data.routes.features[0].attributes.Total_Miles
                    }
                });
            });
    }

    getNumberInWalkingDistance = (category, nLocations) => {
        let travelTime5 = 0;
        let travelTime10 = 0;
        let travelTime15 = 0;
        this.findPlaces([category], nLocations)
            .then((res) => {
                for (const item of res) {
                    let pt1 = {
                        x: this.state.targetLocation.longitude,
                        y: this.state.targetLocation.latitude
                    }
                    let pt2 = {x: item.location.x, y: item.location.y}
                    this.getTravelTime(pt1, pt2, 'walk')
                        .then(resTime => {
                            console.log(resTime);
                            this.setState({
                                ...this.state,
                                walkTimeData: {
                                    ...this.state.walkTimeData,
                                    [category]: this.state.walkTimeData[category].concat(resTime.data.routes.features[0].attributes.Total_WalkTime)
                                }
                            });
                        });
                }
            });
    }

    generateReport = () => {
        for (let idx = 0; idx < FACILITIES_ARR.length; idx++) {
            this.getNumberInWalkingDistance(FACILITIES_ARR[idx], FACILITIES_CNT_REPORT_ARR[idx]);
        }
        for (let idx = 0; idx < this.state.myPlaceArr.length; idx++) {
            this.getMyPlaceTravel(this.state.myPlaceArr[idx]);
        }
    }

    getPointTract = () => {
        const query = {
            geometry: this.state.targetLocation,
            distance: 2,
            spatialRelationship: 'intersect',
            outFields: ["Point_Count"],
            returnGeometry: true,
            // where: sqlExpression
        };
        console.log(query);
        this.nypdComplaintLayer.queryFeatures(query).then(result => {
            console.log(query);
            console.log(result);
        });
    }

    componentDidMount() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        loadModules(['esri/Map', 'esri/views/MapView', "esri/widgets/BasemapGallery", "esri/tasks/Locator",
                     "esri/Graphic", "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer"], { css: true })
            .then(([ArcGISMap, MapView, BasemapGallery, Locator, Graphic, GraphicsLayer, FeatureLayer]) => {
                const map = new ArcGISMap({
                    basemap: 'topo-vector'
                });
        
                this.view = new MapView({
                    container: this.mapRef.current,
                    map: map,
                    center: [-73.965519, 40.783474], // central park
                    zoom: 12
                });

                // ***** Create Map Toggle Widget *****
                const facilitiesWidget = document.createElement("div");
                const arr = [];
                for (let idx = 0; idx < FACILITIES_ARR.length; idx++) {
                    localStorage.setItem('facility' + idx, 0)
                    let checkbox = document.createElement("div");
                    let checkboxInput = document.createElement("input");
                    checkboxInput.type = "checkbox"
                    checkboxInput.id = FACILITIES_ARR[idx].replace(/ /g, '_');
                    checkboxInput.name = FACILITIES_ARR[idx].replace(/ /g, '_');
                    checkboxInput.value = FACILITIES_ARR[idx].replace(/ /g, '_');
                    checkboxInput.onclick = function () {
                        let prevState = localStorage.getItem('facility' + idx);
                        let nextState;
                        if (prevState === "0") {
                            nextState = 1;
                        } else {
                            nextState = 0;
                        }
                        localStorage.setItem('facility' + idx, nextState);
                    }
                    let checkboxLabel = document.createElement("label");
                    checkboxLabel.for = FACILITIES_ARR[idx].replace(/ /g, '_');
                    checkboxLabel.textContent = FACILITIES_ARR[idx];
                    checkbox.appendChild(checkboxInput);
                    checkbox.appendChild(checkboxLabel);
                    facilitiesWidget.appendChild(checkbox);
                }

                let facilityButton = document.createElement('button');
                facilityButton.textContent = "Show Facilities";
                facilityButton.id = "facilityButton";
                facilitiesWidget.appendChild(facilityButton)

                facilitiesWidget.id = "facilitiesWidget";
                facilitiesWidget.className = "esri-widget esri-component";
                facilitiesWidget.style.padding = "7px 15px 5px";
                this.view.ui.add(facilitiesWidget, "bottom-right");

                this.locator = new Locator({
                    url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
                });

            
                // // Add event to show mouse coordinates on click and move ***//
                // this.view.on(["pointer-down", "pointer-move"], evt => {
                //     this.showCoordinates(this.view.toMap({ x: evt.x, y: evt.y }));
                // });

                // Add event to save the place you want to look at
                this.view.on(["double-click"], event => {
                    const targetLocation = this.view.toMap({x: event.x, y: event.y});
                    this.setState({
                        ...this.state,
                        targetLocation: targetLocation,
                        walkTimeData: {
                            'Metro Station': [],
                            'Bus Station': [],
                            'Coffee shop': [],
                            'Park': [],
                            'Gas station': [],
                            'Hospital': [],
                            'Grocery': [],
                            'School': []
                        }
                    }, () => {
                        this.setTargetLocationOnMap(Graphic, targetLocation);
                    })
                });

                // ***** LOCATION FINDER ***** 
                document.getElementById('facilityButton').addEventListener('click', () => {
                    for (let idx = 0; idx < FACILITIES_ARR.length; idx++) {
                        let facilityVal = parseInt(localStorage.getItem('facility' + idx));
                        if (isNaN(facilityVal) || facilityVal === 0) {
                            facilityVal = 0;
                        } else {
                            facilityVal = 1;
                        }
                        FACILITIES_ON_ARR[idx] = facilityVal;
                    }
                    this.updateMap(Graphic);
                });

                this.graphicModule = Graphic;

                this.nypdComplaintLayer = new FeatureLayer({
                    url: 'https://services7.arcgis.com/wNLHtVTLZ9qrfNoj/arcgis/rest/services/956637/FeatureServer/0?token=-S4fdJxK6GSAFIE2WvM9rbYVYk8LzWhwMr3CmNz-rxiK26vVO6WcAYMRwR7ox-eq0t316AHe-AQQrHejm0QUPHeYmivWuqHykIMFVvHam7PMmdybbMphsVnmnuVrXGVLb-ladt1JT_XxnttsyE5PYZ66Xq5oyBBUgFFE4vJG4p-z98WmiGjaPFL0b1PYK9M5W1hR-4DfcIBC4e-vqTY-14WkMSZ9wcNW785aOLm16Ew.'
                });

                // map.add(this.nypdComplaintLayer)
            });
    }
    
    componentWillUnmount() {
        if (this.view) {
            // destroy the map view
            this.view.container = null;
        }
    }
    
    render() {
        // console.log(this.state);
        let walkTimeCntSum = 0;
        for (let idx = 0; idx < FACILITIES_CNT_REPORT_ARR.length; idx++) {
            walkTimeCntSum += FACILITIES_CNT_REPORT_ARR[idx];
        }
        let proximityReportDiv;
        if (Object.keys(this.state.walkTimeData).reduce((t, key) => t + this.state.walkTimeData[key].length, 0) === walkTimeCntSum) {
            proximityReportDiv = (
                <ProximityReport 
                    walkTimeData={this.state.walkTimeData}
                    facilityArr={FACILITIES_ARR}
                />
            );
        }
        let myPlaceReportDiv;
        if (this.state.myPlaceArr.length === Object.keys(this.state.myPlaceDataWalkTime).length &&
            this.state.myPlaceArr.length === Object.keys(this.state.myPlaceDataDriveTime).length &&
            this.state.myPlaceArr.length > 0) {
            myPlaceReportDiv = (
                <MyPlaceReport
                    myPlaceArr={this.state.myPlaceArr}
                    myPlaceDataDriveTime={this.state.myPlaceDataDriveTime}
                    myPlaceDataDriveDistance={this.state.myPlaceDataDriveDistance}
                    myPlaceDataWalkTime={this.state.myPlaceDataWalkTime}
                    myPlaceDataWalkDistance={this.state.myPlaceDataWalkDistance}
                />
            );
        }

        let scoreDiv;
        if (Object.keys(this.state.walkTimeData).reduce((t, key) => t + this.state.walkTimeData[key].length, 0) === walkTimeCntSum &&
            this.state.myPlaceArr.length === Object.keys(this.state.myPlaceDataWalkTime).length &&
            this.state.myPlaceArr.length === Object.keys(this.state.myPlaceDataDriveTime).length) {
            console.log('score');
            scoreDiv = (
                <Score
                    myPlaceArr={this.state.myPlaceArr}
                    myPlaceDataDriveDistance={this.state.myPlaceDataDriveDistance}
                    walkTimeData={this.state.walkTimeData}
                />
            )
        }

        let reportButton;
        if (this.state.targetLocation) {
            reportButton = (
                <Button onClick={this.generateReport} color='green'>
                    Generate Report
                </Button>
            );
        }
        return (
            <div>
                <div className={styles.webmap} ref={this.mapRef} />
                <MyPlaceUI
                    onChangeMyPlaceInput={this.onChangeMyPlaceInput}
                    myPlaceInputText={this.state.myPlaceInputText}
                    myPlaceSuggestionArr={this.state.myPlaceSuggestionArr}
                    onClickSuggestion={this.onClickSuggestion}
                    currMyPlace={this.state.currMyPlace}
                    onMyPlaceSaveInput={this.onMyPlaceSaveInput}
                    myPlaceSaveInputText={this.state.myPlaceSaveInputText}
                    onMyPlaceSave={this.onMyPlaceSave}
                    myPlaceArr={this.state.myPlaceArr}
                />
                <div className={styles.reportButtonDiv}>
                    { reportButton }
                </div>
                { scoreDiv }
                { proximityReportDiv }
                { myPlaceReportDiv }
                {/* <Button onClick={this.getPointTract}>Test Query</Button> */}
            </div>  
        );
    }
}

export default WebMap;
