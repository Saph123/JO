import * as React from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { modalChat, fetchChat, pushChat } from "./utils.js"

var globalSign = "puit";
export function ShifumiScreen({ route }) {
    const [localChat, setChatText] = React.useState("");
    const [localInputText, setInputText] = React.useState("");
    const [newMessage, setNewMessage] = React.useState("");
    const [specs, setSpecs] = React.useState([]);
    const [activePlayers, setPlayers] = React.useState([]);
    const [sign, setSign] = React.useState("puit");
    const [status, setStatus] = React.useState("");
    React.useEffect(() => {
        var chatInterval = setInterval(() => fetchChat("Shifumi", setChatText, setNewMessage), 1000);
        var shiFuMiInterval = setInterval(() => ShifumiPost(route.params.username, globalSign, setSpecs, setPlayers, setStatus, setSign), 1000);

        return () => {
            clearInterval(chatInterval);
            clearInterval(shiFuMiInterval);
        }
    }, []);
    return (
        <View style={{ flex: 1, alignItems: "center", alignContent: "center", flexDirection: "column" }}>
            <View style={{ flex: 4, alignItems: "center", alignContent: "center", flexDirection: "row" }}>
                <View style={{ flex: 1, alignContent: "center", alignSelf: "flex-start", width: "100%" }}>
                    <View style={{ flex: 1, alignSelf: "center", width: "100%", borderWidth: 1, borderColor: 'black' }}><Text style={{ borderColor: "black", borderWidth: 1, textAlign: "center" }}>Joueurs</Text>
                        {activePlayers.map(r => <View><Text>{r}</Text></View>)}
                    </View>
                </View>
                <View style={{ flex: 1, alignSelf: "flex-start", width: "100%", height: "100%", borderColor: "black", borderWidth: 1 }}>
                    <Text style={{ borderColor: "black", borderWidth: 1, textAlign: "center" }}>Spectateurs</Text>
                    {specs.map(r => <View><Text>{r}</Text></View>)}
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: "column", backgroundColor: "lightblue", width: "100%", borderColor: "black", borderWidth: 1 }}>
                <Text style={{ textAlign: "center" }}>{status}</Text>
            </View>
            <View style={{ flex: 4, flexDirection: "column", width: "100%", borderColor: "black", borderWidth: 1, marginBottom: 30 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ height: "100%" }}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 6, flexDirection: 'row', backgroundColor: "white" }}>
                            <View style={{ flex: 5 }}>
                                <ScrollView style={{ flex: 4 }} ref={ref => { this.scrollView = ref }} onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}>

                                    <View style={{ flex: 10, flexDirection: "column" }}>
                                        {localChat.split("\n").map((r, index) => {
                                            if (index == 0) {
                                                return
                                            }
                                            var date = r.split("- ")[0]
                                            var who = r.replace(date + '-  ', "").split(" : ")[0]
                                            var what = r.replace(date + '-  ' + who + " : ", "")
                                            date = date.replace(",", "")
                                            return (
                                                <View style={{ flex: 1, flexDirection: "row" }}>
                                                    <View style={{ borderWidth: 1, borderRadius: 4, flex: 1, flexDirection: "column", margin: 2 }}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text>{date}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 6 }}>
                                                        <View key={index} style={
                                                            { borderRadius: 10, marginTop: 5, padding: 3, alignSelf: who == route.params.username ? "flex-end" : "flex-start", backgroundColor: who == route.params.username ? "#186edb" : "lightblue" }}>
                                                            {who == route.params.username ? <Text style={{ color: "white" }}>{what}</Text> :
                                                                <View><Text style={{ fontSize: 10, color: "purple" }}>{who}</Text>
                                                                    <Text>{what}</Text></View>}

                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", height: 50 }}>
                            <TextInput onSubmitEditing={() => { pushChat("Shifumi", localInputText, route.params.username); setChatText(localChat + "\n" + route.params.username + ":" + localInputText); setInputText(""); }} style={{ borderWidth: 1, flex: 1, borderRadius: 8 }} value={localInputText} onChangeText={(txt) => setInputText(txt)} />
                            <Pressable onPress={() => { pushChat("Shifumi", localInputText, route.params.username); setChatText(localChat + "\n" + route.params.username + ":" + localInputText); setInputText(""); }}>
                                <Image style={{ width: 50, height: 50 }} source={require('./assets/sendmessage.png')} />
                            </Pressable>

                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
            <View style={{ flex: 1, alignItems: "center", alignContent: "center", flexDirection: "row", marginBottom: 30 }}>
                <Pressable onPress={() => {
                    if (globalSign != "Papier") {

                        globalSign = "Papier"; setSign("Papier")
                    }
                    else {
                        globalSign = "puit"; setSign("puit");
                    }
                }} style={{ flex: 1, backgroundColor: globalSign == "Papier" ? "red":"lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius: 25, marginRight: 10 }}>
                    <Image style={{ alignSelf: "center", tintColor: "black", height: 50, width: 50, marginTop: 5 }} resizeMode="contain" source={require('./assets/paper.png')} /></Pressable>
                <Pressable onPress={() => {
                    if (globalSign != "Pierre") {

                        globalSign = "Pierre"; setSign("Pierre")
                    }
                    else {
                        globalSign = "puit"; setSign("puit");
                    }
                }} style={{ flex: 1, backgroundColor: globalSign == "Pierre" ? "red":"lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius: 25, marginRight: 10 }}>
                    <Image style={{ alignSelf: "center", tintColor: "black", height: 50, width: 50, marginTop: 5 }} resizeMode="contain" source={require('./assets/fist.png')} /></Pressable>
                <Pressable onPress={() => {
                    if (globalSign != "Ciseaux") {

                        globalSign = "Ciseaux"; setSign("Ciseaux")
                    }
                    else {
                        globalSign = "puit"; setSign("puit");
                    }
                }} style={{ flex: 1, backgroundColor: globalSign == "Ciseaux" ? "red":"lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius: 25, marginRight: 10 }}>
                    <Image style={{ alignSelf: "center", tintColor: "black", height: 50, width: 50, marginTop: 5, transform: [{ rotate: '270deg' }] }} resizeMode="contain" source={require('./assets/scissors.png')} /></Pressable>
            </View>
        </View>
    )
}

export function ShifumiPost(username, sign, setSpecs, setPlayers, setStatus, setSign) {
    fetch("https://pierrickperso.ddnsfree.com:42124/shifumi", { method: "POST", body: JSON.stringify({ "username": username, "sign": sign }) }).then(response => response.json()).then(
        data => {
            setSpecs(data.specs);
            setPlayers(data.active_players);
            console.log(data)
            if (data.voting_in > 0){
                
                setStatus(data.last_winner + " a remporté la dernière partie!\nLa prochaine partie commence dans " + Math.floor(data.voting_in) + " secondes");
            }
            else{
                if (data.last_winner == "draw" || data.last_winner == "Whisky"){
                    setStatus("Match nul!\nEn attente de joueurs!")
                }
                else{

                    setStatus(data.last_winner + " remporte la partie!\nEn attente de joueurs!")
                }
            }

        }
    ).catch(
        err => console.error("shifumierr", err));

}