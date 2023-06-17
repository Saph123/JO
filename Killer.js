import styles from "./style.js";
import * as React from 'react';
import { View, Pressable, Image, ScrollView, Text, Alert, TextInput, Modal } from 'react-native';
import { die, lutImg, vibrateLight, fetchKiller, updateMission, personView, kill, endKiller } from './utils.js';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export function KillerScreen({ route }) {
    const [tabs, setTab] = React.useState({ states: ["waiting"], status: "waiting" });
    const [kills, setKills] = React.useState([{ name: "", mission: "", date: "" }])
    const [alive, setAlive] = React.useState(true)
    const [target, setTarget] = React.useState("")
    const [mission, setMission] = React.useState("")
    const [discovered, setDiscovered] = React.useState(false)
    const [missions, setMissionAsRef] = React.useState([{ title: "" }])
    const [players, setPlayers] = React.useState({ left: [], middle: [], right: [] })
    const [refresh, setRefresh] = React.useState(true)
    const [currentMisson, setCurrentMission] = React.useState({ title: "" })
    const [modifyingMission, setModifyingMission] = React.useState(false)
    const [temp_mission, setTempMission] = React.useState("")
    const [shouldSave, setShouldSave] = React.useState(false)
    const [motiv_text, setMotivText] = React.useState("")
    const [focus, setFocus] = React.useState(false)
    const [focusOn, setFocusOn] = React.useState("")
    const [giveCredit, setGiveCredit] = React.useState(false)
    let missions_list = missions;
    React.useEffect(() => {
        if (refresh == true) {
            fetchKiller(route.params.username, setKills, setAlive, setMission, setTarget, setTab, setMissionAsRef, setMotivText, setPlayers)
            setRefresh(false)
        }

    }, []);
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
                    <View style={{ position: "absolute", top: 218, left: 0, right: 0, bottom: 0, alignItems: "center" }}>
                        <Image style={{ height: 201, width: 134 }} source={discovered ? { cache: 'reload', uri: "https://pierrickperso.ddnsfree.com:42124/photo/" + target } : require('./assets/point_inter.png')} />
                    </View>
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
                                                    <Pressable onPress={() => { Alert.alert("Confirmer votre mort", "", [{ text: "Confirmer", onPress: () => die(route.params.username, setAlive, setRefresh) }, { text: "Annuler" }]) }}><Text>Omar m'a tuer</Text></Pressable>
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
                    </View>
                    : tabs.status == "waiting" ?
                        <View><Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>En attente du démarrage de la partie</Text></View>
                        : tabs.status == "kills" ?
                            <View>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={focus} style={{ paddingTop: "30%" }}>
                                    <View style={[styles.matchZoomView, { minHeight: 300 }]}>
                                        <Pressable style={[styles.closeButton, { marginBottom: 15 }]} onPress={() => { setFocus(false) }}><Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/remove.png')} /></Pressable>
                                        <View style={{ flex: 1, flexDirection: "column" }}>
                                            <View style={{ flex: 3, justifyContent: "center", alignItems: "center" }}>
                                                {
                                                    modifyingMission == false && temp_mission != "" ?
                                                        <Pressable onPress={() => setModifyingMission(true)} style={{ minHeight: 30, width: 200, textAlignVertical: "center", textAlign: "left", padding: 5, paddingRight: 35, borderWidth: 1, borderColor: "#E0E0E0", marginLeft: 5, borderRadius: 10 }}>
                                                            <Text key={temp_mission} >{temp_mission}</Text>
                                                        </Pressable>
                                                        :
                                                        <TextInput onChangeText={text => { setTempMission(text); setModifyingMission(true) }} onEndEditing={() => { setModifyingMission(false) }} autoFocus={true} placeholder="Tapez ici" key={currentMisson.title} style={{ minHeight: 90, width: 200, textAlignVertical: "center", textAlign: "left", padding: 5, paddingRight: 35, borderWidth: 1, borderColor: "#E0E0E0", marginLeft: 5, borderRadius: 10 }}>{currentMisson.title}</TextInput>
                                                }
                                            </View>
                                            <View style={{ flex: 1, flexDirection: "row" }}>
                                                <Pressable style={[styles.closeButton, { flex: 1 }]} onPress={() => {
                                                    currentMisson.title = temp_mission;
                                                    setFocus(false);
                                                    setShouldSave(true);
                                                    setModifyingMission(false);
                                                }}>
                                                    <Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/check-mark.png')} />
                                                </Pressable>
                                                <Pressable style={[styles.closeButton, { flex: 1 }]} onPress={() => {
                                                    let missions = missions_list;
                                                    missions.splice(missions.indexOf(currentMisson), 1);
                                                    setFocus(false);
                                                    setShouldSave(true);
                                                }}>
                                                    <Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/delete.png')} />
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableWithoutFeedback style={{ height: "100%" }} onPress={() => { setFocus(false); setModifyingMission(false) }}>
                                    </TouchableWithoutFeedback>
                                </Modal>
                                <View>
                                    <View style={{ flexDirection: "row", marginTop: 22 }}>
                                        <ScrollView style={{ flex: 1, borderRightWidth: 1, borderColor: "#E0E0E0" }}>
                                            <Text style={[styles.showPlayers, { height: 60, width: 200, fontWeight: "bold", fontSize: 18 }]}>Missions{"\n"}({motiv_text})</Text>
                                            {missions_list.map(r =>
                                                <Pressable onPress={() => { setTempMission(r.title); setCurrentMission(r); setFocus(true) }}>
                                                    <Text key={r.title} style={{ minHeight: 30, width: 200, textAlignVertical: "center", textAlign: "left", padding: 5, paddingRight: 35, borderWidth: 1, borderColor: "#E0E0E0", marginLeft: 5 }}>{r.title}</Text>
                                                </Pressable>
                                            )
                                            }
                                            <View style={{ paddingTop: 50 }}></View>
                                        </ScrollView>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ width: 100, height: 60, backgroundColor: shouldSave ? "red" : "white", justifyContent: "center", borderRadius: 30, borderWidth: 2, marginLeft: 5, marginBottom: 5 }}>
                                                <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => {
                                                    updateMission(missions_list, route.params.username, setRefresh, setShouldSave);
                                                    let nb_missions = missions_list.length
                                                    for (let index = 0; index < missions_list.length; index++) {
                                                        if (missions_list[index].title == "") {
                                                            nb_missions--;
                                                        }
                                                    }
                                                    setMotivText(nb_missions + "/25")
                                                }
                                                }>
                                                    <Text>Sauvegarder</Text>
                                                </Pressable>
                                            </View>
                                            <View style={{ width: 100, height: 60, backgroundColor: "white", justifyContent: "center", borderRadius: 30, borderWidth: 2, marginLeft: 5, marginBottom: 5 }}>
                                                <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => {
                                                    let missions = missions_list;
                                                    missions.push({ title: "" })
                                                    setMissionAsRef(missions);
                                                    setRefresh(true);
                                                    setTempMission("");
                                                    setCurrentMission(missions[missions.length - 1]);
                                                    setModifMission(true)
                                                }
                                                }>
                                                    <Text>Ajouter une mission</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            : tabs.status == "people" ?
                                <View>
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={focus} style={{ paddingTop: "30%" }}>
                                        <View style={[styles.matchZoomView, { minHeight: 300 }]}>
                                            <Pressable style={[styles.closeButton, { marginBottom: 15 }]} onPress={() => { setFocus(false); setGiveCredit(false); setModifyingMission(false) }}><Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/remove.png')} /></Pressable>
                                            <View style={{ flexDirection: "row" }}>
                                                <View style={{ flex: 1 }}>

                                                    {personView(focusOn)}
                                                    {focusOn.alive ?
                                                        <View>
                                                            <View style={{ flexDirection: "row" }}>
                                                                <Pressable onPress={() => setGiveCredit(!giveCredit)} style={{ width: 22, height: 22, borderRadius: 5, borderWidth: 1, marginRight: 5 }}>
                                                                    {giveCredit ? <Image source={require("./assets/check.png")}></Image> : null}
                                                                </Pressable>
                                                                <Pressable onPress={() => setGiveCredit(!giveCredit)} style={{ flex: 1, marginTop: 2 }}>
                                                                    <Text>Attribuer le kill</Text>
                                                                </Pressable>
                                                            </View>

                                                            <View style={[styles.killbutton, { width: 150, marginTop: 20 }]}>
                                                                <Pressable onPress={() => {
                                                                    Alert.alert("Confirmer ?", "Cette action est définitive", [{
                                                                        text: "Confirmer", onPress: () => {
                                                                            kill(route.params.username, focusOn.name, giveCredit, setFocus);
                                                                            focusOn.alive = false;
                                                                            focusOn.death = "À l'instant"
                                                                        }
                                                                    }, { text: "Annuler" }])
                                                                }}>
                                                                    <Text>Éliminer de la partie</Text>
                                                                </Pressable>
                                                            </View></View> : null
                                                    }
                                                </View>
                                                <View style={{ flex: 1, flexDirection: "column" }}>
                                                    {focusOn.alive ? <View>

                                                        <View style={{ alignItems: "center" }}>
                                                            <View><Text>Mission</Text></View>
                                                            {
                                                                modifyingMission == false ?
                                                                    <Pressable style={{ minHeight: 30, width: "100%", textAlignVertical: "center", textAlign: "left", padding: 5, paddingRight: 35, borderWidth: 1, borderColor: "#E0E0E0", marginLeft: 5, borderRadius: 10 }} onPress={() => { setModifyingMission(true) }}>
                                                                        <Text key={temp_mission}>{temp_mission}</Text>
                                                                    </Pressable>
                                                                    :
                                                                    <TextInput onChangeText={text => { setTempMission(text); setModifyingMission(true) }} onEndEditing={() => { setModifyingMission(false) }} autoFocus={true} placeholder="Tapez ici" key={focusOn.mission} style={{ minHeight: 90, width: "100%", textAlignVertical: "center", textAlign: "left", padding: 5, paddingRight: 35, borderWidth: 1, borderColor: "#E0E0E0", marginLeft: 5, borderRadius: 10 }}>{focusOn.mission}</TextInput>
                                                            }
                                                        </View>
                                                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                                                            <Pressable style={[styles.closeButton, { flex: 1 }]} onPress={() => {
                                                                focusOn.mission = temp_mission;
                                                                setFocus(false);
                                                                setShouldSave(true);
                                                                setGiveCredit(false)
                                                                setModifyingMission(false)
                                                            }}>
                                                                <Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/check-mark.png')} />
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                        :
                                                        <View style={{ alignSelf: "center", justifyContent: "space-around", alignItems: "center", flex: 1 }}>
                                                            <Text style={{ textAlign: "center" }}>Mort:{"\n"}{focusOn.death}</Text>
                                                            <Text style={{ textAlign: "center" }}>Cause du décès:{"\n"}{focusOn.mission}</Text>
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                        <TouchableWithoutFeedback style={{ height: "100%" }} onPress={() => { setFocus(false); setGiveCredit(false); setModifyingMission(false) }}>
                                        </TouchableWithoutFeedback>
                                    </Modal>
                                    <ScrollView style={{ marginTop: 10, marginBottom: 50 }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <View style={{ flex: 1 }}>
                                                {players["left"].map(r =>
                                                    <Pressable key={r.name} onPress={() => { setFocus(true); setFocusOn(r); setTempMission(r.mission) }}>
                                                        {personView(r)}
                                                    </Pressable>
                                                )
                                                }
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                {players["middle"].map(r =>
                                                    <Pressable key={r.name} onPress={() => { setFocus(true); setFocusOn(r); setTempMission(r.mission) }}>
                                                        {personView(r)}
                                                    </Pressable>
                                                )
                                                }
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                {players["right"].map(r =>
                                                    <Pressable key={r.name} onPress={() => { setFocus(true); setFocusOn(r); setTempMission(r.mission) }}>
                                                        {personView(r)}
                                                    </Pressable>
                                                )
                                                }
                                            </View>
                                        </View>
                                        <Pressable onPress={() => {
                                            Alert.alert("Confirmer ?", "Cette action est définitive", [{
                                                text: "Confirmer", onPress: () => {
                                                    endKiller(route.params.username, setTab);
                                                }
                                            }, { text: "Annuler" }])
                                        }}>
                                            <View style={[styles.killbutton, { marginTop: 20, marginBottom: 50, minHeight: 50 }]}>
                                                <Text style={{ fontSize: 30, fontWeight: "bold" }}> Mettre fin à la partie </Text>
                                            </View>
                                        </Pressable>
                                    </ScrollView>
                                </View>
                                : <View></View>
            }
        </View>
    )
}

