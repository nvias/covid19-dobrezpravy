import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

var cheerio = require('react-native-cheerio');

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

class TopBar extends React.Component {

  render() {
    return (
        <View style={styles.topbar}>
          <Text style={styles.topbarText}>Dobré zprávy o Koronaviru</Text>
        </View>
    )
  }
}

export default class App extends React.Component {
  state = {
    numberOfHealed: 0
  }

  render() {
    return (
      <View style={styles.main}>
        <TopBar></TopBar>
        <Card>
          <Text>Počet uzdravených: {this.state.numberOfHealed}</Text>
        </Card>
      </View>
    );
  }

  getCovidRecovered() {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQuDj0R6K85sdtI8I-Tc7RCx8CnIxKUQue0TCUdrFOKDw9G3JRtGhl64laDd3apApEvIJTdPFJ9fEUL/pubhtml?gid=0&single=true").then(
        (htmlString) => htmlString.text()).then((response) =>
        {
          console.log("getting recovered")
          var $ = cheerio.load(response);
          var body = $("body > #sheets-viewport > #0 > div > table > tbody > tr > td.s1");
          console.log(body.contents().length)
          var healed = 0
          for (var i = 0; i < body.contents().length/5; i++) {
            healed += parseInt(body.eq((i*5)+2).html());
          }
          this.setState({numberOfHealed: healed})
        }
    )
}

  componentDidMount() {
    //getCovidRecovered()
    this.getCovidRecovered()
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "black",
    flex:1
  },
  topbar: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingVertical: 16,
  },
  topbarText: {
    color: "white",
    width: "100%",
    textAlign: "left",
    fontStyle: "italic",
    paddingLeft: 16,
    fontSize: 48,
  }
});
