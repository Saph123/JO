import styles from "./style.js";
import * as React from 'react';
import { View, Pressable, Image, ScrollView, Text, TextInput, ActivityIndicator, Modal } from 'react-native';
import { lutImg, vibrateLight, fetchRangement, updateRangementTasks } from './utils.js';
import { adminlist } from "./global.js";
export function RangementScreen({ route }) {
    const [loading, setLoading] = React.useState(true)
    const [firstime, setFirstTime] = React.useState(true)
    const [tabs, setTab] = React.useState({ states: ["résumé"], status: "résumé" });
    const [people, setPeople] = React.useState([{ name: "", score: 0, busy: false }])
    const [tasks, setTasks] = React.useState([{ title: "", points: 1, participants: [], state: 0 }])
    const [currentTask, setCurrentTask] = React.useState({ title: "", points: 1, participants: [], state: 0 })
    const [shouldSave, setShouldSave] = React.useState(false)
    const [focus, setFocus] = React.useState(false)
    const [displayPoints, setDisplayPoints] = React.useState(true)
    const [displayState, setDisplayState] = React.useState(true)
    let tasks_list = tasks;


    React.useEffect(() => {
        if (loading) {
            fetchRangement().then(r => {
                r.tasks.sort((a, b) => a.state - b.state);
                setTasks(r.tasks)
                setPeople(r.Players)
            }
            )
            setLoading(false);
            if (firstime) {
                if (adminlist.includes(route.params.username)) {
                    setTab({ states: ["résumé", "modif"], status: "modif" })
                }
                setFirstTime(false)
            }
        }
    });


    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }

    return (
        <View style={{ flex: 1, flexDirection: "column", height: 50, backgroundColor: "#C9CBCD" }}>
            <View style={{ height: 50, flexDirection: "row" }}>
                {tabs.states.map(r =>
                    <Pressable key={r} onPress={() => {
                        vibrateLight();
                        setTab((current) => {
                            current.status = r;
                            return { ...current }
                        })
                    }} style={r == tabs.status ?
                        { flex: 1, backgroundColor: "black", borderColor: "white", borderWidth: 5, alignItems: "center", borderBottomStartRadius: 15, borderBottomEndRadius: 15 } :
                        { flex: 1, backgroundColor: "black", borderColor: "grey", borderWidth: 5, alignItems: "center", borderBottomStartRadius: 15, borderBottomEndRadius: 15 }}>
                        <View><Image style={styles.tabimage} resizeMode="contain" resizeMethod="auto" source={lutImg(r)} /></View></Pressable>)}
            </View>
            {tabs.status == "modif" ?
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={focus} style={{ paddingTop: "30%" }}>
                        <View style={[styles.matchZoomView, { minHeight: 10 }]}>
                            <Pressable style={[styles.closeButton, { marginBottom: 15 }]} onPress={() => { setFocus(false); setShouldSave(true); if (currentTask.title == "") tasks.pop(currentTask); }}><Image style={{ alignSelf: "center", marginVertical: 4, height: 30, tintColor: 'green' }} resizeMode="contain" resizeMethod="resize" source={require('./assets/save.png')} /></Pressable>
                            <View style={{ flexDirection: "row", margin: 10 }}>
                                <Text style={{ margin: 4 }}>Tache: </Text>
                                <View style={{ borderWidth: 2 }}>
                                    <TextInput style={{ margin: 2 }} onChangeText={text => { currentTask.title = text }} autoFocus={currentTask.title == ""} >{currentTask.title}</TextInput>
                                </View>

                            </View>
                            <View style={{ flexDirection: "row", margin: 10 }}>
                                {displayPoints ? <Text style={{ alignSelf: "center", marginRight: 10 }}>Points: {currentTask.points}</Text> : <Text style={{ alignSelf: "center", marginRight: 10 }}>Points: {currentTask.points}</Text>}
                                <View>
                                    <Pressable onPressIn={() => { currentTask.points++; setDisplayPoints(false) }} onPressOut={() => { setDisplayPoints(true) }}>
                                        <Image source={require('./assets/simpleplus.png')} ></Image>
                                    </Pressable>
                                    <Pressable onPressIn={() => { if (currentTask.points > 1) currentTask.points--; setDisplayPoints(false) }} onPressOut={() => { setDisplayPoints(true) }}>
                                        <Image style={{ transform: [{ rotate: '180deg' }] }} source={require('./assets/simpleplus.png')} ></Image>
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                    </Modal>
                    <View>
                        <View style={{ marginTop: 22 }}>
                            <View style={{ flexDirection: "row", marginBottom: 10, alignSelf: "center" }}>
                                <View style={{ width: 100, height: 60, backgroundColor: shouldSave ? "red" : "white", justifyContent: "center", borderRadius: 30, borderWidth: 2, marginLeft: 5, marginBottom: 5 }}>
                                    <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => {
                                        updateRangementTasks(tasks_list, setShouldSave)
                                    }
                                    }>
                                        <Text>Sauvegarder</Text>
                                    </Pressable>
                                </View>
                                <View style={{ width: 100, height: 60, backgroundColor: "white", justifyContent: "center", borderRadius: 30, borderWidth: 2, marginLeft: 5, marginBottom: 5 }}>
                                    <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => {
                                        let tasks = tasks_list;
                                        tasks.push({ title: "", points: 1, participants: [], state: 0 })
                                        setCurrentTask(tasks[tasks.length - 1]);
                                        setFocus(true)
                                    }
                                    }>
                                        <Text>Ajouter une tache</Text>
                                    </Pressable>
                                </View>
                            </View>
                            <ScrollView style={{ borderColor: "#E0E0E0", alignSelf: "center", maxHeight: 500 }}>
                                <Text style={[styles.showPlayers, { height: 30, width: 200, fontWeight: "bold", fontSize: 18 }]}>Taches</Text>
                                {tasks_list.map(r =>
                                    <Pressable key={r.title} onPress={() => { setCurrentTask(r); setFocus(true) }}>
                                        <Text key={r.title} style={{ minHeight: 30, width: 200, textAlignVertical: "center", textAlign: "left", padding: 5, paddingRight: 35, borderWidth: 1, borderColor: "#E0E0E0", marginLeft: 5 }}>{r.title}</Text>
                                    </Pressable>
                                )
                                }
                                <View style={{ paddingTop: 150 }}></View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
                :
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={focus} style={{ paddingTop: "30%" }}>
                        <View style={[styles.matchZoomView, { minHeight: 10 }]}>
                            <Pressable style={[styles.closeButton, { marginBottom: 15 }]} onPress={() => { setFocus(false); updateRangementTasks(tasks_list, setShouldSave); setLoading(true) }}><Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/remove.png')} /></Pressable>
                            <View style={{ flexDirection: "row", margin: 10 }}>
                                <Text>Tache: </Text>
                                <Text>{currentTask.title}</Text>
                            </View>
                            <View style={{ margin: 10 }}>
                                {displayState ? <Text style={{ alignSelf: "center", marginRight: 10 }}>État: {currentTask.state == 0 ? "À faire" : currentTask.state == 1 ? "En cours" : "Fini"}</Text> : <Text style={{ alignSelf: "center", marginRight: 10 }}>État: {currentTask.state == 0 ? "À faire" : currentTask.state == 1 ? "En cours" : "Fini"}</Text>}
                                <View style={{ marginTop: 10 }}>
                                    {currentTask.state == 0 ?
                                        <Pressable style={{ flexDirection: "row" }} onPressIn={() => { currentTask.state = 1; setDisplayState(false) }} onPressOut={() => { setDisplayState(true) }}>
                                            <Text style={{ alignSelf: "center" }}>Commencer </Text><Image style={{ transform: [{ rotate: '90deg' }] }} source={require('./assets/simpleplus.png')} ></Image>
                                        </Pressable>
                                        :
                                        <Pressable onPressIn={() => { currentTask.state == 1 ? currentTask.state = 2 : currentTask.state = 1; setDisplayState(false) }} onPressOut={() => { setDisplayState(true) }}>
                                            {currentTask.state == 1 ? <View style={{ flexDirection: "row" }}><Text style={{ alignSelf: "center" }}>Terminer </Text><View style={{ width: 22, height: 22, borderRadius: 5, borderWidth: 1, marginRight: 5 }}></View></View> : null}
                                        </Pressable>
                                    }
                                    {currentTask.state == 2 && adminlist.includes(route.params.username) ?
                                        <Pressable style={{ flexDirection: "row" }} onPressIn={() => { currentTask.state = 0; setDisplayState(false) }} onPressOut={() => { setDisplayState(true) }}>
                                            <Text style={{ alignSelf: "center" }}>Recommencer </Text><Image source={require('./assets/goback.png')} ></Image>
                                        </Pressable> : null
                                    }
                                </View>
                            </View>
                            {currentTask.state > 0 ?
                                <View>
                                    <View>
                                        <View style={{ borderWidth: 5, borderRadius: 5, marginBottom: 10, width: 250 }}>
                                            <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 18, marginVertical: 3 }}>Participants</Text>
                                        </View>
                                    </View>
                                    <ScrollView style={{ maxHeight: 150 }}>
                                        {people.map(r =>
                                            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 5 }}>
                                                <Text style={{ height: 30, width: 100, fontWeight: "bold", fontSize: 18 }}>{r.name}</Text>
                                                <Pressable onPress={() => { currentTask.participants.includes(r.name) ? currentTask.participants.pop(r.name) : currentTask.participants.push(r.name); setDisplayState(false) }} onPressOut={() => { setDisplayState(true) }} style={{ width: 22, height: 22, borderRadius: 5, borderWidth: 1, marginRight: 5 }}>
                                                    {currentTask.participants.includes(r.name) ? <Image source={require("./assets/check.png")}></Image> : null}
                                                </Pressable>
                                            </View>
                                        )}
                                    </ScrollView>
                                </View>
                                : null}
                        </View>

                    </Modal>
                    <View style={{ flexDirection: "row" }}>
                        <ScrollView style={{ marginBottom: 20, marginTop: 20, alignSelf: adminlist.includes(route.params.username) ? "" : "center", flex: adminlist.includes(route.params.username) ? 1 : 0 }}>
                            <Text style={[styles.showPlayers, { height: 30, width: 200, fontWeight: "bold", fontSize: 18 }]}>Taches</Text>
                            {tasks_list.map(r =>
                                <Pressable key={r.title} onPress={() => { setCurrentTask(r); setFocus(true) }}>
                                    <Text key={r.title} style={{ backgroundColor: r.state == 1 ? "orange" : r.state == 2 ? "green" : "lightgrey", minHeight: 30, width: 200, textAlignVertical: "center", textAlign: "left", padding: 5, paddingRight: 35, borderWidth: 1, borderColor: "#E0E0E0", marginLeft: 5 }}>{r.title}</Text>
                                </Pressable>
                            )
                            }
                            <View style={{ paddingTop: 50 }}></View>
                        </ScrollView>
                        {adminlist.includes(route.params.username) ?
                            <ScrollView style={{ marginBottom: 20, marginTop: 20, flex: 1 }}>
                                <Text style={[styles.showPlayers, { height: 30, fontWeight: "bold", fontSize: 18, marginLeft: 10 }]}>Personnes libres</Text>
                                {people.map(r => {
                                    if (!r.busy)
                                        return (
                                            <View style={{ justifyContent: "center" }}>
                                                <Text style={[styles.showPlayers, { height: 30, fontWeight: "bold", fontSize: 18, marginLeft: 10 }]}>{r.name}</Text>
                                            </View>)
                                }
                                )

                                }
                                <View style={{ paddingTop: 150 }}></View>
                            </ScrollView> : null}
                    </View>
                </View>
            }
        </View>
    )
}

