import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Image, Animated, ScrollView, FlatList, TouchableHighlight, Button } from 'react-native';
import Iframe from 'react-iframe'
import { MaterialIcons } from '@expo/vector-icons';
import Hyperlink from 'react-native-hyperlink'
import Webcam from "react-webcam";

var cheerio = require('react-native-cheerio');

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// or any pure javascript modules available in npm
import { Card, TouchableRipple } from 'react-native-paper';

class TopBar extends React.Component {
  state = {
    showStats: false,
    healed: 0,
    infected: 0
  }

  componentDidMount() {
    fetch("https://covid19-dobrezpravy--danielsykora.repl.co/czstats").then((response) => response.text()).then((response) => {
      response = JSON.parse(response)
      this.setState({showStats: true, healed: response.healed, infected: response.infected})
    })
  }

  render() {
    return (
        <ImageBackground source={{uri: require('./assets/grad.png')}} imageStyle={{resizeMode: 'stretch'}} style={[styles.topbar,{alignItems: "center"}, this.props.compact ? {flexDirection: "column"} : {flexDirection: "row"}]}>
          <Text style={styles.topbarText}>Covid-19: Dobré zprávy</Text>
          { this.state.showStats &&
          <View style={{flexDirection: "row"}}>
            <Image source={{uri: require("./assets/plus-thick.png")}} style={[{width: 32, height: 32}, this.props.compact ? {} : {marginLeft: 16}]}/>
            <Text style={{color: "#76FF03", height: "100%", alignSelf: "center", fontFamily: "Inter, sans-serif", fontSize: 24, marginLeft: 4}}>{this.state.healed}</Text>
          </View>
          }  
          { this.state.showStats &&
          <View style={{flexDirection: "row"}}>
            <Image source={{uri: require("./assets/biohazard.png")}} style={[{width: 32, height: 32}, this.props.compact ? {} : {marginLeft: 16}]}/>
            <Text style={{color: "#D50000", height: "100%", alignSelf: "center", fontFamily: "Inter, sans-serif", fontSize: 24, marginLeft: 4}}>{this.state.infected}</Text>
          </View>
          }
        </ImageBackground>
    )
  }
}

class CardHeader extends React.Component {
  render() {
    return (
      <View style={styles.cardHeader}>
         <Text style={styles.cardHeaderText}>{this.props.title}</Text>
      </View>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
    <Text style={{fontSize: 48, fontWeight: 700, fontFamily: "Inter, sans-serif", color: "white", textDecorationLine: 'underline', paddingBottom: 8}}>{ this.props.children }</Text>
    );
  }
}

class SubHeader extends React.Component {
  render() {
    return (
    <Text style={{fontSize: 28, fontWeight: 700, fontFamily: "Inter, sans-serif", color: "white", paddingBottom: 8}}>{ this.props.children }</Text>
    );
  }
}

class News extends React.Component {
  render() {
    return (
        <Card style={{marginVertical: 8}}>
          <View style={!this.props.mobile ? {flexDirection: "row", padding: 8} : {flexDirection: "column", padding: 8}}>
            <Image source={{uri: this.props.lnk}} style={[{borderRadius: 4, borderColor: "lightgray", borderWidth: 1},!this.props.mobile ? {height: 128, width: 128} : {height: 128, width: "100%", marginBottom: 16}]}/>
            <View style={{flexDirection: "column", marginLeft: 8, flex:1}}>
              <Text style={{fontSize: 20, fontWeight: 700, fontFamily: "Inter, sans-serif", color: "black", paddingBottom: 8}}>{"„" +  this.props.heading + "“"}</Text>
              <Text style={{fontSize: 16, color: "black", marginBottom: 16, fontFamily: "Crimson Text, serif"}}>{ this.props.article }</Text>
            </View>
          </View>
        </Card>
    )
  }
}

class Paragraph extends React.Component {
  render() {
    return (
    <Text style={{fontSize: 24, color: "white", marginBottom: 14, fontFamily: "serif"}}>{ this.props.children }</Text>
    )
  }
}

