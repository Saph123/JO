import styles from "./style.js";
import * as React from 'react';
import { View, Pressable, Image, ScrollView, Text, Alert, TextInput } from 'react-native';
import { die, lutImg, vibrateLight, fetchKiller, updateMission } from './utils.js';

export function KillerScreen({ route }) {
    const [tabs, setTab] = React.useState({ states: ["waiting"], status: "waiting" });
    const [arbitre, setArbitre] = React.useState(false)
    const [kills, setKills] = React.useState([{name: "", mission: "", date: ""}])
    const [alive, setAlive] = React.useState(true)
    const [target, setTarget] = React.useState("")
    const [mission, setMission] = React.useState("")
    const [discovered, setDiscovered] = React.useState(false)
    const [missions, setMissions] = React.useState([""])
    let init = true;
    let missions_list = [""];
    React.useEffect(() => {
        if (init == true) {
            fetchKiller(route.params.username, setKills, setAlive, setMission, setTarget, setArbitre, setTab)
            init = false
        }

    }, []);
    if (!arbitre)
    {
    return (
        <View style={{ flex: 1, flexDirection: "column", height: 50, backgroundColor: "#C9CBCD" }}>
            {alive ? <View style={{ height: 50, flexDirection: "row" }}>
                {tabs.states.map(r =>
                    <Pressable key={r} onPress={() => {
                        vibrateLight();
                        setTab((current) => {
                            current.status = r;
                            return { ...current }
                        });
                    }} style={r == tabs.status ?
                        { flex: 1, backgroundColor: "black", borderColor: "white", borderWidth: 5, alignItems: "center", borderBottomStartRadius: 15, borderBottomEndRadius: 15 } :
                        { flex: 1, backgroundColor: "black", borderColor: "grey", borderWidth: 5, alignItems: "center", borderBottomStartRadius: 15, borderBottomEndRadius: 15 }}><View>
                            <Image style={styles.tabimage} resizeMode="contain" resizeMethod="auto" source={lutImg(r)} /></View></Pressable>)}
            </View>
                :
                <View></View>}
            {tabs.status == "en cours" ?
                <ScrollView style={{ height: "100%" }}>
                    {discovered ? <View style={{ position: "absolute", alignSelf: "center" }}>
                        <Image style={{ width: 300, resizeMode: "center", height: 319, top: "50%" }} source={require('./assets/piepie.jpeg')} />
                    </View>
                        :
                        <View style={{ position: "absolute", alignSelf: "center" }}>
                            <Image style={{ width: 300, resizeMode: "center", height: 319, top: "50%" }} source={require('./assets/point_inter.png')} />
                        </View>
                    }
                    <Pressable onPress={() => setDiscovered(true)}>
                        <View style={{ alignItems: "center", paddingBottom: 10 }}>
                            <Image style={{ width: "95%", resizeMode: 'contain' }} source={require('./assets/wanted.png')} />
                        </View>
                    </Pressable>
                    {discovered ?
                    <View>
                        <View>
                            <Text style={{ fontSize: 30, alignSelf: "center", fontWeight: "bold" }}>{target}</Text>
                        </View>
                        <View style={{ borderTopWidth: 1, padding: 5 }}>
                            <Text style={{ fontSize: 30, alignSelf: "center", fontWeight: "bold" }}>Mission</Text>
                        </View>
                        <View style={{ backgroundColor: "white", padding: 15, borderRadius: 20, width: "50%", alignSelf: "center" }}>
                            <Text style={{ fontSize: 15, alignSelf: "center" }}>{mission}</Text>
                        </View>
                        <View style={{ height: 100 }}></View>
                    </View>
                    :
                    <View></View>}
                </ScrollView>
                : tabs.status == "résumé" ?
                <View style={{ flex: 2, flexDirection: "column" }}>
                    <View style={{ flex: 1, flexDirection: "row", marginTop: "5%", justifyContent: "center" }}>
                        <View style={{ width: "100%" }}>
                            <View style={{ marginTop: 10, flex: 1, flexDirection: "column", justifyContent: "center" }}>
                                <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>Etat:</Text>
                                <View style={{ flex: 3 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ textAlign: "center", fontWeight: "bold" }}>{alive ? "Toujours en vie" : ""}</Text>
                                    </View>
                                    {alive ?
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.killbutton}>
                                                <Pressable onPress={() => { Alert.alert("Confirmer votre mort", "", [{ text: "Confirmer", onPress: () => die(route.params.username, setAlive) }, { text: "Annuler" }]) }}><Text>Omar m'a tuer</Text></Pressable>
                                            </View>
                                        </View>
                                        : <View></View>}
                                </View>
                                {alive ? <View></View> : <View style={{ flex: 10 }}><Image style={{ width: "100%" }} source={require('./assets/wasted.png')}></Image></View>}
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>Killed:</Text>
                        </View>
                        <ScrollView style={{ flex: 1, flexDirection: "column", marginTop: "5%" }}>
                            {kills.length > 0 ? kills.map(r =>
                                <View style={styles.kills}>
                                    <Text style={{ textAlign: "center" }}>{r.name} ({r.date}):{"\n"}{r.mission}</Text>
                                </View>) : <View></View>}
                        </ScrollView>

                    </View>
                </View> : <View><Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>En attente du démarrage de la partie</Text></View>}
        </View>
    )}
    else
    {
        return (
            <ScrollView>
                <ScrollView horizontal={true} directionalLockEnabled={false}>
                    <View style={{ flexDirection: "row", marginTop: 22 }}>
                        <View>
                            <Text style={[styles.showPlayers, { height: 60 }]}>Mission</Text>
                            {missions_list.map(r =>
                                <TextInput key={r} multiline={true} onChangeText={(text) => { missions_list.push(text)}} style={[styles.showPlayers, { height : 90, width: 200, textAlignVertical: "top", textAlign : "left"}]}>{r}</TextInput>
                            )
                            }
                        </View>
                        <View style={{ width: 60, height: 60, backgroundColor: "lightgrey", justifyContent: "center" }}>
                            <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => {
                                updateMission(missions_list, route.params.username);
                            }
                            }>
                                <Image resizeMode="cover" resizeMethod="resize" style={{ alignSelf: "center" }} source={require('./assets/save.png')}></Image>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </ScrollView>
            )
        }

}