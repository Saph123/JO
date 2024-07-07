import styles from "./style.js";
import * as React from 'react';
import { View, Pressable, Image, ScrollView, Text, TextInput, ActivityIndicator } from 'react-native';
import { lutImg, vibrateLight, updateMission, fetchRangement } from './utils.js';
import { adminlist } from "./global.js";
export function RangementScreen({ route }) {
    const [loading, setLoading] = React.useState(true)
    const [tabs, setTab] = React.useState({ states: ["résumé"], status: "résumé" });
    const [missions, setMissions] = React.useState([{ title: "" }])
    const [currentMisson, setCurrentMission] = React.useState({ title: "" })
    const [temp_mission, setTempMission] = React.useState("")
    const [shouldSave, setShouldSave] = React.useState(false)
    const [motiv_text, setMotivText] = React.useState("")
    const [focus, setFocus] = React.useState(false)
    let missions_list = missions;


    React.useEffect(() => {
        if (loading) {
            fetchRangement().then(r =>
                setMissions(r)
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
                <View>
                    <View style={{ flexDirection: "row", marginTop: 22 }}>
                        <ScrollView style={{ flex: 1, borderRightWidth: 1, borderColor: "#E0E0E0" }}>
                            <Text style={[styles.showPlayers, { height: 60, width: 200, fontWeight: "bold", fontSize: 18 }]}>Taches</Text>
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
                                    setTempMission("");
                                    setCurrentMission(missions[missions.length - 1]);
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

