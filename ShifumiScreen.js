import * as React from 'react';
import { View, Text, Pressable, Image, Keyboard, Modal } from 'react-native';
import { fetchChat, chatView } from "./utils.js"
import { ScrollView } from 'react-native-gesture-handler';
import styles from './style.js'

var globalSign = "puit";
var globalPartyId = -1;
var globalTour = 0;
var roundInProgress = false
export function ShifumiScreen({ route }) {
    const [localChat, setChatText] = React.useState("");
    const [localInputText, setInputText] = React.useState("");
    const [newMessage, setNewMessage] = React.useState("");
    const [specs, setSpecs] = React.useState([]);
    const [activePlayers, setPlayers] = React.useState([]);
    const [recapPlayers, setPlayerRecap] = React.useState([]);
    const [sign, setSign] = React.useState("puit");
    const [notAllowed, setNotAllowed] = React.useState(true);
    const [status, setStatus] = React.useState("");
    const [scores, setScores] = React.useState("");
    const [keyboardHeight, setKeyboardHeight] = React.useState(0);
    const [hideSigns, setHideSigns] = React.useState(false)
    const [recap, setRecap] = React.useState(false)
    const ref = React.useRef(null)
    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            e => {
                setKeyboardHeight(e.endCoordinates.height);
                setHideSigns(true)
                setTimeout(() => {
                    if (ref.current != undefined) {
                        ref.current.scrollToEnd({ animated: false })
                    }
                }, 1);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
                setHideSigns(false)
            }
        );
        var chatInterval = setInterval(() => fetchChat("Shifumi", setChatText, setNewMessage), 500);
        var shiFuMiInterval = setInterval(() => {
            ShifumiPost(route.params.username, globalSign, setSpecs, setPlayers, setStatus, setSign, setNotAllowed, setScores, setPlayerRecap, setRecap);

        }, 500);
        return () => {
            clearInterval(chatInterval);
            clearInterval(shiFuMiInterval);
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        }
    }, []);
    return (

        <View style={{ flex: 1, alignItems: "center", alignContent: "center", flexDirection: "column" }}>
            <Modal

                animationType="fade"
                transparent={true}
                visible={recap} style={{ paddingTop: "30%" }}
                onShow={() => {
                    setTimeout(() => {
                        setRecap(false)
                    }, 5000);
                }}>
                <View style={[styles.matchZoomView, { minHeight: 300 }]}>
                    {recapPlayers.map(r =>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            {r.has_win ? <Text style={{ marginTop: 2, marginRight: 5, color: "green" }}>{r.username}</Text> : <Text style={{ marginTop: 2, marginRight: 5, textDecorationLine: "line-through", color: "red" }}>{r.username}</Text>}
                            <View style={{ width: 30, height: 30 }}>{r.sign != "puit" ? draw_sign(r.sign) : null}</View>

                        </View>

                    )}
                </View>
                <Pressable style={{ height: "100%", width: '100%' }} onPress={() => { setRecap(false) }}>
                </Pressable>
            </Modal>
            <View style={{ flex: 4, alignItems: "center", alignContent: "center", flexDirection: "row" }}>
                <View style={{ flex: 1, alignContent: "center", alignSelf: "flex-start", width: "100%" }}>
                    <View style={{ flex: 1, alignSelf: "center", width: "100%", borderWidth: 1, borderColor: 'black' }}><Text style={{ borderColor: "black", borderWidth: 1, textAlign: "center" }}>Joueurs</Text>
                        <ScrollView>

                            {activePlayers.map(r => <View style={{ flexDirection: "row" }} key={r.username}>
                                <Text>{r.username}</Text>
                                {r.has_played ? <Image style={{ height: 18, resizeMode: "contain" }} source={require("./assets/check-mark.png")} /> : null}

                            </View>)}
                        </ScrollView>
                    </View>
                    <View style={{ flex: 1, alignSelf: "flex-start", width: "100%", height: "100%", borderColor: "black", borderWidth: 1 }}>
                        <Text style={{ borderColor: "black", borderWidth: 1, textAlign: "center" }}>Spectateurs</Text>
                        <ScrollView>
                            {specs.map(r => <View key={r}><Text>{r}</Text></View>)}
                        </ScrollView>
                    </View>
                </View>
                <View style={{ flex: 1, width: "100%", height: "100%", borderColor: "black", borderWidth: 1 }}><Text style={{ borderColor: "black", borderWidth: 1, textAlign: "center" }}>Scores</Text>
                    <ScrollView>
                        <Text>{scores}</Text>
                    </ScrollView>
                </View>

            </View>
            <Pressable onPress={() => {
                setRecap(true);
                setTimeout(() => {
                    setRecap(false)
                }, 5000);
            }} style={{ flex: 1, minHeight: 30, flexDirection: "column", backgroundColor: "lightblue", width: "100%", borderColor: "black", borderWidth: 1 }}>
                <Text style={{ textAlign: "center" }}>{status}</Text>
            </Pressable>
            <View style={{ flex: 4, left: 0, right: 0, bottom: 0, paddingBottom: Platform.OS === "ios" ? keyboardHeight + 10 : 0, width: "100%", marginBottom: 30 }}>
                {chatView(localChat, setChatText, localInputText, setInputText, "Shifumi", route.params.username, false)}
            </View>
            {hideSigns == false ?
                <View style={{ flex: 1, alignItems: "center", alignContent: "center", flexDirection: "row", marginBottom: 30 }}>
                    <Pressable disabled={notAllowed} onPress={() => {
                        if (globalSign != "Papier") {

                            globalSign = "Papier"; setSign("Papier")
                        }
                        else {
                            globalSign = "puit"; setSign("puit");
                        }
                    }} style={{ flex: 1, backgroundColor: notAllowed ? "grey" : globalSign == "Papier" ? "red" : "lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius: 25, marginRight: 10, minHeight: 60 }}>
                        <Image style={{ alignSelf: "center", tintColor: "black", height: 50, width: 50, marginTop: 5 }} resizeMode="contain" source={require('./assets/paper.png')} /></Pressable>
                    <Pressable disabled={notAllowed} onPress={() => {
                        if (globalSign != "Pierre") {

                            globalSign = "Pierre"; setSign("Pierre")
                        }
                        else {
                            globalSign = "puit"; setSign("puit");
                        }
                    }} style={{ flex: 1, backgroundColor: notAllowed ? "grey" : globalSign == "Pierre" ? "red" : "lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius: 25, marginRight: 10, minHeight: 60 }}>
                        <Image style={{ alignSelf: "center", tintColor: "black", height: 50, width: 50, marginTop: 5 }} resizeMode="contain" source={require('./assets/fist.png')} /></Pressable>
                    <Pressable disabled={notAllowed} onPress={() => {
                        if (globalSign != "Ciseaux") {

                            globalSign = "Ciseaux"; setSign("Ciseaux")
                        }
                        else {
                            globalSign = "puit"; setSign("puit");
                        }
                    }} style={{ flex: 1, backgroundColor: notAllowed ? "grey" : globalSign == "Ciseaux" ? "red" : "lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius: 25, marginRight: 10, minHeight: 60 }}>
                        <Image style={{ alignSelf: "center", tintColor: "black", height: 50, width: 50, marginTop: 5, transform: [{ rotate: '270deg' }] }} resizeMode="contain" source={require('./assets/scissors.png')} /></Pressable>



                </View> : null}
        </View>

    )
}

export function ShifumiPost(username, sign, setSpecs, setPlayers, setStatus, setSign, setNotAllowed, setScores, setPlayerRecap, setRecap) {
    let data = fetch("https://pierrickperso.ddnsfree.com:42124/shifumi", { method: "POST", body: JSON.stringify({ "username": username, "sign": sign, "party_id": globalPartyId, "tour": globalTour }) }).then(response => response.json()).then(
        data => {
            setSpecs(data.specs);
            score_txt = ""
            var localScores = [];
            // console.log(data);

            for (let i in data.scores) {
                localScores.push([i, data.scores[i]]);
            }
            localScores.sort((a, b) => b[1] - a[1]);
            for (let name in localScores) {
                score_txt += localScores[name][0] + ":" + localScores[name][1] + "\n"

            }

            setScores(score_txt)
            let notAllowed = true;
            let txt = "";


            if (data.active_players.length == 0) {
                notAllowed = false;
                txt = "";
                for (let i = 0; i < data.leaver.length; i++) {
                    txt += data.leaver[i] + " s'est barré comme un FDP!\n"
                }
            }
            else if (data.active_players.length == 1) {
                txt = data.active_players[0].username + " est prêt à ragler tout le monde!";
            }
            else {
                txt = "Partie en cours entre : "
                for (let i = 0; i < data.active_players.length; i++) {
                    if (data.active_players[i].username == username) {
                        notAllowed = false;
                    }
                    txt += data.active_players[i].username + ", "
                }

                txt += "\n Tour numéro : " + data.tour
            }

            if (!data.game_in_progress) {
                setNotAllowed(false);
            }
            else {

                setNotAllowed(notAllowed);
            }
            // These 2 checks show us if the turn is done or party is over
            var recapPlayers = [];
            if (globalPartyId != data.party_id) {
                setSign("puit");
                globalSign = "puit";
                for (i in data.players_and_sign) {
                    recapPlayers.push({ username: data.players_and_sign[i][0], sign: data.players_and_sign[i][1], has_played: false, has_win: data.players_and_sign[i][2] })
                }
                setPlayerRecap(recapPlayers);
                setRecap(true);


            }
            else if (globalTour != data.tour) {
                setSign("puit");
                globalSign = "puit";
                let win = true;
                for (i in data.players_and_sign) {
                    if (data.last_winner == "draw") {

                        for (let i = 0; i < data.active_players.length; i++) {
                            if (data.active_players[i].username == data.players_and_sign[i][0]) {
                                win = true;
                            }
                            else {
                                win = false;
                            }
                        }
                    }
                    else{
                        win = data.players_and_sign[i][2];
                    }
                    recapPlayers.push({ username: data.players_and_sign[i][0], sign: data.players_and_sign[i][1], has_played: false, has_win:win})
                }
                setPlayerRecap(recapPlayers);
                setRecap(true);
            }
            else {

                setPlayers(data.active_players);
            }

            console.log(recapPlayers)
            globalTour = data.tour;
            globalPartyId = data.party_id;
            if (data.voting_in > 0) {
                setStatus(txt + "\nLa prochaine partie commence dans " + Math.floor(data.voting_in) + " secondes");
            }
            else {
                if (data.last_winner == "draw" || data.last_winner == "Whisky") {
                    setStatus(txt + "\n" + "Match nul!\n")
                }
                else {

                    setStatus(txt + "\n" + data.last_winner + " a remporté la dernière partie!\n")
                }
            }

            return data
        }
    ).catch(
        err => console.error("shifumierr", err));
    return data
}

function draw_sign(sign) {
    if (sign == "Pierre") {
        return (<Image style={{ alignSelf: "center", tintColor: "black", height: 30, width: 30 }} resizeMode="contain" source={require('./assets/fist.png')}></Image>)
    }
    if (sign == "Ciseaux") {
        return (<Image style={{ alignSelf: "center", tintColor: "black", height: 30, width: 30, transform: [{ rotate: '270deg' }] }} resizeMode="contain" source={require('./assets/scissors.png')}></Image>)
    }
    if (sign == "Papier") {
        return (<Image style={{ alignSelf: "center", tintColor: "black", height: 30, width: 30 }} resizeMode="contain" source={require('./assets/paper.png')}></Image>)
    }
}