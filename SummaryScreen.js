import styles from "./style";
import * as React from 'react';
import { View, ActivityIndicator, Text, Image, Modal, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { fetch_results } from "./trace.js";
import { modalChat, fetchChat, addth, getValueFor } from './utils.js';
import { ChatContext } from "./App.js";


export function SummaryScreen() {
    const [loading, setLoading] = React.useState(true);
    const [tableauMedaille, setTableauMedaille] = React.useState([{}]);
    const [chatText, setChatText] = React.useState("");
    const [username, setusername] = React.useState("");
    const [localText, setLocalText] = React.useState("");
    const [medailleSport, setMedailleSport] = React.useState(false);
    const [winSport, setWinSport] = React.useState(false);
    const [modalMedaille, setModaleMedaille] = React.useState(false);
    const chatcontext = React.useContext(ChatContext);
    React.useEffect(() => {
        getValueFor("username").then(r => setusername(r));
        chatcontext.setChatName("Summary");
        fetch_results().then(r => {
            let tempArray = []
            for (var i in r) {


                for (var j = 0; j < 50; j++) {
                    if (r[i].rank == j) {
                        let tmp = { name: r[i].name, rank: r[i].rank, or: r[i].gold.number, bronze: r[i].bronze.number, argent: r[i].silver.number, sportsgold: r[i].gold.sports, sportssilver: r[i].silver.sports, sportsbronze: r[i].bronze.sports };
                        tempArray.push(tmp);
                    }
                }
            }
            setTableauMedaille(tempArray)
            setLoading(false);
        })
        var chatInterval = setInterval(() => fetchChat("Summary", setChatText, chatcontext.setNewMessage), 3000);
        return () => {
            chatcontext.setChatName("");
            clearInterval(chatInterval);
        }

    }, [chatcontext.chatName]);
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <ScrollView style={{ width: "100%" }}>
            <ChatContext.Consumer>
                {value => modalChat(value, chatText, setChatText, localText, setLocalText, "Summary", username)}

            </ChatContext.Consumer>
            <Modal
                animationType="slide"
                transparent={true}
                visible={medailleSport}
                supportedOrientations={['portrait', 'landscape']}
            >
                <View style={styles.modalView}>
                        <Image source={modalMedaille == 1 ? require("./assets/or.png") : modalMedaille == 2 ? require("./assets/argent.png") : require("./assets/bronze.png")} />
                    {winSport}
                </View>
            </Modal>
            {tableauMedaille.map(r => {


                return (
                    <View key={r.name} style={{ flexDirection: "row", justifyContent: "flex-start", borderBottomWidth: 1, borderColor: "lightgrey" }}>
                        <View style={{ flexDirection: "row", width: "28%" }}>
                            <Text style={styles.medailleNumber}>{r.rank + addth(r.rank)}</Text>
                        </View>
                        <View style={{ flexDirection: "row", width: "34%" }}>
                            <Text style={{ fontSize: 18 }}>{r.name}</Text>
                        </View>
                        <View style={{ flexDirection: "row", width: "38%" }}>
                            <Text style={styles.medailleNumber}>{r.or}</Text>
                            <Pressable onPress={() => { if (r.sportsgold != "") { setModaleMedaille(1); setWinSport(
                                    <View>
                                        <Text style={styles.modalText}>{r.name}</Text>
                                        <Text></Text>
                                        <View>
                                         {r.sportsgold.map(r2 => <Text key={r2} style={styles.modalText} >{r2}</Text>)}
                                        </View>
                                    </View>); setMedailleSport(true); setTimeout(() => setMedailleSport(false), 2000) } }}>
                                <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/or.png')} />
                            </Pressable>
                            <Text style={styles.medailleNumber}>{r.argent}</Text>
                            <Pressable onPress={() => { if (r.sportssilver != "") { setModaleMedaille(2); setWinSport(
                                    <View>
                                        <Text style={styles.modalText}>{r.name}</Text>
                                        <Text></Text>
                                        <View>
                                         {r.sportssilver.map(r2 => <Text key={r2} style={styles.modalText} >{r2}</Text>)}
                                        </View>
                                    </View>);
                                    setMedailleSport(true);
                                    setTimeout(() => setMedailleSport(false), 2000)  }}}>
                                <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/argent.png')} />
                            </Pressable>
                            <Text style={styles.medailleNumber}>{r.bronze}</Text>
                            <Pressable onPress={() => { if (r.sportsbronze != "") { setModaleMedaille(3); setWinSport(
                                    <View>
                                        <Text style={styles.modalText}>{r.name}</Text>
                                        <Text></Text>
                                        <View>
                                         {r.sportsbronze.map(r2 => <Text key={r2} style={styles.modalText} >{r2}</Text>)}
                                        </View>
                                    </View>); setMedailleSport(true); setTimeout(() => setMedailleSport(false), 2000) } }}>
                                <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/bronze.png')} />
                            </Pressable>
                        </View>

                    </View>
                );
            }
            )
            }
        </ScrollView >
    )
}