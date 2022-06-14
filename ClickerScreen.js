import styles from "./style";
import * as React from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { modalChat, fetchChat } from "./utils.js"
import { version, ChatContext } from "./global.js"


let newvalueclicker = 0;
let previousValueClicker = 0;
let locationX = 0
let locationY = 0;
let globalX = 0;
let globalY = 0;
let globalZ = 0;
let start_press = 0;
let time_press = 0;
let presses = [];


export function ClickerScreen() {
    const [myRank, setRanks] = React.useState([]);
    const [count, setCount] = React.useState([]);
    const [allUserNames, setUserNames] = React.useState([]);
    const [index, setMyIndex] = React.useState(0);
    const [speed, setSpeed] = React.useState(0);
    const [HH, setHH] = React.useState(1);
    const [chatText, setChatText] = React.useState("");
    const [localText, setLocalText] = React.useState("");
    const chatcontext = React.useContext(ChatContext);
    const [data, setData] = React.useState({
        x: 0,
        y: 0,
        z: 0,
      });
      const [subscription, setSubscription] = React.useState(null);
    
      const _slow = () => {
        Accelerometer.setUpdateInterval(1000);
      };
    
    
      const _subscribe = () => {
        setSubscription(
          Accelerometer.addListener(accelerometerData => {
            setData(accelerometerData);
          })
        );
      };
    
      const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
      };
    
      const { x, y, z } = data;
    React.useEffect(() => {
        fetch_clicker(setUserNames, setCount, setRanks, setMyIndex, true, setHH);
        previousValueClicker = newvalueclicker;
        let intervalClicker = setInterval(() => pushClicker(setUserNames, setCount, setRanks, setMyIndex, setSpeed, setHH), 3000);
        var chatInterval = setInterval(() => fetchChat("Clicker", setChatText, chatcontext.setNewMessage), 3000);
        _subscribe();
        _slow();
        return () => {
            clearInterval(intervalClicker);
            clearInterval(chatInterval);
           _unsubscribe();
        }
    }, [chatcontext.chatName]);
    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: HH == 2 ? 'black' : 'lightgrey' }}>
            <ChatContext.Consumer>
                {value => modalChat(value, chatText, setChatText, localText, setLocalText, "Clicker", username)}

            </ChatContext.Consumer>
            <Image style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: HH == 2 ? 1 : 0 }} source={require("./assets/HH.gif")} />
            <View style={{ flex: 5 }}>
                <ScrollView >

                    <View style={{ justifyContent: "space-between", flex: 6 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', borderColor: "grey", borderWidth: 1 }}>
                            <Text style={{ flex: 1, textAlign: 'center', color: HH == 2 ? 'white' : 'black' }}>Rank</Text>
                            <Text style={{ flex: 3, textAlign: 'center', color: HH == 2 ? 'white' : 'black' }}>User</Text>
                            <Text style={{ flex: 3, textAlign: 'center', color: HH == 2 ? 'white' : 'black' }}>Clicks</Text>
                            <View style={styles.medailleopaque}></View>
                        </View>
                        {allUserNames.map((r, index) =>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", borderColor: "grey", borderWidth: 1 }}>
                                <View style={{ flex: 1 }}><Text style={{ textAlign: 'center', color: HH == 2 ? 'white' : 'black' }}>{myRank[index]}</Text></View>
                                <View style={{ flex: 3 }}><Text style={{ textAlign: 'center', color: HH == 2 ? 'white' : 'black' }}>{r}</Text></View>
                                <View style={{ flex: 3 }}><Text style={{ textAlign: 'center', color: HH == 2 ? 'white' : 'black' }}>{count[index]}</Text></View>
                                {myRank[index] == 3 ?
                                    <View style={styles.medailleopaque}>
                                        <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/bronze.png')} />
                                    </View> : myRank[index] == 2 ? <View style={styles.medailleopaque}>
                                        <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/argent.png')} />
                                    </View> : myRank[index] == 1 ? <View style={styles.medailleopaque}>
                                        <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/or.png')} />
                                    </View> : <View style={styles.medailleopaque}></View>
                                }
                            </View>)}
                    </View>
                </ScrollView>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text>{speed} C/s</Text>
                <Pressable onPressIn={(pressEvent) => {if(start_press==0){start_press=pressEvent?.nativeEvent.timestamp}else{time_press =(pressEvent?.nativeEvent.timestamp - start_press);start_press =pressEvent?.nativeEvent.timestamp}}} onPress={(pressEvent) => {globalX =x; globalY=y; globalZ=z;locationX = pressEvent.nativeEvent.locationX; locationY = pressEvent.nativeEvent.locationY;presses.push(time_press,locationX, locationY);  var tmp = count; tmp[index] = tmp[index] + HH; newvalueclicker = newvalueclicker + HH; tmp[index] = Math.max(tmp[index], newvalueclicker); setCount([...tmp]); }} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1 }, styles.inProgress]} >
                    <Image style={styles.sportimage} source={require('./assets/sports/clicker.png')} />
                </Pressable>
            </View>
        </View >
    )

}

function fetch_clicker(setUserNames, setCount, setRanks, setMyIndex, firsttime, setHH) {
    fetch("https://applijo.freeddns.org/teams/Clicker_HH.json").then(response => response.json()).then(data => { if (data.HH) { setHH(2) } else { setHH(1) } }).catch(err => console.log(err, " in HH"));
    fetch("https://applijo.freeddns.org/teams/Clicker.json").then(response => response.json()).then(data => {

        let clicks = [];
        let players = [];
        let ranks = [];
        for (var i in data) {
            players.push(data[i].Players)
            ranks.push(data[i].rank)
            if (data[i].Players == username) {
                setMyIndex(i);
                if (firsttime) {

                    newvalueclicker = data[i].Clicks;
                }
                else {
                    data[i].Clicks = newvalueclicker;
                }
            }
            clicks.push(data[i].Clicks);
        }
        setUserNames(players);
        setCount(clicks);
        setRanks(ranks);
        return data;
    }).catch(err => console.log(err, " in fetch clicker"));;
}
function pushClicker(setUserNames, setCount, setRanks, setMyIndex, setSpeed, setHH) {
    let recentClicks = newvalueclicker - previousValueClicker;
    if (recentClicks / 3 < 80) {

        setSpeed(Math.round(recentClicks / 3));
    }
    else {
        setSpeed(0);
    }
    previousValueClicker = newvalueclicker;
    fetch("https://applijo.freeddns.org/clicker", { method: "POST", body: JSON.stringify({ "version": version, "username": username, "bosondehiggz": newvalueclicker, "kekw_alpha": recentClicks, "seedA": locationX, "seedB": locationY, "anticheatsystem": Math.random() * 200, "antirejeu": Math.random() * 1000000, "1million": "larmina" + String(Math.random()), "tabloid": globalX, "KEKW": globalY, "NAAB": globalZ, "woot": presses }) }).then((answer) => {
        presses = []
        if (answer.status == 200) {
            fetch_clicker(setUserNames, setCount, setRanks, setMyIndex, false, setHH);
            return;

        }
        return;
    }).catch(err => console.log(err, "in push clicker"));
}
