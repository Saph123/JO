import styles from "./style.js";
import * as React from 'react';
import { View, Pressable, Image, ScrollView, Text, Alert, TextInput, Modal, Keyboard } from 'react-native';
import { die, lutImg, vibrateLight, fetchKiller, updateMission, personView, kill, endKiller, changeMission, chatView, fetchChat } from './utils.js';

export function KillerScreen({ route }) {
    const [tabs, setTab] = React.useState({ states: ["waiting"], status: "waiting" });
    const [kills, setKills] = React.useState([{ name: "", mission: "", date: "" }])
    const [alive, setAlive] = React.useState(true)
    const [target, setTarget] = React.useState("")
    const [mission, setMission] = React.useState("")
    const [discovered, setDiscovered] = React.useState(false)
    const [missions, setMissionAsRef] = React.useState([{ title: "" }])
    const [players, setPlayers] = React.useState({ left: [], middle: [], right: [], everyone: [] })
    const [refresh, setRefresh] = React.useState(true)
    const [currentMisson, setCurrentMission] = React.useState({ title: "" })
    const [modifyingMission, setModifyingMission] = React.useState(false)
    const [temp_mission, setTempMission] = React.useState("")
    const [shouldSave, setShouldSave] = React.useState(false)
    const [motiv_text, setMotivText] = React.useState("")
    const [focus, setFocus] = React.useState(false)
    const [focusOn, setFocusOn] = React.useState("")
    const [giveCredit, setGiveCredit] = React.useState(false)
    const [gameOver, setGameOver] = React.useState(false)
    const [chatText, setChatText] = React.useState("");
    const [localText, setLocalText] = React.useState("");
    const [newMessage, setNewMessage] = React.useState("");
    const [keyboardHeight, setKeyboardHeight] = React.useState(0);
    const [timeAlive, setTimeAlive] = React.useState("")
    const [lifetime, setLifetime] = React.useState("")
    const ref = React.useRef(null)
    let missions_list = missions;
    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            e => {
                setKeyboardHeight(e.endCoordinates.height);
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
            }
        );
        var timer
        if (refresh == true) {
            fetchKiller(route.params.username, setKills, setAlive, setMission, setTarget, setTab, setMissionAsRef, setMotivText, setPlayers, setGameOver, setChatText, setNewMessage, setLifetime).then(start => {
                timer = setInterval(() => {
                    let now = new Date()
                    let startDate = new Date(start*1000)
                    let diff = new Date(now - startDate)
                    let days = String(diff.getDate() -1) + "j "
                    let hours = diff.getHours() + "h "
                    let minutes = diff.getMinutes() + "min "
                    let seconds = diff.getSeconds() + "s"
                    setTimeAlive(days + hours + minutes + seconds)
                })
            }, 1000);
            setRefresh(false)
            return () => {
                keyboardDidShowListener.remove();
                keyboardDidHideListener.remove();
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
                        let chatName = r == "en cours" ? "killer/" + target : "killer/" + route.params.username
                        fetchChat(chatName, setChatText, setNewMessage)
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
                <ScrollView style={{ height: "100%" }} ref={ref}>
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
                            <View style={{ height: 300 + keyboardHeight, left: 0, right: 0, bottom: 0, paddingBottom: keyboardHeight + 10, width: "100%", borderWidth: 1 }}>
                                {chatView(null, chatText, setChatText, localText, setLocalText, "killer/" + target, "Killer", false)}
                            </View>
                        </View>
                        :
                        <View></View>}
                </ScrollView>
                : tabs.status == "résumé" ?
                    <View style={{ flex: 2, flexDirection: "column" }}>
                        <View style={{ flex: 2, flexDirection: "row" }}>
                            <View style={{ flex: 1, flexDirection: "column", marginTop: 10 }}>
                                <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>Etat:</Text>
                                <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 10 }}>
                                    {alive ? "En vie depuis:\n\n" + timeAlive : "Temps de vie:\n\n" + lifetime}
                                </Text>
                                {alive ?
                                    <View style={{ marginTop: 10 }}>
                                        <View style={styles.killbutton}>
                                            <Pressable onPress={() => {
                                                Alert.alert("Confirmer votre mort", "", [{
                                                    text: "Confirmer", onPress: () => {
                                                        die(route.params.username, setAlive, setRefresh);
                                                        setLifetime(timeAlive);
                                                    }
                                                }, { text: "Annuler" }])
                                            }}><Text>Omar m'a tuer</Text></Pressable>
                                        </View>
                                    </View>
                                    : <View></View>}
                                {alive ? <View></View> : <View><Image style={{ width: "100%", resizeMode: "contain" }} source={require('./assets/wasted.png')}></Image></View>}
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>Kills:</Text>
                                </View>
                                {kills.length > 0 ?
                                    <ScrollView style={{ flex: 1, flexDirection: "column", marginTop: "5%", borderWidth: 1, borderRadius: 10 }}>
                                        {kills.map(r =>
                                            <View key={r.name} style={[styles.kills, { borderRadius: 10, margin: 5 }]}>
                                                <Text style={{ textAlign: "center" }}>{r.name + "\n" + r.date}:{"\n"}{r.mission}</Text>
                                            </View>)}
                                    </ScrollView>
                                    : <View><Text style={{ textAlign: "center", marginTop: 20 }}>Personne...</Text></View>}

                            </View>
                        </View>
                        {alive?

                            <View style={{ height: 300 + keyboardHeight, left: 0, right: 0, bottom: 0, paddingBottom: keyboardHeight + 10, width: "100%", borderWidth: 1 }}>
                            {chatView(null, chatText, setChatText, localText, setLocalText, "killer/" + route.params.username, route.params.username, false)}
                        </View> : null
                        }
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

                                                    {personView(focusOn.name, true)}
                                                    {focusOn.alive & !gameOver ?
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
                                                    {focusOn.alive & !gameOver ? <View>

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
                                                                setGiveCredit(false);
                                                                setModifyingMission(false);
                                                                changeMission(route.params.username, focusOn);
                                                            }}>
                                                                <Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/check-mark.png')} />
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                        : !focusOn.alive ?
                                                            <View style={{ alignSelf: "center", justifyContent: "space-around", alignItems: "center", flex: 1 }}>
                                                                <Text style={{ textAlign: "center" }}>Mort:{"\n"}{focusOn.death}</Text>
                                                                <Text style={{ textAlign: "center" }}>Cause du décès:{"\n"}{focusOn.mission}</Text>
                                                            </View>
                                                            : <View>
                                                                <View style={{ alignItems: "center" }}>
                                                                    <View><Text>Mission</Text></View>
                                                                    {
                                                                        <View style={{ minHeight: 30, width: "100%", textAlignVertical: "center", textAlign: "left", padding: 5, paddingRight: 35, borderWidth: 1, borderColor: "#E0E0E0", marginLeft: 5, borderRadius: 10 }}>
                                                                            <Text key={temp_mission}>{temp_mission}</Text>
                                                                        </View>
                                                                    }
                                                                </View>
                                                            </View>
                                                    }
                                                </View>
                                            </View>
                                            {focusOn["nbr_of_kills"] > 0 ?
                                                <ScrollView style={{ maxHeight: 250, borderWidth: 1, borderRadius: 20, paddingLeft: 10, paddingRight: 10, paddingTop: 5 }}>

                                                    <Text style={{ height: 20, textAlign: "center", fontWeight: "bold" }}>Victimes:</Text>
                                                    {focusOn.kills.map(kill =>
                                                        <View key={kill.name} style={{ flexDirection: "row" }}>

                                                            {personView(kill.name, false)}
                                                            <Text style={{ marginTop: 30, maxWidth: 100, textAlign: "center", textAlignVertical: "center" }}>{kill.date + "\n\n" + kill.mission}</Text>
                                                        </View>
                                                    )
                                                    }
                                                </ScrollView>
                                                : null}
                                        </View>
                                        <Pressable style={{ height: "100%" }} onPress={() => { setFocus(false); setGiveCredit(false); setModifyingMission(false) }}>
                                            <View style={{ height: "100%" }}></View>
                                        </Pressable>
                                    </Modal>
                                    <ScrollView style={{ marginTop: 10, marginBottom: 50 }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <View style={{ flex: 1 }}>
                                                {players["left"].map(r =>
                                                    <Pressable key={r.name} onPress={() => { setFocus(true); setFocusOn(r); setTempMission(r.mission) }}>
                                                        {personView(r.name, r.alive)}
                                                    </Pressable>
                                                )
                                                }
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                {players["middle"].map(r =>
                                                    <Pressable key={r.name} onPress={() => { setFocus(true); setFocusOn(r); setTempMission(r.mission) }}>
                                                        {personView(r.name, r.alive)}
                                                    </Pressable>
                                                )
                                                }
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                {players["right"].map(r =>
                                                    <Pressable key={r.name} onPress={() => { setFocus(true); setFocusOn(r); setTempMission(r.mission) }}>
                                                        {personView(r.name, r.alive)}
                                                    </Pressable>
                                                )
                                                }
                                            </View>
                                        </View>
                                        {
                                            gameOver ? null :
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
                                        }
                                    </ScrollView>
                                </View>
                                : tabs.status == "results" ?
                                    <View style={{ flex: 2, flexDirection: "row" }}>
                                        <View style={{ flex: 1, borderEndWidth: 2 }}>
                                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 10 }}>Survie</Text>
                                            <View style={{ borderBottomWidth: 2, marginBottom: 10 }}></View>
                                            <ScrollView>
                                                {
                                                    players.everyone.sort((a, b) => a.rank - b.rank).map(player =>
                                                        <View key={player.name} style={{ flexDirection: "row", alignSelf: "center" }}>
                                                            {player.rank < 4 ?
                                                                <Image style={{ marginRight: 10, flex: 1, maxWidth: 20 }} source={player.rank == 1 ? require("./assets/or.png") : player.rank == 2 ? require("./assets/argent.png") : require("./assets/bronze.png")} /> : <View style={{ height: 30, width: 30 }}></View>}
                                                            <Text key={player.name} style={{ height: 30, marginTop: 5, width: 100 }}>{player.name}</Text>
                                                        </View>
                                                    )}
                                            </ScrollView>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 10 }}>Kills</Text>
                                            <View style={{ borderBottomWidth: 2, marginBottom: 10 }}></View>
                                            <ScrollView>
                                                {
                                                    players.everyone.sort((a, b) => b.nbr_of_kills - a.nbr_of_kills).map(player =>
                                                        <View key={player.name} style={{ flexDirection: "row", alignSelf: "center" }}>
                                                            {player.rank < 4 ?
                                                                <Image style={{ marginRight: 10, flex: 1, maxWidth: 20 }} source={player.rank == 1 ? require("./assets/or.png") : player.rank == 2 ? require("./assets/argent.png") : require("./assets/bronze.png")} /> : <View style={{ height: 30, width: 30 }}></View>}
                                                            <Text key={player.name} style={{ height: 30, marginTop: 5, width: 100 }}>{player.name} {player.nbr_of_kills}</Text>
                                                        </View>
                                                    )}
                                            </ScrollView>
                                        </View>
                                    </View>
                                    : <View></View>
            }
        </View>
    )
}

