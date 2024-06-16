import styles from "./style.js";
import * as React from 'react';
import { View, Pressable, Image, ScrollView, Text,  TextInput, Modal } from 'react-native';
import { lutImg, vibrateLight, fetchKiller, updateMission } from './utils.js';

export function RangementScreen({ route }) {
    const [tabs, setTab] = React.useState({ states: ["waiting"], status: "waiting" });
    const [kills, setKills] = React.useState([{ name: "", mission: "", date: "" }])
    const [alive, setAlive] = React.useState(true)
    const [target, setTarget] = React.useState("")
    const [mission, setMission] = React.useState("")
    const [missions, setMissionAsRef] = React.useState([{ title: "" }])
    const [players, setPlayers] = React.useState({ left: [], middle: [], right: [], everyone: [] })
    const [refresh, setRefresh] = React.useState(true)
    const [currentMisson, setCurrentMission] = React.useState({ title: "" })
    const [modifyingMission, setModifyingMission] = React.useState(false)
    const [temp_mission, setTempMission] = React.useState("")
    const [shouldSave, setShouldSave] = React.useState(false)
    const [motiv_text, setMotivText] = React.useState("")
    const [focus, setFocus] = React.useState(false)
    const [gameOver, setGameOver] = React.useState(false)
    const [timeAlive, setTimeAlive] = React.useState("")
    const [lifetime, setLifetime] = React.useState("")
    const [nbMissions, setNbMissions] = React.useState(0)
    let missions_list = missions;
    React.useEffect(() => {
        var timer
        if (refresh == true) {
            fetchKiller(route.params.username, setKills, setAlive, setMission, setTarget, setTab, setMissionAsRef, setMotivText, setPlayers, setGameOver, setLifetime, setNbMissions).then(start => {
                timer = setInterval(() => {
                    let now = new Date().getTime()
                    let startDate = start * 1000
                    let diff = parseInt((now - startDate) / 1000)
                    let days = parseInt(diff / 86400) + "j "
                    let hours = parseInt((diff % 86400) / 3600) + "h "
                    let minutes = parseInt((diff % 3600) / 60) + "min "
                    let seconds = parseInt(diff % 60) + "s"
                    setTimeAlive(days + hours + minutes + seconds)
                })
            }, 1000);
            setRefresh(false)
            return () => {
                clearInterval(timer)
            }
        }

    }, []);
    return (
        <View style={{ flex: 1, flexDirection: "column", height: 50, backgroundColor: "#C9CBCD" }}>
            {alive ? <View style={{ height: 50, flexDirection: "row" }}>
                {tabs.states.map(r =>
                    <Pressable key={r} onPress={() => {
                        vibrateLight();
                    }} style={r == tabs.status ?
                        { flex: 1, backgroundColor: "black", borderColor: "white", borderWidth: 5, alignItems: "center", borderBottomStartRadius: 15, borderBottomEndRadius: 15 } :
                        { flex: 1, backgroundColor: "black", borderColor: "grey", borderWidth: 5, alignItems: "center", borderBottomStartRadius: 15, borderBottomEndRadius: 15 }}><View>
                            <Image style={styles.tabimage} resizeMode="contain" resizeMethod="auto" source={lutImg(r)} /></View></Pressable>)}
            </View>
                :
                <View></View>}

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
                    <Pressable style={{ height: "100%" }} onPress={() => { setFocus(false); setModifyingMission(false) }}>
                    </Pressable>
                </Modal>
                <View>
                    <View style={{ flexDirection: "row", marginTop: 22 }}>
                        <ScrollView style={{ flex: 1, borderRightWidth: 1, borderColor: "#E0E0E0" }}>
                            <Text style={[styles.showPlayers, { height: 60, width: 200, fontWeight: "bold", fontSize: 18 }]}>Missions{"\n"}({motiv_text})</Text>
                            {missions_list.map(r =>
                                <Pressable key={r.title} onPress={() => { setTempMission(r.title); setCurrentMission(r); setFocus(true) }}>
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
                                    setFocus(true)
                                }
                                }>
                                    <Text>Ajouter une mission</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

