import * as React from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { modalChat, fetchChat, pushChat } from "./utils.js"

export function ShifumiScreen({ route }) {
    const [localChat, setChatText] = React.useState("");
    const [localInputText, setInputText] = React.useState("");
    const [newMessage, setNewMessage] = React.useState("");
    React.useEffect(() => {
        var chatInterval = setInterval(() => fetchChat("Shifumi", setChatText, setNewMessage), 1000);
    }, []);
    return (
        <View style={{ flex: 1, alignItems: "center", alignContent: "center", flexDirection: "column" }}>
            <View style={{ flex: 4, alignItems: "center", alignContent: "center", flexDirection: "row" }}>
                <View style={{ flex: 1, alignContent: "center", alignSelf: "flex-start", width: "100%" }}>
                    <View style={{ flex: 1, alignSelf: "center", width: "100%", borderWidth: 1, borderColor: 'black' }}><Text style={{ borderColor: "black", borderWidth: 1, textAlign: "center" }}>Joueurs</Text><Text style={{ textAlign: "center" }}>{route.params.username}</Text></View>
                </View>
                <View style={{ flex: 1, alignSelf: "flex-start", width: "100%", height: "100%", borderColor: "black", borderWidth: 1 }}>
                    <Text style={{ borderColor: "black", borderWidth: 1, textAlign: "center" }}>Spectateurs</Text>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: "column", backgroundColor: "lightblue", width: "100%", borderColor: "black", borderWidth: 1 }}>
                <Text style={{ textAlign: "center" }}>La partie ds dans 10 sec!</Text>
                <Text style={{ textAlign: "center" }}>Choisis un signe, gros porc (baisse les yeux)</Text>
            </View>
            <View style={{ flex: 4, flexDirection: "column", width: "100%", borderColor: "black", borderWidth: 1, marginBottom: 30 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ height:"100%" }}
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
                                                                { borderRadius: 10, marginTop: 5, padding: 3, alignSelf: who == route.params.username ? "flex-end" : "flex-start", backgroundColor: who == route.params.username ? "#186edb" : "#ffffff" }}>
                                                                {who == route.params.username ? <Text style={{ color: "pink" }}>{what}</Text> :
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
                            <View style={{ flexDirection: "row",  height:50 }}>
                                <TextInput onSubmitEditing={() => { pushChat("Shifumi", localInputText, route.params.username); setChatText(localChat + "\n" + route.params.username + ":" + localInputText); setInputText(""); }} style={{ borderWidth: 1, flex: 1, borderRadius: 8 }} value={localInputText} onChangeText={(txt) => setInputText(txt)} />
                                <Pressable onPress={() => { pushChat("Shifumi", localInputText, route.params.username); setChatText(localChat + "\n" + route.params.username + ":" + localInputText); setInputText(""); }}>
                                    <Image style={{ width: 50, height: 50 }} source={require('./assets/sendmessage.png')} />
                                </Pressable>

                            </View>
                        </View>
                    </KeyboardAvoidingView>
            </View>
            <View style={{ flex: 1, alignItems: "center", alignContent: "center", flexDirection: "row" }}>
                <Pressable style={{ flex: 1, backgroundColor: "lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius: 25, marginRight: 10 }}>
                    <Image style={{ alignSelf: "center", tintColor: "black", height: 50, width: 50, marginTop: 5 }} resizeMode="contain" source={require('./assets/paper.png')} /></Pressable>
                <Pressable style={{ flex: 1, backgroundColor: "lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius: 25, marginRight: 10 }}>
                    <Image style={{ alignSelf: "center", tintColor: "black", height: 50, width: 50, marginTop: 5 }} resizeMode="contain" source={require('./assets/fist.png')} /></Pressable>
                <Pressable style={{ flex: 1, backgroundColor: "lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius: 25, marginRight: 10 }}>
                    <Image style={{ alignSelf: "center", tintColor: "black", height: 50, width: 50, marginTop: 5, transform: [{ rotate: '270deg' }] }} resizeMode="contain" source={require('./assets/scissors.png')} /></Pressable>
            </View>
        </View>
    )
}