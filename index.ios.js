/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, ListView, TouchableHighlight, Image, Text, TextInput, View } from 'react-native';
import Button from 'react-native-button';

//
// class Blink extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {showText: true};
//
//     // Toggle the state every second
//     setInterval(() => {
//       this.setState({ showText: !this.state.showText });
//     }, 1000);
//   }
//
//   render() {
//     let display = this.state.showText ? this.props.text : ' ';
//     return (
//       <Text>{display}</Text>
//     );
//   }
// }
function getChamps(region, name) {
  return fetch('http://localhost:3000/region/' + region + '/username/' + name)
    .then((response) => response.json())
    .then((responseJson) => {
      var champArr = []
      var champsArray = responseJson.champions.forEach(function(obj) {
        if (obj.id != 0) {
          champArr.push(obj);
        }
      });
      return champArr;
    })
    .catch((error) => {
      console.error(error);
    });
}

class AwesomeProject extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      summoner: ''
    };
    this._handlePress = this._handlePress.bind(this);
  }

  _handlePress() {
    var comp = this;
    getChamps('na', this.state.summoner).then(function(val) {
      comp.setState({
        dataSource: comp.state.dataSource.cloneWithRows(val)
      });
    }).catch(function(reason) {
      console.log(reason);
    });

  }

  _renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: 1,
          backgroundColor: '#CCCCCC',
        }}
      />
    );
  }
  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    // var rowHash = Math.abs(hashCode(rowData));
    // var imgSource = THUMB_URLS[rowHash % THUMB_URLS.length];
    var src = rowData.imgUrl;
    var MOCKED_MOVIES_DATA = [
      {title: 'Title of movie', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
    ];
    return (
      <TouchableHighlight onPress={() => {
          // this._pressRow(rowID);
          highlightRow(sectionID, rowID);
        }}>
        <View>
          <View style={styles.row}>
            <Image style={{height: 53, width: 81}} source={{uri: rowData.imgUrl}} />
            <Text style={styles.text}>
              {rowData.champion.name}
            </Text>
            <Text style={stylex.text}>
              {rowData.stats.totalSess}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={{paddingTop: 22, paddingLeft: 10, paddingRight: 10}}>
        <View>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, padding: 10}}
            placeholder="Summoner Name"
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(summoner) => this.setState({summoner})}
          />
          <Button
            style={{fontSize: 20, color: 'green'}}
            styleDisabled={{color: 'red'}}
            onPress={() => this._handlePress()}>
            Press Me!
          </Button>
        </View>
        <View>
          <ListView
            style={{height: 300}}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            enableEmptySections={true}
            showsVerticalScrollIndicator={true}
            renderSeparator={this._renderSeperator}
          />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 50,
    height: 50,
  },
  text: {
    flex: 1,
  },
});


AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
