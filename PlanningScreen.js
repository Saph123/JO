import styles from "./style";
import * as React from 'react';
import { View, Text, Image, Modal } from 'react-native';
// import PinchZoomView from 'react-native-pinch-zoom-view';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Planning } from "./planning.js";
import { SportContext, username } from "./App";

export function PlanningScreen({ route, navigation }) {
    const [clicks, setClicks] = React.useState(0)
    const [gifVisible, setGifVisible] = React.useState(false)
    var planning = new Planning();
    var jeudi = new Date('2021-08-27T00:00:00+02:00');
    var vendredi = new Date('2021-08-28T00:00:00+02:00');
    var samedi = new Date('2021-08-29T00:00:00+02:00');
    var dimanche = new Date('2021-08-30T00:00:00+02:00');

    return (
        <ScrollView style={{ position: 'absolute', backgroundColor: "lightgrey", top: 0, left: 0, flexDirection: "row", width: 1000, height: 1000 }} maxScale={1} minScale={0.5} >
            <Modal style={{ width: "100%", height: "100%", alignSelf: "center" }}
                visible={gifVisible}>

                <View>
                    <Text></Text>
                    <Image style={{ width: "100%", height: "70%", alignSelf: "center", marginTop: "30%" }} source={require('./assets/searching.gif')} />
                    <Text style={{ fontSize: 40, alignSelf: "center", marginTop: "-30%", color: "white", textAlign: "center", textShadowColor: "black", textShadowRadius: 4 }}>{username} looking for easter eggs</Text>
                </View>
            </Modal>
            <View style={styles.calendar}>
                <View><Text style={styles.textday}>Jeudi</Text></View>
                {
                    planning["listeevent"].map(r => {
                        var minutes = r.timeBegin.getMinutes();
                        if (minutes == 0) {
                            minutes = "00"
                        }
                        if (r.timeBegin < jeudi) {
                            return (
                                <View>
                                    <View><Text style={styles.texttime}>{r.timeBegin.getHours() + ":" + minutes}</Text></View>
                                    <View><Text style={styles.textevent}>{r.eventname}</Text></View>
                                </View>)
                        }
                    })
                }
            </View>

            <View style={styles.calendar}>
                <View><Text style={styles.textday}>Vendredi</Text></View>
                {
                    planning["listeevent"].map(r => {
                        var minutes = r.timeBegin.getMinutes();
                        if (minutes == 0) {
                            minutes = "00"
                        }
                        if (r.timeBegin < vendredi && r.timeBegin > jeudi) {
                            return (
                                <View>
                                    <View><Text style={styles.texttime}>{r.timeBegin.getHours() + ":" + minutes}</Text></View>
                                    <SportContext>{value =>
                                        <View><TouchableOpacity onPress={() => { value.setCurrentSport(r.eventname); navigation.navigate('SportDetails', { sportname: r.eventname }) }}><Text style={styles.textevent}>{r.eventname}</Text></TouchableOpacity></View>
                                    }
                                    </SportContext>
                                </View>)
                        }
                    })
                }
            </View>

            <View style={styles.calendar}>
                <View><Text style={styles.textday}>Samedi</Text></View>
                {
                    planning["listeevent"].map(r => {
                        var minutes = r.timeBegin.getMinutes();
                        if (minutes == 0) {
                            minutes = "00"
                        }
                        if (r.timeBegin < samedi && r.timeBegin > vendredi) {
                            return (
                                <SportContext.Consumer>
                                    {value =>
                                        <View>
                                            <View><Text style={styles.texttime}>{r.timeBegin.getHours() + ":" + minutes}</Text></View>
                                            <View><TouchableOpacity onPress={() => { value.setCurrentSport(r.eventname); navigation.navigate('SportDetails', { sportname: r.eventname }) }}><Text style={styles.textevent}>{r.eventname}</Text></TouchableOpacity></View>
                                        </View>
                                    }
                                </SportContext.Consumer>)
                        }
                    })
                }
            </View>

            <View style={styles.calendar}>
                <View><Text style={styles.textday}>Dimanche</Text></View>
                {
                    planning["listeevent"].map(r => {
                        var minutes = r.timeBegin.getMinutes();
                        if (minutes == 0) {
                            minutes = "00"
                        }
                        if (r.timeBegin < dimanche && r.timeBegin > samedi) {
                            return (
                                <View>
                                    <View><Text style={styles.texttime}>{r.timeBegin.getHours() + ":" + minutes}</Text></View>
                                    <SportContext.Consumer>
                                        {value =>
                                            <View><TouchableOpacity onPress={() => {
                                                if (r.timeBegin.getHours() < 12) {
                                                    value.setCurrentSport(r.eventname); navigation.navigate('SportDetails', { sportname: r.eventname })
                                                }
                                                else if (r.eventname == "Remiseprix") {
                                                    if (clicks < 9) {
                                                        setClicks(clicks + 1)
                                                    }
                                                    else {
                                                        setGifVisible(true)
                                                        setClicks(0)
                                                        setTimeout(() => setGifVisible(false), 5000);
                                                    }
                                                }
                                            }}><Text style={styles.textevent}>{r.eventname}</Text></TouchableOpacity></View>
                                        }
                                    </SportContext.Consumer>
                                </View>)
                        }
                    })
                }
            </View>
        </ScrollView>)

};