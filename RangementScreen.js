import styles from "./style.js";
import * as React from 'react';
import { View, Pressable, Image, ScrollView, Text, TextInput, ActivityIndicator, Modal } from 'react-native';
import { lutImg, vibrateLight, fetchRangement, updateRangementTasks } from './utils.js';
import { adminlist } from "./global.js";
export function RangementScreen({ route }) {
    const [loading, setLoading] = React.useState(true)
    const [tabs, setTab] = React.useState({ states: ["résumé"], status: "résumé" });
    const [tasks, setTasks] = React.useState([{ title: "" }])
    const [currentTask, setCurrentTask] = React.useState({ title: "", points: 1, participants: [], state: 0 })
    const [shouldSave, setShouldSave] = React.useState(false)
    const [focus, setFocus] = React.useState(false)
    const [displayPoints, setDisplayPoints] = React.useState(true)
    let tasks_list = tasks;


    React.useEffect(() => {
        if (loading) {
            fetchRangement().then(r =>
                setTasks(r)
            )
            setLoading(false);
            if (route.params.username in adminlist) {
                setTab({ states: ["résumé", "modif"], status: "résumé" })
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
                    }} style={r == tabs.status ?
                        { flex: 1, backgroundColor: "black", borderColor: "white", borderWidth: 5, alignItems: "center", borderBottomStartRadius: 15, borderBottomEndRadius: 15 } :
                        { flex: 1, backgroundColor: "black", borderColor: "grey", borderWidth: 5, alignItems: "center", borderBottomStartRadius: 15, borderBottomEndRadius: 15 }}><View>
                            <Image style={styles.tabimage} resizeMode="contain" resizeMethod="auto" source={lutImg(r)} /></View></Pressable>)}
            </View>
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={focus} style={{ paddingTop: "30%" }}>
                    <View style={[styles.matchZoomView, { minHeight: 10 }]}>
                        <Pressable style={[styles.closeButton, { marginBottom: 15 }]} onPress={() => { setFocus(false); setShouldSave(true) }}><Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/remove.png')} /></Pressable>
                        <View style={{ flexDirection: "row", margin: 10 }}>
                            <Text style={{ margin: 2 }}>Tache: </Text>
                            <TextInput onChangeText={text => { currentTask.title = text }} autoFocus={currentTask.title == ""} style={{ borderWidth: 2 }}>{currentTask.title}</TextInput>

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
                    <View style={{ flexDirection: "row", marginTop: 22 }}>
                        <ScrollView style={{ flex: 1, borderRightWidth: 1, borderColor: "#E0E0E0" }}>
                            <Text style={[styles.showPlayers, { height: 60, width: 200, fontWeight: "bold", fontSize: 18 }]}>Taches</Text>
                            {tasks_list.map(r =>
                                <Pressable key={r.title} onPress={() => { console.log("test"); setCurrentTask(r); setFocus(true) }}>
                                    <Text key={r.title} style={{ minHeight: 30, width: 200, textAlignVertical: "center", textAlign: "left", padding: 5, paddingRight: 35, borderWidth: 1, borderColor: "#E0E0E0", marginLeft: 5 }}>{r.title}</Text>
                                </Pressable>
                            )
                            }
                            <View style={{ paddingTop: 50 }}></View>
                        </ScrollView>
                        <View style={{ flex: 1 }}>
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
                    </View>
                </View>
            </View>
        </View>
    )
}

