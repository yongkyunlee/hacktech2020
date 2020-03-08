import React, { Component } from 'react';
import { Input, Dropdown, Select, Button } from 'semantic-ui-react';
import axios from 'axios';

import styles from './MyPlaceUI.module.css';

class MyPlaceUI extends Component {
    state = {
        myPlaceArr: []
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
    }

    render() {
        const options = [
            { key: 'name', text: 'Name', value: 'name' },
            { key: 'address', text: 'Addresss', value: 'address' }
        ]

        const myPlaceInput = (
            <Input type='text' placeholder='Search...' action>
                <input onChange={this.props.onChangeMyPlaceInput} value={this.props.myPlaceInputText}/>
                <Select compact options={options} defaultValue='name' />
                <Button type='submit'>
                    Search
                </Button>
            </Input>
        );

        let myPlaceSuggestionDivArr;
        let myPlaceSaveDiv;
        if (this.props.currMyPlace) {
            myPlaceSaveDiv = (
                <div>
                    <div>{this.props.currMyPlace.text}</div>
                    <Input type='text' placeholder='Save this place as'>
                        <input onChange={this.props.onMyPlaceSaveInput} value={this.props.myPlaceSaveInputText}/>
                    </Input>
                    <Button onClick={this.props.onMyPlaceSave}>
                        Save
                    </Button>
                </div>
            );
        } else if (this.props.myPlaceSuggestionArr && this.props.myPlaceInputText) {
            myPlaceSuggestionDivArr = this.props.myPlaceSuggestionArr.map(suggestion => {
                let text = suggestion.text;
                let magicKey = suggestion.magicKey;
                return (
                    <div className={styles.suggestionItemDiv} key={magicKey}
                        onClick={() => this.props.onClickSuggestion({text, magicKey})}>
                        { text }
                    </div>
                );
            });
        }

        let myPlaceArrDiv;
        console.log(this.props.myPlaceArr);
        if (this.props.myPlaceArr) {
            myPlaceArrDiv = this.props.myPlaceArr.map(myPlace => {
                return (
                    <div key={myPlace.magicKey}>
                        <strong>{myPlace.myPlaceName}</strong> {myPlace.locationName}
                    </div>
                );
            });
        }

        let myPlaceHeader;
        if (this.props.myPlaceArr.length > 0) {
            myPlaceHeader = (
                <div>
                    My Places
                </div>
            )
        }

        return (
            <div>
                { myPlaceHeader }
                { myPlaceArrDiv }
                { myPlaceInput }
                <div>
                    { myPlaceSuggestionDivArr }
                    { myPlaceSaveDiv }
                </div>
            </div>
        )
    }
}

export default MyPlaceUI;