class InfoMenuItem extends React.Component {
  render() {
    return (
      <View style={this.props.enabled ? {borderBottomColor: "#441ECC", borderBottomWidth: 2, flex:1} : {borderBottomColor: "#c4c4c4", borderBottomWidth: 2, flex:1}}>
        <TouchableOpacity onPress={this.props.onClick.bind(this.props.this, this.props.pos)}>
          <View>
          <Text style={{fontSize: 24, fontFamily: "Inter, sans-serif", padding: 8, paddingBottom: 6, textAlign: "center"}}>{this.props.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const WebcamCapture = props =>{
    const camera = React.createRef();
    const capture = React.useCallback(
      () => {
        setError(false)
        const imageSrc = camera.current.getScreenshot();
        fetch('https://Covid19-DobreZpravy--danielsykora.repl.co/emotion_predict', {
          method: 'POST',
          body: imageSrc
        }).then((response) => {
          return response.text();
        })
        .then((data) => {
          data = JSON.parse(data);
          if (data.length == 0) {
            setError(true)
          } else {
            shuffle(data);
            props.askCorona(["Výstup z kamery: Naštvaný","Výstup z kamery: Znechucený","Výstup z kamery: Vystrašený","Výstup z kamery: Šťastný","Výstup z kamery: Neutrální","Výstup z kamery: Smutný","Výstup z kamery: Překvapený"][["Angry","Disgusted","Fearful","Happy","Neutral","Sad","Surprised"].indexOf(data[0])])
          }
        });
      }
    );

  const state = {
    cameraHeight: 600,
  }

  const [hasError, setError] = useState(false);

  const shrinkCamera = () => {
    capture()
  }

  const videoConstraints = {
    facingMode: "user",
  }
    return (
      <View style={{}}>
        <Text style={{color: "white",textAlign: "center",fontSize: 32,fontFamily: "Inter, sans-serif",fontWeight: 700, marginBottom: 10}}>Tvoje kamera</Text>
          <View style={{}}>
            <Webcam 
            videoConstraints={videoConstraints}
            audio={false}
            ref={camera}
            screenshotFormat="image/jpeg"
            style={{width: "100%",maxHeight: state.cameraHeight}}
            />
          </View>
        { hasError &&
        <View style={{alignItems: "center", marginTop: 16}}>
          <Text style={{color: "white",textAlign: "center",fontSize: 32,fontFamily: "Inter, sans-serif",fontWeight: 700, marginBottom: 10}}>Nenašli jsme žádnou emoci</Text>
          <Paragraph>Zkuste kameru použít z jiného úhlu.</Paragraph>
        </View>
        }
        <View style={{backgroundColor:"#441ECC", borderRadius: 20, padding: 8, paddingHorizontal: 12, margin: 8, maxWidth: 150, alignSelf: "center"}}>
          <TouchableOpacity onPress={shrinkCamera}>
            <Text style={{color: "white",textAlign: "center",fontSize: 20,fontFamily: "Inter, sans-serif"}}>Vyfotit</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

class InfoBar extends React.Component {
  state = {
    view: 1,
    opacity: new Animated.Value(0),
    itemHeight: 0,
    news: [],
    showGame: false,
    shrinkGameIcon: false,
    canCastScreenshot: false
  }

  setPane(pos) {
    if (pos != this.state.view) {
      this.setState({view: pos})
      window.location.hash = ["kamera","hra","info"][pos]
      this.animateText()
      this.setState({showGame: false});
    }
  }

  componentDidMount() {
    fetch("https://colon-yrroux.firebaseio.com/news.json").then(response => response.text()).then(response => {
      response = JSON.parse(response);
      this.setState({news: response})
    });
    this.animateText();
    this.setState({view: Math.abs(["#kamera","#hra","#info"].indexOf(window.location.hash))})
    
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


  roundTo(r, to) {
    for (let i = 0; i < r.length % to; i++) {
      r.push("")
    }
    return r;
  }

  onResized(l) {
    if (l.height > l.width && !this.state.shrinkGameIcon) {
      this.setState({shrinkGameIcon: true})
    } else if (l.height * 2.3 < l.width && this.state.shrinkGameIcon) {
      this.setState({shrinkGameIcon: false})
    }
  } 

  cameraReceivedMedia() {
    this.setState({canCastScreenshot:true});
  }

  render() {
    return (
      <Card style={[styles.cardStyle,{flex: 2, marginRight: this.props.margin}]} onLayout={this.props.onLayout}>
        <View style={[styles.infoHeader,{flexDirection: "row"}]}>
          <InfoMenuItem title="KoronaHra" enabled={this.state.view==1} onClick={this.setPane} pos={1} this={this}/>
          <InfoMenuItem title="Kamera" enabled={this.state.view==0} onClick={this.setPane} pos={0} this={this}/>
          <InfoMenuItem title="Informace" enabled={this.state.view==2} onClick={this.setPane} pos={2} this={this}/>
        </View>
        
        <Animated.View style={[{height: "100%", opacity: this.state.opacity},this.props.mobile ? {} : {height:"800px"}]}>
          <ScrollView ref={this.scrollview} style={{padding: 32}}>
            { this.state.view==0 &&
                <WebcamCapture askCorona={this.props.askCorona} onUserMedia={this.cameraReceivedMedia}/>
            }
            { this.state.view==1&&!this.state.showGame &&
              <View style={[{flex:1},this.props.compactMode ? {margin:0} : {margin:32}]}>
                <TouchableOpacity onPress={() => {if (!this.props.mobile) {this.setState({showGame: true});} else {window.open("https://scratch.mit.edu/projects/215556802/embed","_blank");}}}>
                <Image onLayout={(event) => {this.onResized(event.nativeEvent.layout)}}  style={[{width:"100%",flex:1, alignSelf: "center", marginBottom: 8, backgroundColor: "#005959", borderRadius: 4},this.state.shrinkGameIcon ? {height:300} : {height:640}]} source={{uri: require("./assets/game_icons/covid-shooter.png")}} resizeMode='contain'/>
                </TouchableOpacity>
              <Text style={{flex:1,textAlign: "center", color: "white", fontSize: 18, fontFamily: "Inter, sans-serif"}}>Na virus se zbraní (Stiskni pro spuštění)</Text>
              </View>
            }
            { this.state.view==1&&this.state.showGame &&
              <View style={{flex:1}}>
                <Iframe url="https://scratch.mit.edu/projects/377501008/embed"
                  width="100%"
                  height="700"
                  />
              </View>
            }
            { this.state.view==2 &&
            <View>
              <Header>Proč?</Header>
              <Paragraph>Chceme ukázat jak umělá inteligence může pomáhat. Šíříme dobré zprávy a tím podporujeme dobrou náladu v aktuální situaci.{"\n"}...a také se chceme pochlubit, co kluci dokáží :-)</Paragraph>

              <Header>Jak?</Header>
              <Paragraph>Účastníci kroužku nvias.org Program pro AI tvůrce pro Vás připravili ukázku využití umělé inteligence pro řešení problémů související se šířením Koronaviru. Na projektu pracovalo 8 kluků ve věku 12 - 15 let. První verze vznikla během jednoho týdne, kde se kluci potkali 2x na online kroužku a následně pracovali i mimo čas kroužku - veškerá komunikace probíhala také online.</Paragraph>
            
              <Header>Co?</Header>
              <SubHeader>1. Hra</SubHeader>
              <Paragraph>Můžete si zahrát hru, kde bojujete proti šíření koronaviru a kde se i dozvíte, jaké ochranné pomůcky byste měli používat.</Paragraph> 

              <SubHeader>2. Koronabot</SubHeader>
              <Paragraph>Chatbot, se kterým si můžete popovídat o koronaviru trošku z jiného pohledu. Chatbot se Vám bude snažit odpovídat v podobě dobrých zpráv. Chatbot stále kluci doplňují, takže na Vás může čekat vždy nová zpráva.</Paragraph>
              <Paragraph>Pokud budete mít nějaký tip na doplnění dialogů, napište na info@nvias.org.</Paragraph>
              
              <Hyperlink onPress={ (url, text) => window.open(url,"_blank")} linkStyle={{color:"#441ECC",textDecorationLine: "underline"}}>
              <Paragraph>Nebo také můžete rovnou napsat na GitHub https://github.com/nvias/covid19-dobrezpravy/</Paragraph>
              </Hyperlink>
              
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
    compactMode: false,
    compactNews: false,
    botmessage: "",
    coronaBotMessages: [],
    hints: ["Ahoj!"],
    showHints: true,
    isBotWriting: false,
    gameMenuCols: 3,
    keyRender: 0
  }

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.chat = React.createRef();
  }

  render() {
    return (
      <View style={styles.main} imageStyle={{resizeMode: 'contain'}}>
        <TopBar compact={this.state.compactMode || this.state.mobile}></TopBar>
        <View>
          <View style={[styles.pageContent,this.state.mobile || this.state.compactMode ? 
          {flexDirection: "column-reverse", 
          paddingHorizontal: 16,
          paddingVertical: 32,
          paddingTop: 16,
          justifyContent: "center"} : 
          {flexDirection: "row"
          }]}>
            <InfoBar askCorona={this.askCoronaBot.bind(this)} compactNews={this.state.compactNews} compactMode={this.state.compactMode} mobile={this.state.mobile} onLayout={(event) => {this.onResized(event.nativeEvent.layout)}} margin={this.state.mobile || this.state.compactMode ? 0 : 32} gameMenuCols={this.state.gameMenuCols}/>

            <Card style={[styles.cardStyle, this.state.mobile || this.state.compactMode ? {marginBottom: 32} : {width: "400px",marginLeft: 32},{height:"600px"}]}>
              <CardHeader title="Náš koronabot" />
              <ScrollView ref={this.chat} style={[{flexDirection: "column-reverse"},this.state.coronaBotMessages.length > 5 ? {maxHeight:"532px"} : {maxHeight:"534px"}]}>
              <FlatList
              data={this.state.coronaBotMessages.concat(this.state.isBotWriting ? [{by:"writing"}] : [])}
              renderItem={this.botMessages}
              style={{width: "100%", height:"100%", flexDirection: "column-reverse", padding: 8, paddingVertical: 4}}
              listKey="games"
              extraData={this.state.botMessages}
              />

              <View style={{flexDirection: "column", backgroundColor: "white"}}>
              <FlatList
                  data={this.state.hints}
                  renderItem={({item, index}) => {
                    return (
                      <View style={{backgroundColor:"#e0e0e0", borderRadius: 20, padding: 8, paddingHorizontal: 12, margin: 8}}>
                        <TouchableOpacity onPress={() => {
                          this.askCoronaBot(item);
                          this.setState({botmessage:""});
                          this.textInput.clear();
                          this.setState({hints:[],showHints: false});
                        }}>
                          <View style={{backgroundColor:"#e0e0e0", borderRadius: 20}}>
                            <Text style={{color:"#2d2d2d", fontFamily: "Inter, sans-serif", fontSize: 20}}>{item}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  }}
                  numColumns={4}
                  style={[{flex:1}]}
                  removeClippedSubviews={true}
                  columnWrapperStyle={{ flexWrap: 'wrap', flex: 1}}
                  listKey="hints"
                />
                </View>
              </ScrollView>
              <View style={{flexDirection: "row"}}>
                <TextInput maxLength={256} style={{width: "100%", height: "48px", backgroundColor: "white", borderBottomLeftRadius: "4px", paddingHorizontal: 10, fontFamily: "Inter, sans-serif", fontSize: 20}}
                onSubmitEditing={this.submit} placeholder="Pište zprávu sem..." onChangeText={(text) => this.setState({botmessage:text})} ref={input => { this.textInput = input }}/>
                <TouchableHighlight onPress={this.submit}>
                  <MaterialIcons name="send" color="#441ECC" size={36} style={{padding: 6, backgroundColor: "white", borderBottomRightRadius: "4px"}}/>
                </TouchableHighlight>
              </View>
            </Card>
          </View>
        </View>
        <ImageBackground imageStyle={{resizeMode: 'stretch'}} source={{uri: require('./assets/footer.png')}} style={{height: 100, width: "100%", justifyContent: "center", alignItems: "center"}}>
        <TouchableHighlight onPress={this.nviasLink} style={{width: 165}}>
          <Image
            style={{width: 165, height: 72, alignSelf: "center"}}
            source={{uri: 'https://www.nvias.org/wp-content/uploads/2017/05/nvias_logo-e1496052667955.png'}}
          />
        </TouchableHighlight>
        </ImageBackground>
      </View>
    );
  }

  botMessages = ({item, index}) => {
    if (item["by"] !== undefined) {
      if (item.by == "writing") {
        return (
          <View style={{backgroundColor:"#e0e0e0", padding: 8, paddingHorizontal: 12, alignSelf: "flex-start", marginVertical: 4, borderRadius: 20}}>
              <Text style={{color:"#2d2d2d", fontStyle:"italic", fontFamily: "Inter, sans-serif", fontSize: 20}}>Píše...</Text>
            </View>
        )
      }

      if (item.by == "error") {
        return (
          <View style={{backgroundColor:"red", padding: 8, paddingHorizontal: 12, alignSelf: "flex-start", marginVertical: 4, borderRadius: 20}}>
              <Text style={{color:"#white", fontFamily: "Inter, sans-serif", fontSize: 20}}>Promiňte, nejsem nyní k dispozici. Zkuste to znovu později.</Text>
            </View>
        )
      }

      if (item.by == "image") {
        return (
            <View style={{backgroundColor:"white", padding: 8, paddingHorizontal: 12, marginVertical: 4, borderRadius: 20}}>
              <TouchableHighlight onPress={() => window.open(item.msg,"_blank")}>
              <Image source={{uri: item.msg}} style={{height: "250px", width: "100%", borderRadius: 20}} resizeMode='contain'/>
              </TouchableHighlight>
              <Text style={{color:"#2d2d2d", fontStyle:"italic", fontFamily: "Inter, sans-serif", fontSize: 16, textAlign: "center"}}>Klikněte pro zobrazení v plné velikosti</Text>
            </View>
        )
      }

      if (item.by == "me") {
        return (
          <View style={{backgroundColor:"#441ECC", padding: 8, paddingHorizontal: 12, alignSelf: "flex-end", marginVertical: 4, borderRadius: 20, maxWidth: "80%"}}>
            <Text style={{color:"white", fontFamily: "Inter, sans-serif", fontSize: 20}}>{item.msg}</Text>
          </View>
        )
        } else {
          return (
            <Hyperlink onPress={ (url, text) => window.open(url,"_blank")} linkStyle={{color:"#441ECC",textDecorationLine: "underline"}}>
              <View style={{backgroundColor:"white", padding: 8, paddingHorizontal: 12, alignSelf: "flex-start", marginVertical: 4, borderRadius: 20, maxWidth: "80%"}}>
                <Text style={{color:"black", fontFamily: "Inter, sans-serif", fontSize: 20}}>{item.msg}</Text>
              </View>
            </Hyperlink>
          )
        }
      }
    }
  
  sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

  submit() {
    if (this.state.botmessage != "") {
      this.askCoronaBot(this.state.botmessage);
      this.setState({botmessage:"",hints:[],showHints: false});
      this.textInput.clear();
      this.textInput.current.focus();
    }
  }

  scrollToMyRef = () => window.scrollTo(0, this.chat.current.offsetBottom) 

  askCoronaBot(q) {
    this.scrollToMyRef()
    let msgs = this.state.coronaBotMessages
    msgs.push({by: "me", msg: q})
    console.log(msgs)
    this.setState({coronaBotMessages: msgs})
    this.sleep(700).then(() => {
      this.setState({isBotWriting: true});
      fetch("https://covid19-dobrezpravy--danielsykora.repl.co/dfbot2?query=" + encodeURI(q), {method: 'POST'}).then((reply) => reply.text()).then((text) => {

        text = JSON.parse(text);
        console.log(text);
        if ("pld" in text) {
          if ("hints" in text.pld) {
            if ("listValue" in text.pld.hints) {
              var showhints = [];
              for (let i = 0; i < text.pld.hints.listValue.values.length; i++) {
                var e = text.pld.hints.listValue.values[i];
                showhints.push(e.stringValue);
              };
            };
        };
          if ("picture" in text.pld) {
            if ("stringValue" in text.pld.picture) {
              var pictureLink = text.pld.picture.stringValue;
        };
      };
    };
        this.coronaReply(text.text, showhints, pictureLink);

      }).catch((error) => {
        console.error(error);
        this.setState({isBotWriting: false});
        let msgs = this.state.coronaBotMessages
        msgs.push({by: "error"})
        this.setState({coronaBotMessages: msgs})
      });
    })
  }

  coronaReply(q, h, pic) {
    this.sleep(150).then(() => {
      this.setState({isBotWriting: false});
      this.sleep(150).then(() => {
        let msgs = this.state.coronaBotMessages;
        msgs.push({by: "bot", msg: q});
        if (h == undefined) {
          h = [];
        };
        if (pic != undefined) {
          msgs.push({by: "image", msg: pic});
        };
        this.setState({coronaBotMessages: msgs, hints: h});
      });
    });
  };

  nviasLink() {
    window.location.replace("https://www.nvias.org");
  }

  onResized(layout) {
    if (layout.width < 600 && this.state.compactNews) {
      this.setState({compactNews: false})
    }

    if (layout.width < 400 && !this.state.compactNews) {
      this.setState({compactNews: true})
    }

    if (layout.width < 400 && !this.state.compactMode) {
      this.setState({compactMode: true})
      this.setState({compactNews: false})
    }

    if (layout.width > 1100 && this.state.compactMode) {
      this.setState({compactMode: false})
    }

    if (layout.width > 1000) {
      this.setState({gameMenuCols: 3})
    } else if (layout.width < 1000 && layout.width > 700) {
      this.setState({gameMenuCols: 2})
    } else {
      this.setState({gameMenuCols: 1})
    }
  }

  loadRawHtmlModules() {
    var css = "@import url('https://rsms.me/inter/inter.css'); div.r-overflowX-11yh6sk > div.css-view-1dbjc4n > div.css-view-1dbjc4n:empty {display:none;} div.r-11yh6sk > div.css-1dbjc4n > div.css-1dbjc4n:empty {display:none;}",
    // Tohle importuje písmo z webfontu.
    // Také se zde nachází workaround pro edge, do kterého se z
    // neznámého důvodu přidával prázdný blok do chatu. Toto CSS ho skryje.
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet){
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  componentDidMount() {
    //getCovidRecovered()
    var ua = navigator.userAgent
    this.loadRawHtmlModules();
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4))) 
    {this.setState({mobile: true,keyRender:1})};
    this.setState({keyRender:1});
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "black",
    flex:1,
    backgroundImage: "url(" + require('./assets/bg.jpg') + ")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center", 
    backgroundAttachment: "fixed",
    backgroundSize: "cover"
  },
  topbar: {
    width: "100%",
    //backgroundColor: "#441ECC",
    justifyContent: "center",
    paddingVertical: 16,
  },
  topbarText: {
    color: "white",
    textAlign: "center",
    fontSize: 48,
    fontFamily: "Inter, sans-serif",
    fontWeight: 700
  },
  pageContent: {
    paddingHorizontal: 128,
    paddingVertical: 32,
    paddingTop: 16,
    flex: 1,
  },
  cardStyle: {
    backgroundColor: "rgba(255,255,255,0.3)"
  },
  cardHeader: {
    width: "100%",
    padding: 8,
    backgroundColor: "white",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: "center"
  },
  cardHeaderText: {
    fontSize: 24,
    fontFamily: "Inter, sans-serif",
  },
  infoHeader: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: "flex-start"
  },
});
