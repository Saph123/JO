import styles from "./style";
import * as React from 'react';
import { View, ActivityIndicator, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Planning } from "./planning.js";
import { fetch_results, fetch_activities } from "./trace.js";
import { getValueFor, manageEvents, eventView, addth } from './utils.js';
import { SportContext } from "./App";

export function UsernameScreen({ route, navigation }) {
    const [loading, setLoading] = React.useState(true);
    const [goldMedals, setGoldMedal] = React.useState(0);
    const [rank, setRank] = React.useState(0);
    const [silverMedals, setSilverMedal] = React.useState(0);
    const [bronzeMedals, setBronzeMedal] = React.useState(0);
    const [goldWins, setGoldWins] = React.useState([]);
    const [silverWins, setSilverWins] = React.useState([]);
    const [bronzeWins, setBronzeWins] = React.useState([]);
    const [arbitre, setArbitre] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    const [eventsDone, setEventsDone] = React.useState([]);
    const [eventsInProgress, setEventsInProgess] = React.useState([]);
    var planning = new Planning();
    var now = Date.now();


    React.useEffect(() => {
        getValueFor("username").then(r => username = r)
        manageEvents(setEventsDone, setEventsInProgess)
        fetch_activities(username, setArbitre, setEvents);
        fetch_results().then(r => {

            for (var player_data in r) {
                if (r[player_data]["name"] == username) {
                    setRank(r[player_data]["rank"] + addth(Number(r[player_data]["rank"])))
                    setGoldMedal(r[player_data]["gold"]["number"])
                    if (r[player_data]["gold"]["number"]) {
                        setGoldWins(r[player_data]["gold"]["sports"])
                    }
                    setSilverMedal(r[player_data]["silver"]["number"])
                    if (r[player_data]["silver"]["number"]) {
                        setSilverWins(r[player_data]["silver"]["sports"])
                    }
                    setBronzeMedal(r[player_data]["bronze"]["number"])
                    if (r[player_data]["bronze"]["number"]) {
                        setBronzeWins(r[player_data]["bronze"]["sports"])
                    }
                    return
                }
            }
        }
        );
        setLoading(false);


    }, []);
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <ScrollView>

            <View style={{ flex: 1 }}>
                <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Mes médailles </Text></View>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={styles.medailleNumber}>{goldMedals}</Text>
                    <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/or.png')} />
                </View>
                <View style={{ alignItems: "center" }}>
                    {goldWins.map(r => {
                        return (
                            <Text key={r}>{r}</Text>
                        )
                    })}
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={styles.medailleNumber}>{silverMedals}</Text>
                    <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/argent.png')} />
                </View>
                <View style={{ alignItems: "center" }}>
                    {silverWins.map(r => {
                        return (
                            <Text key={r}>{r}</Text>
                        )
                    })}
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={styles.medailleNumber}>{bronzeMedals}</Text>
                    <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/bronze.png')} />
                </View>
                <View style={{ alignItems: "center" }}>
                    {bronzeWins.map(r => {
                        return (
                            <Text key={r}>{r}</Text>
                        )
                    })}
                </View>
                <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Mon rang </Text></View>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={styles.medailleNumber}>{rank}</Text>
                </View>
                <View style={{ flex: 1, alignContent: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Mes activités </Text></View>
                        {events.map(r => {
                            return (
                                <SportContext.Consumer>
                                    {value =>
                                        <View key={r}>
                                            {eventView(eventsInProgress, eventsDone, r, navigation, value.setCurrentSport, 'SportDetails')}
                                        </View>
                                    }
                                </SportContext.Consumer>
                            )
                        })}
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> J'arbitre </Text></View>
                        {arbitre.map(r => {
                            return (
                                <SportContext.Consumer>
                                    {value =>
                                        <View key={r}>
                                            {eventView(eventsInProgress, eventsDone, r, navigation, value.setCurrentSport, 'SportDetails')}
                                        </View>
                                    }
                                </SportContext.Consumer>
                            )
                        })}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}