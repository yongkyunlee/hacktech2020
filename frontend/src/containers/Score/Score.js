import React from 'react';

import styles from './Score.module.css';

const Score = (props) => {
    console.log(props);
    let sum = 0;
	var variance = 0;
	var score = 0;
	var CRIME_DEDUCTION = 0.01; // Adjust based on the average crime rate?
 
	for (let i = 0; i < props.myPlaceArr.length; i++) {
        sum += props.myPlaceDataDriveDistance[props.myPlaceArr[i].myPlaceName];
        console.log(sum);
    }
    if (props.myPlaceArr.length > 0) {
        sum = sum / props.myPlaceArr.length;
        console.log(sum);
    }
	for (let i = 0; i < props.myPlaceArr.length; i++) {
		variance += Math.pow(props.myPlaceDataDriveDistance[props.myPlaceArr[i].myPlaceName] - sum, 2); 
	}
 
    // Bonus points if the location is central to saved places places.
    let multiplier;
    if (sum > 0) {
        multiplier = 3 - variance / sum;
    } else {
        multiplier = 3;
    }

	if (multiplier <= 1) {
		multiplier = 1;
	}
 
	// Add points for location being close to saved places.
	if (sum <= 2) {
		score += multiplier * 25;
	}
	else if (sum <= 4) {
		score += multiplier * 20;
	}
	else if (sum <= 6) {
		score += multiplier * 15;
	}
	else {
		score += multiplier * 10;
	}
 
    // Add points for amenities and important amenities
    let gasWalk = props.walkTimeData['Gas station'].filter(walkTime => walkTime <= 5).length;
    let coffeeWalk = props.walkTimeData['Coffee shop'].filter(walkTime => walkTime <= 5).length;
    let groceryWalk = props.walkTimeData['Grocery'].filter(walkTime => walkTime <= 5).length;
    let hospitalWalk = props.walkTimeData['Hospital'].filter(walkTime => walkTime <= 5).length;
    let schoolWalk = props.walkTimeData['School'].filter(walkTime => walkTime <= 5).length;
    let amenities = gasWalk + coffeeWalk + groceryWalk + hospitalWalk + schoolWalk;
	if (amenities >= 25) {
		score += 30;
	}
	else if (amenities >= 15) {
		score += 20;
	}
	else if (amenities >= 5) {
		score += 10;
	}
 
    // Park, Bus Stop, Metro
    let parkWalk = props.walkTimeData['Park'].filter(walkTime => walkTime <= 5).length;
    let busWalk = props.walkTimeData['Bus Station'].filter(walkTime => walkTime <= 5).length;
    let metroWalk = props.walkTimeData['Metro Station'].filter(walkTime => walkTime <= 5).length;
    let important = parkWalk + busWalk + metroWalk;
    if (important >= 10) {
		score += 20; 
	}
	else if (important >= 5) {
		score += 10;
	}
	else if (important >= 1) {
		score += 5;
    }
 
    // Deduct based on level of crime.
    let crime = Math.floor(Math.random() * 100);
    score -= crime * CRIME_DEDUCTION;
    
    console.log({sum: sum, variance: variance, crime: crime, multiplier: multiplier, amenities: amenities, important: important, score: score});
 
    // A, B, C, F rankings
    let grade;
	if (score >= 100) {
		grade = 'A';
	}
	else if (score >= 80) {
		grade = 'B';
	}
	else if (score >= 60) {
		grade = 'C';
	}
	else {
		grade = 'D';
    }

    const price = 47.8 + 5.91201707 * coffeeWalk + 2.98409494 * busWalk + 4.74535538 * parkWalk + 11.00613309 * metroWalk + -1.15525725 * schoolWalk;

    return (
        <div className={styles.scoreDiv}>
            <div className={styles.scoreNumDiv}>Living Score: <strong>{grade}</strong></div>
            <div>Fair AirBnB Value: <strong>${price.toFixed(2)}</strong></div>
        </div>
    )
}

export default Score;