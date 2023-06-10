import * as React from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image } from 'react-native';


export function ShifumiScreen({ route }) {
    const [localUsername, setLocalUsername] = React.useState("");
    React.useEffect(() => {
        setLocalUsername(route.params.username);
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
            <View style={{ flex: 1, flexDirection: "row", backgroundColor: "lightblue", width: "100%", borderColor: "black", borderWidth: 1 }}>
                <Text>La partie commence dans 10 sec! Choisis un signe, gros porc!</Text>
            </View>
            <View style={{ flex: 4, flexDirection: "column", width: "100%", borderColor: "black", borderWidth: 1, marginBottom:30 }}>
                <ScrollView style={{ flex: 1, width: "100%", alignSelf: "flex-start" }}>
                    <View style={{ flex: 1, width: "100%", flexDirection: "row", alignContent: "flex-start" }}>
                        <Text style={{ alignSelf: "flex-start", alignContent: "flex-start", backgroundColor: "black", color: "white", marginRight: 5, maxHeight: 20 }}>LaGuille:</Text><Text>Chat mes gatés</Text>
                    </View>
                </ScrollView>
                <View style={{ minHeight:30, flexDirection: "row" }}>
                    <TextInput style={{ flex:1, borderColor: "black", borderWidth: 1 }}></TextInput>
                    <Pressable onPress={() => { pushChat(sportname, localText, username); setChatText(text + "\n" + username + ":" + localText); setLocalText(""); }}>
                        <Image style={{ width: 50, height: 50 }} source={require('./assets/sendmessage.png')} />
                    </Pressable>
                </View>
            </View>
            <View style={{ flex: 1, alignItems: "center", alignContent: "center", flexDirection: "row" }}>
                <Pressable style={{ flex: 1, backgroundColor: "lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius:25, marginRight:10 }}><Text style={{flex:1, textAlignVertical:"center", textAlign:"center"}}>Pierre</Text></Pressable>
                <Pressable style={{ flex: 1, backgroundColor: "lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius:25, marginRight:10 }}><Text style={{flex:1, textAlignVertical:"center", textAlign:"center"}}>Feuille</Text></Pressable>
                <Pressable style={{ flex: 1, backgroundColor: "lightblue", borderColor: "black", borderWidth: 1, height: "100%", borderRadius:25, marginRight:10 }}><Text style={{flex:1, textAlignVertical:"center", textAlign:"center"}}>Ciseaux</Text></Pressable>
            </View>
        </View>
    )
}