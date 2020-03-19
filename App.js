import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Image, Animated, ScrollView } from 'react-native';

var cheerio = require('react-native-cheerio');

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

const FadeInView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0))  // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
      }
    ).start();
  }, [])

  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,         // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
}

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
    view: 0,
    opacity: new Animated.Value(0),
    itemHeight: 0
  }

  setPane(pos) {
    this.setState({view: pos})
    this.animateText()
  }

  componentDidMount() {
    this.animateText()
  }

  animateText() {
    const reset = this.reset();
    reset.start(() => {
      const tim = this.timing();
      tim.start();
    });
    
  }

  timing() {
    return Animated.timing(
      this.state.opacity,
      {
        toValue: 1,
        duration: 500,
      },
    )
  }

  reset() {
    return Animated.timing(
      this.state.opacity,
      {
        toValue: 0,
        duration: 1,
      },
    )
  }

  render() {
    return (
      <Card style={[styles.cardStyle,{flex: 2, marginRight: this.props.margin}]} onLayout={this.props.onLayout}>
        <View style={[styles.infoHeader,{flexDirection: "row"}]}>
          <InfoMenuItem title="O co se snažíme" enabled={this.state.view==0} onClick={this.setPane} pos={0} this={this}/>
          <InfoMenuItem title="Hry" enabled={this.state.view==1} onClick={this.setPane} pos={1} this={this}/>
          <InfoMenuItem title="Informace" enabled={this.state.view==2} onClick={this.setPane} pos={2} this={this}/>
        </View>
        
        <Animated.View style={{height: "100%", maxHeight: "800px", padding: 32, opacity: this.state.opacity}}>
          <ScrollView ref={this.scrollview}>
            { this.state.view==0 &&
              <View>
              <Header>Lorem ipsum dolor sit</Header>
              <Paragraph>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis risus. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce aliquam vestibulum ipsum. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Integer malesuada. Nullam sit amet magna in magna gravida vehicula. Aliquam erat volutpat.</Paragraph>
              <Paragraph>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis risus. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce aliquam vestibulum ipsum. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Integer malesuada. Nullam sit amet magna in magna gravida vehicula. Aliquam erat volutpat.</Paragraph>
              <Paragraph>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis risus. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce aliquam vestibulum ipsum. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Integer malesuada. Nullam sit amet magna in magna gravida vehicula. Aliquam erat volutpat.</Paragraph>
              <Paragraph>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis risus. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce aliquam vestibulum ipsum. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Integer malesuada. Nullam sit amet magna in magna gravida vehicula. Aliquam erat volutpat.</Paragraph>
              </View>
            }
          </ScrollView>
        </Animated.View>
      </Card>
    )
  }
}

export default class App extends React.Component {
  state = {
    numberOfHealed: 0,
    mobile: false,
    compactMode: false
  }

  render() {
    return (
      <View style={styles.main}>
        <TopBar></TopBar>
        <ImageBackground source={{uri: require('./assets/grad.png')}} imageStyle={{resizeMode: 'stretch'}}>
          <View style={[styles.pageContent,this.state.mobile || this.state.compactMode ? 
          {flexDirection: "column-reverse", 
          paddingHorizontal: 64,
          paddingVertical: 32,
          paddingTop: 16,
          justifyContent: "center"} : 

          {flexDirection: "row"
          }]}>
            <InfoBar onLayout={(event) => {this.onResized(event.nativeEvent.layout)}} margin={this.state.mobile || this.state.compactMode ? 0 : 32}/>

            <Card style={[styles.cardStyle, this.state.mobile || this.state.compactMode ? {height: "600px", marginBottom: 32} : {width: "400px", height: "600px", marginLeft: 32}]}>
              <CardHeader title="Náš koronabot" />
              <ScrollView>
                
              </ScrollView>
            </Card>
          </View>
        </ImageBackground>
      </View>
    );
  }

  onResized(layout) {
    if (layout.width < 400 && !this.state.compactMode) {
      this.setState({compactMode: true})
    }

    if (layout.width > 1000 && this.state.compactMode) {
      this.setState({compactMode: false})
    }
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
    var ua = navigator.userAgent
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4))) 
    {this.setState({mobile: true})};
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
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 48,
  },
  pageContent: {
    paddingHorizontal: 128,
    paddingVertical: 32,
    paddingTop: 16,
    flex: 1,
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
