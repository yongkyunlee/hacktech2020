import React from 'react';
import styles from './ProximityReport.module.css';
import { Table, Icon, Tab } from 'semantic-ui-react';

const ProximityReport = (props) => {
    let tableData;
    if (props.facilityArr) {
        tableData = props.facilityArr.map(facility => {
            let walk5 = props.walkTimeData[facility].filter(walkTime => walkTime <= 5).length;
            let walk10 = props.walkTimeData[facility].filter(walkTime => 5 < walkTime && walkTime <= 10).length;
            let walk15 = props.walkTimeData[facility].filter(walkTime => 10 <= walkTime).length;
    
            return (
                <Table.Row key={facility}>
                    <Table.Cell>{facility}</Table.Cell>
                    <Table.Cell>{walk5}</Table.Cell>
                    <Table.Cell>{walk10}</Table.Cell>
                    <Table.Cell>{walk15}</Table.Cell>
                </Table.Row>
            );
        });
    }
    
    return (
        <div className={styles.reportDiv}>
            <div className={styles.facilityTitle}>Proximity to Facilities</div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Facilities</Table.HeaderCell>
                        <Table.HeaderCell>Within 5-minute Walk</Table.HeaderCell>
                        <Table.HeaderCell>Within 10-minute Walk</Table.HeaderCell>
                        <Table.HeaderCell>Within 15-minute Walk</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            
                <Table.Body>
                    { tableData }
                </Table.Body>
            </Table> 
        </div>
    );
}

export default ProximityReport;