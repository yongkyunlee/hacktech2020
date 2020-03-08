import React from 'react';
import styles from './MyPlaceReport.module.css';

import { Table } from 'semantic-ui-react';

const MyPlaceReport = (props) => {
    let tableData;
    if (props.myPlaceArr && props.myPlaceDataDriveTime && props.myPlaceDataWalkTime) {
        tableData = props.myPlaceArr.map(myPlace => {
            let walkTime = props.myPlaceDataWalkTime[myPlace.myPlaceName];
            let driveTime = props.myPlaceDataDriveTime[myPlace.myPlaceName];
            let walkDistance = props.myPlaceDataWalkDistance[myPlace.myPlaceName];
            let driveDistance = props.myPlaceDataDriveDistance[myPlace.myPlaceName];
            let distance;
            if (walkDistance < driveDistance) {
                distance = walkDistance;
            } else {
                distance = driveDistance;
            }
            return (
                <Table.Row key={myPlace.myPlaceName}>
                    <Table.Cell>{myPlace.myPlaceName}</Table.Cell>
                    <Table.Cell>{distance.toFixed(2) + ' miles'}</Table.Cell>
                    <Table.Cell>{walkTime.toFixed(0) + ' minutes'}</Table.Cell>
                    <Table.Cell>{driveTime.toFixed(0) + ' minutes'}</Table.Cell>
                </Table.Row>
            )
        })
    }
        
    return (
        <div className={styles.reportDiv}>
            <div className={styles.reportTitle}>Time/Distance to My Places</div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>My Place</Table.HeaderCell>
                        <Table.HeaderCell>Distance</Table.HeaderCell>
                        <Table.HeaderCell>Walk Time</Table.HeaderCell>
                        <Table.HeaderCell>Drive Time</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            
                <Table.Body>
                    { tableData }
                </Table.Body>
            </Table> 
        </div>
    )
};

export default MyPlaceReport;