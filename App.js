import * as React from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';

var cheerio = require('react-native-cheerio');

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

class TopBar extends React.Component {
  render() {
    return (
        <View style={styles.topbar}>
          <Text style={styles.topbarText}>Covid-19: Dobré zprávy</Text>
        </View>
    )
  }
}

class CardHeader extends React.Component {
  render() {
    return (
      <View style={styles.cardHeader}>
         <Text style={styles.cardHeaderText}>{this.props.title}</Text>
      </View>
    )
  }
}

class Header extends React.Component {
  render() {
    return (
    <Text style={{fontSize: 48, fontWeight: "bold", color: "white"}}>{ this.props.children }</Text>
    )
  }
}

class Paragraph extends React.Component {
  render() {
    return (
    <Text style={{fontSize: 24, color: "white", marginBottom: 16}}>{ this.props.children }</Text>
    )
  }
}

class InfoMenuItem extends React.Component {
  render() {
    return (
      <View style={this.props.enabled ? {borderBottomColor: "#441ECC", borderBottomWidth: 2, flex:1} : {borderBottomColor: "#c4c4c4", borderBottomWidth: 2, flex:1}}>
        <TouchableOpacity onPress={this.props.onClick.bind(this.props.this, this.props.pos)}>
          <View>
          <Text style={{fontSize: 24, padding: 8, paddingBottom: 6, textAlign: "center"}}>{this.props.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

class InfoBar extends React.Component {
  state = {
    view: 0
  }

  setPane(pos) {
    this.setState({view: pos})
  }

  render() {
    return (
      <Card style={[styles.cardStyle,{flex: 2, marginRight: 32, height: "100%"}]}>
        <View style={[styles.infoHeader,{flexDirection: "row"}]}>
          <InfoMenuItem title="O co se snažíme" enabled={this.state.view==0} onClick={this.setPane} pos={0} this={this}/>
          <InfoMenuItem title="Hry" enabled={this.state.view==1} onClick={this.setPane} pos={1} this={this}/>
          <InfoMenuItem title="Informace" enabled={this.state.view==2} onClick={this.setPane} pos={2} this={this}/>
        </View>
        <View style={{flex:1, padding: 32}}>
          <Header>Lorem ipsum dolor sit</Header>
          <Paragraph>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis risus. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce aliquam vestibulum ipsum. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Integer malesuada. Nullam sit amet magna in magna gravida vehicula. Aliquam erat volutpat.</Paragraph>
          <Paragraph>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis risus. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce aliquam vestibulum ipsum. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Integer malesuada. Nullam sit amet magna in magna gravida vehicula. Aliquam erat volutpat.</Paragraph>
        </View>
      </Card>
    )
  }
}

export default class App extends React.Component {
  state = {
    numberOfHealed: 0,
  }

  render() {
    return (
      <View style={styles.main} onLayout={this.onResized.bind(this)}>
        <TopBar></TopBar>
        <ImageBackground source={{uri: require('./assets/grad.png')}} style={styles.pageContent} imageStyle={{resizeMode: 'stretch'}}>
          <InfoBar />
          <Card style={[styles.cardStyle,{width: "400px"},{marginLeft: 32}]}>
            <CardHeader title="Náš koronabot" />
          </Card>
        </ImageBackground>
      </View>
    );
  }

  onResized() {
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
    backgroundColor: "#441ECC",
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
  },
  pageContent: {
    paddingHorizontal: 128,
    paddingVertical: 32,
    paddingTop: 16,
    flex: 1,
    flexDirection: "row"
  },
  cardStyle: {
    backgroundColor: "rgba(255,255,255,0.5)"
  },
  cardHeader: {
    width: "100%",
    padding: 8,
    backgroundColor: "white",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
    justifyContent: "center"
  },
  cardHeaderText: {
    fontSize: 24,
  },
  infoHeader: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
    justifyContent: "left"
  },
});
