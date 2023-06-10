import styles from "./style.js";
import * as React from 'react';
import { View, Pressable, Image, ScrollView, Text } from 'react-native';
import { lutImg, vibrateLight } from './utils.js';


export function KillerScreen() {
    const [tabs, setTab] = React.useState({ states: ["résumé", "en cours"], status: "résumé" });
    return (
        <View style={{ flex: 1, flexDirection: "column", height: 50, backgroundColor: "#C9CBCD" }}>
            <View style={{ height: 50, flexDirection: "row" }} >
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
            {tabs.status == "en cours" ?
                <ScrollView style={{ height: "100%" }}>
                    <View style={{ position: "absolute", alignSelf: "center" }}>
                        <Image style={{ width: 300, resizeMode: "center", height: 319, top: "50%" }} source={require('./assets/piepie.jpeg')} />
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Image style={{ width: "95%", resizeMode: 'contain' }} source={require('./assets/wanted.png')} />
                    </View>
                </ScrollView>
                :
                <View>
                    <View style={{}}>

                    </View>

                    <View style={{ flex: 1, flexDirection: "row", marginTop: "5%", justifyContent: "center" }}>
                        <View style={styles.podium}>
                            <Text style={{ textAlign: "center" }}>Machin</Text>
                        </View>
                    </View>

                </View>}
        </View>
    )

}