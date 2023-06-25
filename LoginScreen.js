import styles from "./style";
import * as React from 'react';
import { View, TextInput, Text, Image, Linking, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { getValueFor, save, videoHandler, pushtoken, manageEvents, eventView, personView } from './utils';
import { SportContext, version } from "./global.js"
import { fetch_activities, fetch_global_results } from "./trace.js";
import { Planning } from "./planning.js";
import { addth } from "./utils";

export function LoginScreen({ route, navigation }) {
    const [userName, setuserName] = React.useState("");
    const [password, setpassword] = React.useState("");
    const [videoVisible, setVideoVisible] = React.useState(false);
    const video = React.useRef(null);
    const [loggedIn, setLoggedIn] = React.useState(false);
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
    const controller = new AbortController()
    // 5 second timeout:
    let planning = new Planning();
    let now = new Date()
    React.useEffect(() => {
        getValueFor("username").then(user => {
            setuserName(user);
            if (user != "") {
                setLoggedIn(true);
                manageEvents(setEventsDone, setEventsInProgess)
                fetch_activities(user, setArbitre, setEvents);
                fetch_global_results().then(r => {

                    for (var player_data in r) {
                        if (r[player_data]["name"] == user) {
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
                        }
                    }
                    setLoading(false);
                }
                );
            }
            else {
                setLoading(false);
            }
        });
        getValueFor("password").then(r => setpassword(r));
        setLoading(false);
    }, []);
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    if (!loggedIn) {
        return (
            <ScrollView style={{ flexDirection: "column", flex: 1 }}>
                {videoHandler(setVideoVisible, videoVisible, video, require('./assets/scep.mp4'), false)}
                <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>
                    <View style={{ flexDirection: "row", margin: 15 }}>
                        <TextInput autoCompleteType="username" style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100 }} onChangeText={text => { setuserName(text) }} value={userName}></TextInput>
                    </View>
                    <View style={{ flexDirection: "row", margin: 15 }}>
                        <TextInput onFocus={() => setpassword("")} autoCompleteType="password" secureTextEntry={true} style={{ textAlign: "center", borderWidth: 1, borderRadius: 15, height: 20, minWidth: 100 }} onChangeText={text => setpassword(text)} value={password}></TextInput>
                    </View>
                    <View style={{ margin: 30, flexDirection: "row" }}>

                        <Pressable style={{ width: 60, height: 30, borderRadius: 15, backgroundColor: "#ff8484", justifyContent: "center" }} title="Log in" onPress={() => {
                            fetch("https://pierrickperso.ddnsfree.com:42124/login", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": userName, "password": password }) }).then(r => {
                                if (r.status == 200) {
                                    route.params.setUsername(userName);
                                    pushtoken(route.params.pushtoken, userName);
                                    save("username", userName);
                                    save("password", password);
                                    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
                                    return;
                                }
                                else {
                                    alert("Wrong login or password!");
                                    return;
                                }

                            }).catch((err) => { alert(err, "Issue with server!"); return })
                        }}>
                            <Text style={{ textAlign: "center", textAlignVertical: "center" }}>Login</Text>
                        </Pressable>
                    </View>

                </View >
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}>Brought to you by </Text></View>
                    <View style={{ alignItems: "center" }}><Pressable onPress={() => { setVideoVisible(true) }}>
                        <Image style={styles.logosah} source={require('./assets/logoSCEP.png')} />
                    </Pressable></View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Sponsors </Text></View>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Image style={styles.logosah} source={require('./assets/sah.png')} />
                        <Pressable style={styles.logosah}
                            onPress={() => { { setuserName("") }; navigation.navigate('VanRommel', { refresh: "refresh" }) }}
                        >
                            <Image style={styles.logosah} source={require('./assets/vanrommel.png')} />
                        </Pressable>
                        <Pressable onPress={() => Linking.openURL('https://www.biere-amsterdam.com/la-gamme/maximator/#')}>
                            <Image style={styles.logomaximator} source={require('./assets/maximator.png')} />
                        </Pressable>

                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>

                        <Image style={styles.logoalstom} source={require('./assets/alstom.png')} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <Image style={styles.logogaec} source={require('./assets/gaec.png')} />
                    </View>
                </View>
            </ScrollView >
        )
    }
    return (

        <ScrollView>
            {videoHandler(setVideoVisible, videoVisible, video, require('./assets/scep.mp4'), false)}
            <View style={{ flexDirection: "column", flex: 1, }}>
                <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>
                    <Text style={styles.texthomebutton}>Currently logged in as {userName}</Text>
                    <Pressable style={styles.logoutbutton}
                        onPress={() => { { setuserName(""); save("username", ""); route.params.setUsername(""); setLoggedIn(false); }; navigation.navigate('HomeScreen', { refresh: "refresh" }) }}
                    >
                        <Text style={styles.texthomebutton}>Log out!</Text>
                    </Pressable>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent:"space-evenly" }}>
                        <View style={{justifyContent: "center" }}>
                            {personView(userName)}
                        </View>
                        <View>
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
                                <Text style={styles.medailleNumber}>{now > planning["listeevent"][planning["listeevent"].length - 1].timeBegin ? rank : "?"}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Mes activités </Text></View>

                            {events.map(r => {
                                return planning["listeevent"].map(q => {
                                    if (q.eventname == r) {

                                        return (
                                            <SportContext.Consumer key={q}>
                                                {value => {
                                                    return eventView(eventsInProgress, eventsDone, r, navigation, value.setCurrentSport, "SportDetails", q.timeBegin, true)
                                                }
                                                }
                                            </SportContext.Consumer>
                                        )
                                    }



                                });
                            })}

                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> J'arbitre </Text></View>
                            {arbitre.map(r => {
                                return planning["listeevent"].map(q => {
                                    if (q.eventname == r) {
                                        return (
                                            <SportContext.Consumer key={q}>
                                                {value => { return eventView(eventsInProgress, eventsDone, r, navigation, value.setCurrentSport, "SportDetails", q.timeBegin, true) }
                                                }
                                            </SportContext.Consumer>
                                        )
                                    }
                                })
                            })}
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
};