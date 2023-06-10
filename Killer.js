import styles from "./style.js";
import * as React from 'react';
import { View, Pressable, Image, ScrollView, Text, Alert, RefreshControl } from 'react-native';
import { die, lutImg, vibrateLight, fetchKiller } from './utils.js';

export function KillerScreen({ route }) {
    const [tabs, setTab] = React.useState({ states: ["résumé", "en cours"], status: "résumé" });
    const [arbitre, setArbitre] = React.useState(false)
    const [kills, setKills] = React.useState([])
    const [alive, setAlive] = React.useState(true)
    const [target, setTarget] = React.useState("")
    const [mission, setMission] = React.useState("")
    let init = true;
    React.useEffect(() => {
        if (init == true){
            fetchKiller(route.params.username, setKills, setAlive, setMission, setTarget, setArbitre)
            init = false
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
                    <View style={{ position: "absolute", alignSelf: "center" }}>
                        <Image style={{ width: 300, resizeMode: "center", height: 319, top: "50%" }} source={require('./assets/piepie.jpeg')} />
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Image style={{ width: "95%", resizeMode: 'contain' }} source={require('./assets/wanted.png')} />
                    </View>
                    <View style={{ borderWidth: 1}}>
                        <Text style={{fontSize:30, alignSelf: "center", fontWeight: "bold" }}>{target}</Text>
                    </View>
                    <View>

                    </View>
                </ScrollView>
                :
                <View style={{ flex: 2, flexDirection: "column" }}>
                    <View style={{ flex: 1, flexDirection: "row", marginTop: "5%", justifyContent: "center" }}>
                        <View style={{width: "100%"}}>
                            <View style={{ marginTop: 10, flex: 1, flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>Etat:</Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ textAlign: "center", fontWeight: "bold" }}>{alive ? "Toujours en vie" : "Mort"}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    {alive ?
                                    <View style={styles.killbutton}>
                                        <Pressable onPress={() => {Alert.alert("Confirmer votre mort", "", [{ text: "Confirmer", onPress: () => die(route.params.username, setAlive)}, { text: "Annuler" }])}}><Text>Omar m'a tuer</Text></Pressable>
                                    </View> : <View></View>}
                                </View>
                            </View>
                        {alive ? <View></View> : <View style={{flex : 4}}><Image style={{ width: "100%"}} source={require('./assets/gameover.jpeg')}></Image></View>}
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>Killed:</Text>
                        </View>
                        <ScrollView style={{ flex: 1, flexDirection: "column", marginTop: "5%" }}>
                            {kills.length > 0 ? kills.map(r =>
                                <View style={styles.kills}>
                                    <Text style={{ textAlign: "center" }}>{r}</Text>
                                </View>) : <View></View>}
                        </ScrollView>

                    </View>
                </View>}
        </View>
    )

}