// import styles from "./style";
import * as React from 'react';
import { View, Dimensions, ActivityIndicator, TextInput, Text, Image, Modal, Platform, Pressable, Linking, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PinchZoomView from 'react-native-pinch-zoom-view';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Audio, Video, AVPlaybackStatus } from 'expo-av';
import CountDown from 'react-native-countdown-component';
import { Planning, getNextEventseconds } from "./planning.js";
import { Trace, fetch_results, fetch_activities } from "./trace.js";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return result;
    } else {
        return "";
    }
}
let username = "";
const styles = require("./style.js");
const ArbitreContext = React.createContext(false);
export let version = 1
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

function manageEvents(setEventsDone, setCurrentEvents) {
    var planning = new Planning();
    var localnow = Date.now();
    var eventDone = []
    var currEvent = []
    for (var event in planning["listeevent"]) {
        if (localnow > planning["listeevent"][event].timeEnd) {
            eventDone.push(planning["listeevent"][event].eventname);

        }
    }
    for (var event in planning["listeevent"]) {
        if (localnow > planning["listeevent"][event].timeBegin && localnow < planning["listeevent"][event].timeEnd) {
            currEvent.push(planning["listeevent"][event].eventname);
        }
    }

    setTimeout(() => manageEvents(setEventsDone, setCurrentEvents), 60000)

    setEventsDone(eventDone);
    setCurrentEvents(currEvent);
}
function HomeScreen({ route, navigation }) {
    const [loading, setLoading] = React.useState(1);
    const [secondsleft, setSecondsleft] = React.useState(1000);
    const [nextEvent, setNextEvent] = React.useState("");
    const [currentEvents, setCurrentEvents] = React.useState([]);
    const [eventsDone, setEventsDone] = React.useState([]);
    const [soundstatus, setSound] = React.useState();
    const [boules, setBoules] = React.useState(false);
    const notificationListener = React.useRef();
    const videoBoule = React.useRef();
    const [notification, setNotification] = React.useState(false);
    const [expoPushToken, setExpoPushToken] = React.useState('');
    const responseListener = React.useRef();
    async function playcluedo() {
        if (soundstatus == undefined) {


            const { sound } = await Audio.Sound.createAsync(
                require('./assets/cluedo.wav')
            );
            setSound(sound);
            await sound.playAsync()
        }
        if (soundstatus != undefined) {

            var test = await soundstatus.getStatusAsync();
            if (test.isPlaying == true) {
                await soundstatus.stopAsync();

            }
            else {
                await soundstatus.stopAsync();
                await soundstatus.playAsync();
            }
        }

    }
    React.useEffect(() => {
        getValueFor("username").then(r => { username = r; setLoading(0); });
        manageEvents(setEventsDone, setCurrentEvents)
        var test = getNextEventseconds();
        setSecondsleft(test.time);
        setNextEvent(test.name);
        registerForPushNotificationsAsync().then(token => { setExpoPushToken(token); pushtoken(token, username) });
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            if (notification.request.content.title == "CLUEDO!") {
                alert("Cluedo!!")
            }
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            if (response.notification.request.content.body.indexOf("PUSH") != -1) {
                navigation.navigate('pushNotifScreen');

            }
        });
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, []);
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)

    }
    if (username == "") {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                <View style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
                />
                <Text style={{ fontWeight: "bold" }}>Tu dois te connecter d'abord!</Text>
                <Text style={{ fontWeight: "bold" }}>Demande à Max tes identifiants</Text>
                <TouchableOpacity style={styles.loginbutton}
                    onPress={() => { navigation.navigate('Login') }}
                >
                    <Text style={styles.texthomebutton}>Login</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (

        <ScrollView>
            {videoHandler(setBoules, boules, videoBoule, require('./assets/boules.mp4'))}
            {secondsleft < 0 ? <View><Pressable style={styles.loginbutton}><Text style={styles.texthomebutton}>Planning</Text></Pressable></View> : secondsleft == 0 ? <Pressable onPress={() => navigation.navigate('Planning')}>
                <Image style={{ alignSelf: "center" }} source={require('./assets/80s.gif')} /></Pressable> : <View><Text style={{ alignSelf: "center" }}>{nextEvent + " dans :"}</Text><CountDown
                    style={{ color: "black" }}
                    digitStyle={{ backgroundColor: "#FF8484" }}
                    until={secondsleft}
                    onFinish={() => { setSecondsleft(0); setTimeout(() => setSecondsleft(-1), 1000 * 5 * 60 * 60) }}
                    onPress={() => navigation.navigate('Planning')}
                    size={20}
                /></View>}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    {eventView(currentEvents, eventsDone, "Trail", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Dodgeball", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Pizza", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Tong", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Babyfoot", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Flechette", navigation, route.params.setCurrentSport)}
                </View>
                <View style={{ flex: 1 }}>
                    {eventView(currentEvents, eventsDone, "PingPong", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Orientation", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Beerpong", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Volley", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Waterpolo", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Larmina", navigation, route.params.setCurrentSport)}
                </View>
                <View style={{ flex: 1 }}>
                    {eventView(currentEvents, eventsDone, "Natation", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "SpikeBall", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Ventriglisse", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "100mRicard", navigation, route.params.setCurrentSport)}
                    {eventView(currentEvents, eventsDone, "Petanque", navigation, route.params.setCurrentSport, setBoules)}
                    {eventView(currentEvents, eventsDone, "Molky", navigation, route.params.setCurrentSport)}
                </View>

            </View>

            <View>
                <TouchableOpacity style={{ alignSelf: "center", backgroundColor: "lightgrey", borderRadius: 30 }} onPress={playcluedo}>
                    <Image style={{ borderRadius: 30, borderWidth: 1, borderColor: "black" }} source={require('./assets/cluedo.png')} />
                </TouchableOpacity>
                <Pressable style={styles.inProgress} onPress={() => { navigation.navigate('ClickerScreen') }} >
                    <Image style={styles.sportimage} source={require('./assets/sports/clicker.png')} />
                </Pressable>
                <TouchableOpacity style={{ alignSelf: "center", width: 65, height: 85, margin: 10 }} onPress={() => { navigation.navigate('SummaryScreen') }}>
                    <Image style={{ borderRadius: 15, borderWidth: 1, borderColor: "black" }} source={require('./assets/summary.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginbutton}
                    onPress={() => { navigation.navigate('Login', {pushtoken:expoPushToken}) }}
                >

                    <Text style={styles.texthomebutton}>Login</Text>
                </TouchableOpacity>
                {username == "Max" || username == "Ugo" || username == "Antoine" ? <TouchableOpacity style={styles.logoutbutton}
                    onPress={() => { navigation.navigate('pushNotifScreen') }}
                >

                    <Text style={styles.texthomebutton}>Push Notif!</Text>
                </TouchableOpacity> : <View></View>}
            </View>
        </ScrollView>

    );
}

function PlanningScreen({ route, navigation }) {

    var planning = new Planning();
    var jeudi = new Date('2021-08-27T00:00:00+02:00');
    var vendredi = new Date('2021-08-28T00:00:00+02:00');
    var samedi = new Date('2021-08-29T00:00:00+02:00');
    var dimanche = new Date('2021-08-30T00:00:00+02:00');

    return (
        <PinchZoomView style={{ position: 'absolute', backgroundColor: "lightgrey", top: 0, left: 0, flexDirection: "row", width: 1000, height: 1000 }} maxScale={1} minScale={0.5} >
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
                                    <View><TouchableOpacity onPress={() => { route.params.setCurrentSport(r.eventname); navigation.navigate('SportDetails', { sportname: r.eventname }) }}><Text style={styles.textevent}>{r.eventname}</Text></TouchableOpacity></View>
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
                                <View>
                                    <View><Text style={styles.texttime}>{r.timeBegin.getHours() + ":" + minutes}</Text></View>
                                    <View><TouchableOpacity onPress={() => { route.params.setCurrentSport(r.eventname); navigation.navigate('SportDetails', { sportname: r.eventname }) }}><Text style={styles.textevent}>{r.eventname}</Text></TouchableOpacity></View>
                                </View>)
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
                                    <View><TouchableOpacity onPress={() => { if (r.timeBegin.getHours() < 12) { route.params.setCurrentSport(r.eventname); navigation.navigate('SportDetails', { sportname: r.eventname }) } }}><Text style={styles.textevent}>{r.eventname}</Text></TouchableOpacity></View>
                                </View>)
                        }
                    })
                }
            </View>
        </PinchZoomView>)

};
function Login({ route, navigation }) {
    const [userName, setuserName] = React.useState("username");
    const [password, setpassword] = React.useState("password");
    const [videoVisible, setVideoVisible] = React.useState(false);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const controller = new AbortController()
    // 5 second timeout:
    React.useEffect(() => {
        getValueFor("username").then(r => setuserName(r));
        getValueFor("password").then(r => setpassword(r));
    }, []);
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    if (username == "") {
        return (
            <ScrollView style={{ flexDirection: "column", flex: 1 }}>
                {videoHandler(setVideoVisible, videoVisible, video, require('./assets/scep.mp4'))}
                <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>
                    <View style={{ flexDirection: "row", margin: 15 }}>
                        <TextInput autoCompleteType="username" style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100 }} onChangeText={text => { setuserName(text) }} value={userName}></TextInput>
                    </View>
                    <View style={{ flexDirection: "row", margin: 15 }}>
                        <TextInput onFocus={() => setpassword("")} autoCompleteType="password" secureTextEntry={true} style={{ textAlign: "center", borderWidth: 1, borderRadius: 15, height: 20, minWidth: 100 }} onChangeText={text => setpassword(text)} value={password}></TextInput>
                    </View>
                    <View style={{ margin: 30, flexDirection: "row" }}>
                        <TouchableOpacity style={{ width: 60, height: 30, borderRadius: 15, backgroundColor: "#ff8484", justifyContent: "center" }} title="Log in" onPress={() =>

                            fetch("http://91.121.143.104:7070/login", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": userName, "password": password }) }).then(r => {
                                if (r.status == 200) {
                                    username = userName;
                                    pushtoken(route.params.pushtoken, userName);
                                    save("username", userName);
                                    save("password", password);
                                    navigation.navigate('Home', { refresh: "refresh" });
                                    return;
                                }
                                else {
                                    alert("Wrong login or password!");
                                    return;
                                }
                            }).catch((err) => { alert(err, "Issue with server!"); return })}>
                            <Text style={{ textAlign: "center", textAlignVertical: "center" }}>Login</Text>
                        </TouchableOpacity>
                        {/* <Button style={{ margin: 30 }} color='grey' title="Register" onPress={() =>

                        fetch("http://91.121.143.104:7070/register", { method: "POST", body: JSON.stringify({"version":version, "username": userName, "password": password }) }).then(r => {
                            if (r.status == 200) {
                                username = userName; navigation.navigate('Home', { refresh: "refresh" })
                            }
                            else if (r.status == 403) {
                                alert("This login already exists! Please use the login button");
                            }
                            else {
                                alert("Issue with yourlogin");
                            }
                        })}>
                    </Button> */}
                    </View>

                </View >
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}>Brought to you by </Text></View>
                    <View style={{ alignItems: "center" }}><TouchableOpacity onPress={() => { setVideoVisible(true) }}>
                        <Image style={styles.logosah} source={require('./assets/logoSCEP.png')} />
                    </TouchableOpacity></View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Sponsors </Text></View>
                    {/* <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    </View> */}
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Image style={styles.logosah} source={require('./assets/sah.png')} />
                        <TouchableOpacity style={styles.logosah}
                            onPress={() => { { username = "" }; navigation.navigate('VanRommel', { refresh: "refresh" }) }}
                        >
                            <Image style={styles.logosah} source={require('./assets/vanrommel.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.biere-amsterdam.com/la-gamme/maximator/#')}>
                            <Image style={styles.logomaximator} source={require('./assets/maximator.png')} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>

                        <Image style={styles.logoalstom} source={require('./assets/alstom.png')} />
                    </View>
                </View>
            </ScrollView >
        )
    }
    return (
        <ScrollView>
            {videoHandler(setVideoVisible, videoVisible, video, require('./assets/scep.mp4'))}
            <View style={{ flexDirection: "column", flex: 1, }}>
                <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>

                    <Text style={styles.texthomebutton}>Currently logged in as {username}</Text>
                    <TouchableOpacity style={styles.logoutbutton}
                        onPress={() => { { username = "" }; navigation.navigate('Home', { refresh: "refresh" }) }}
                    >
                        <Text style={styles.texthomebutton}>Log out!</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}>Brought to you by </Text></View>
                    <View style={{ alignItems: "center" }}><TouchableOpacity onPress={() => { setVideoVisible(true) }}>
                        <Image style={styles.logosah} source={require('./assets/logoSCEP.png')} />
                    </TouchableOpacity></View>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Sponsors </Text></View>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Image style={styles.logosah} source={require('./assets/sah.png')} />
                        <TouchableOpacity style={styles.logosah}
                            onPress={() => { { username = "" }; navigation.navigate('VanRommel', { refresh: "refresh" }) }}
                        >
                            <Image style={styles.logosah} source={require('./assets/vanrommel.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.biere-amsterdam.com/la-gamme/maximator/#')}>
                            <Image style={styles.logomaximator} source={require('./assets/maximator.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <Image style={styles.logoalstom} source={require('./assets/alstom.png')} />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
};

function SportDetailsScreen({ route }) {

    const [window_width, setWidth] = React.useState(Dimensions.get("window").width);
    const [window_height, setHeight] = React.useState(Dimensions.get("window").height);
    const [loadingmain, setloading] = React.useState(true);
    const [status, setArbitreRule] = React.useState({ arbitre: "error", status: "error" });
    const [regle, setRegle] = React.useState(false);
    const [toupdate, setToUpdate] = React.useState(false);
    React.useEffect(() => {

        setloading(false);

    }, []);

    if (loadingmain) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <PinchZoomView style={{ position: 'absolute', backgroundColor: "lightgrey", top: 0, left: 0, width: window_width, height: window_height }} setToUpdate={setToUpdate} toupdate={toupdate} maxScale={1} minScale={0.5} >
            <ArbitreContext.Consumer>
                {value => {
                    return (
                        <View style={styles.centeredView}>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={value || regle}
                                supportedOrientations={['portrait', 'landscape']}
                            >
                                <View style={styles.modalView}>
                                    <ScrollView onScroll={() => setRegle(true)} onScrollEndDrag={() => setTimeout(() => setRegle(false), 2000)} >
                                        <View style={styles.centeredView}>
                                            <Text style={styles.modalText}>Arbitres:</Text>
                                            {status['arbitre'] != "error" ? status['arbitre'].map(r => <Text key={r} style={styles.modalText} >{r}</Text>) : <View></View>}
                                            <Text style={styles.modalText}>Règles:</Text>
                                            <Text style={styles.modalText}>{status['rules']}</Text>
                                        </View>
                                    </ScrollView>

                                </View>
                            </Modal>
                        </View>)
                }

                }
            </ArbitreContext.Consumer>

            <Trace status={status} username={username} sport={route.params.sportname} width={window_width} height={window_height} setHeight={setHeight} setWidth={setWidth} setArbitreRule={setArbitreRule} traceload={setloading} pinchReset={setToUpdate} />
        </PinchZoomView>

    )
};
function addth(rank) {
    switch (Number(rank)) {
        case 1:
            return ("er!!!");
            break;
        case 2:
            return ("nd!!");
            break;
        default:
            return ("ème")
            break;

    }
}
function SummaryScreen() {
    const [loading, setLoading] = React.useState(true);
    const [tableauMedaille, setTableauMedaille] = React.useState([{}]);
    React.useEffect(() => {
        fetch_results().then(r => {
            let tempArray = []
            for (var i in r) {


                for (var j = 0; j < 50; j++) {
                    if (r[i].rank == j) {
                        let tmp = { name: r[i].name, rank: r[i].rank, or: r[i].gold.number, bronze: r[i].bronze.number, argent: r[i].silver.number };
                        tempArray.push(tmp);
                    }
                }
            }
            setTableauMedaille(tempArray)
            setLoading(false);
        })

    }, []);
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <ScrollView style={{ width: "100%" }}>
            {tableauMedaille.map(r => {


                return (
                    <View key={r.name} style={{ flexDirection: "row", justifyContent: "flex-start", borderBottomWidth: 1, borderColor: "lightgrey" }}>
                        <View style={{ flexDirection: "row", width: 100 }}>
                            <Text style={styles.medailleNumber}>{r.rank + addth(r.rank)}</Text>
                        </View>
                        <View style={{ flexDirection: "row", width: 130 }}>
                            <Text style={{ fontSize: 18 }}>{r.name}</Text>
                        </View>
                        <View style={{ flexDirection: "row", width: 130 }}>
                            <Text style={styles.medailleNumber}>{r.or}</Text>
                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/or.png')} />
                            <Text style={styles.medailleNumber}>{r.argent}</Text>
                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/argent.png')} />
                            <Text style={styles.medailleNumber}>{r.bronze}</Text>
                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/bronze.png')} />
                        </View>

                    </View>
                );
            }
            )
            }
        </ScrollView>
    )
}

function fetch_clicker(setUserNames, setCount, setRanks, setMyIndex, firsttime) {
    fetch("http://91.121.143.104:7070/teams/Clicker.json").then(response => response.json()).then(data => {

        let clicks = [];
        let players = [];
        let ranks = [];
        for (var i in data) {
            players.push(data[i].Players)
            ranks.push(data[i].rank)
            if (data[i].Players == username) {
                setMyIndex(i);
                // if (data[i].Clicks > test) {
                if (firsttime) {

                    test = data[i].Clicks;
                }
                else {
                    data[i].Clicks = test;
                }
            }
            clicks.push(data[i].Clicks);
        }
        setUserNames(players);
        setCount(clicks);
        setRanks(ranks);
        return data;
    }).catch(err => { alert(err, "Reload the screen m8"); return [] });
}
function pushClicker(navigation, setUserNames, setCount, setRanks, setMyIndex) {
    for (var i in navigation.getState().routes) {
        if (navigation.getState().routes[i].name == "ClickerScreen") { // on est tjs sur l'ecran on relance
            setTimeout(() => pushClicker(navigation, setUserNames, setCount, setRanks, setMyIndex), 3000);
        }
    }

    fetch("http://91.121.143.104:7070/clicker", { method: "POST", body: JSON.stringify({ "version": version, "username": username, "count": test }) }).then(r => {
        if (r.status == 200) {

            fetch_clicker(setUserNames, setCount, setRanks, setMyIndex, false);
            return;
        }
    }).catch((err) => { alert(err, "Issue with server! Sorry friend, reload the screen") });
}

let test = 0;
function ClickerScreen() {
    const [myRank, setRanks] = React.useState([]);
    const [count, setCount] = React.useState([]);
    const [allUserNames, setUserNames] = React.useState([]);
    const [index, setMyIndex] = React.useState(0);
    const navigation = useNavigation();
    React.useEffect(() => {
        var fetchok = false;
        // while(!fetchok){
        fetch_clicker(setUserNames, setCount, setRanks, setMyIndex, true);

        setTimeout(() => pushClicker(navigation, setUserNames, setCount, setRanks, setMyIndex), 3000);

        // }
    }, []);
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <ScrollView style={{ flex: 4 }}>

                <View style={{ justifyContent: "space-between", flex: 1 }}>
                    <View style={{ flex: 3, flexDirection: 'row' }}><Text style={{ flex: 1, textAlign: 'center' }}>Rank</Text><Text style={{ flex: 3, textAlign: 'center' }}>Username</Text><Text style={{ flex: 1, textAlign: 'center' }}>Clicks</Text></View>
                    {allUserNames.map((r, index) =>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", borderColor: "grey", borderWidth: 1, flex: 1 }}>
                            <View style={{ flex: 1 }}><Text style={{ textAlign: 'center' }}>{myRank[index]}</Text></View>
                            <View style={{ flex: 3 }}><Text style={{ textAlign: 'center' }}>{r}</Text></View>
                            <View style={{ flex: 1 }}><Text style={{ textAlign: 'center' }}>{count[index]}</Text></View>
                        </View>)}
                    {/* {myRank.map((r, index) => <Text>{r}</Text>)}
            {count.map((r, index) => <Text>{r}</Text>)} */}
                </View>
            </ScrollView>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Pressable onPress={() => { var tmp = count; tmp[index] = tmp[index] + 1; test++; setCount([...tmp]) }} style={styles.inProgress} >
                    <Image style={styles.sportimage} source={require('./assets/sports/clicker.png')} />
                </Pressable>
            </View>
        </View>
    )

}

function VanRommelScreen() {
    let textPresentation = "La Friterie Van Rommel fondée en 2020 par Paul & Fritz Van Rommel père & fils.\nCes véritables spécialistes du poulycroc (maison) et de la friture en tout genre ont vu leur renommée dépasser les frontières du Brabant Wallon."
    let text2 = "L'amour du poulet et des patates est dans notre ADN."
    return (
        <ScrollView>
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Image style={styles.logosah} source={require('./assets/vanrommel.png')} /></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16, textAlign: "center" }}>{text2}</Text></View>

                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 12 }}>{textPresentation}</Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Image style={styles.chicken} source={require('./assets/chicken.png')} /></View>
                </View>
            </View>
            <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}>Des bons ingrédients mais aussi des bons outils.</Text></View>
            </View>
            <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
            <View style={{ alignItems: "center" }}><Image style={{ width: "82%", height: 164 }} source={require('./assets/williwaller2006.png')} /></View>
            <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
            <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
            <Image style={{ borderRadius: 40, width: 50, height: 50, marginLeft: 20 }} source={require('./assets/PaulB.jpg')} />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 80, marginTop: -33 }}> Paul B.:</Text>
            <Text style={{ fontSize: 14, fontStyle: "italic", marginLeft: 150, marginTop: -25, color: "blue", textAlign: "center" }}> “Mon seul regret est de ne jamais avoir pu travailler avec les Van Rommel.”</Text>
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <TouchableOpacity onPress={() => Linking.openURL('mailto:fritkotvanrommel@gmail.com')}>
                        <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16, color: "blue", textDecorationLine: "underline" }}>Nous contacter</Text></View>
                    </TouchableOpacity>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>

                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <TouchableOpacity onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSfNP_1o3R7emNIM9B-JFRfge6lWQuD_0gyflO3xorB0MNUaVg/viewform')}>
                        <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16, color: "blue", textDecorationLine: "underline" }}>Nous rejoindre</Text></View>
                    </TouchableOpacity>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                </View>
            </View>
        </ScrollView>

    )

}
function pushNotifScreen() {
    const [title, setTitle] = React.useState("Title (doit etre court)");
    const [body, setBody] = React.useState("Body");
    const [to, setTo] = React.useState("all ou username (e.g. Ugo)");
    return (
        <View>
            <TextInput onFocus={() => setTitle("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setTitle(text); }} value={title}></TextInput>
            <TextInput onFocus={() => setBody("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setBody(text); }} value={body}></TextInput>
            <TextInput onFocus={() => setTo("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setTo(text); }} value={to}></TextInput>
            <Pressable style={styles.logoutbutton} onPress={() => askPushNotif(username, title, body, to)}><Text style={{ textAlign: "center" }}> Push!</Text></Pressable>
        </View>
    )
}
function UsernameScreen({ route, navigation }) {
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
                                <View key={r}>
                                    {eventView(eventsInProgress, eventsDone, r, navigation, route.params.setCurrentSport)}
                                </View>
                            )
                        })}
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> J'arbitre </Text></View>
                        {arbitre.map(r => {
                            return (
                                <View key={r}>
                                    {eventView(eventsInProgress, eventsDone, r, navigation, route.params.setCurrentSport)}
                                </View>
                            )
                        })}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

function eventView(currentEvents, eventsDone, sportname, navigation, setCurrentSport, setfun) {
    return (
        <Pressable delayLongPress={5000} style={currentEvents.includes(sportname) ? styles.inProgress : (eventsDone.includes(sportname) ? styles.eventDone : styles.homebuttons)}
            onPress={() => { setCurrentSport(sportname), navigation.navigate('SportDetails', { sportname: sportname }) }} onLongPress={() => {if(sportname == 'Petanque'){setfun(true)}}}
        >
            <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={lutImg(sportname)} />
        </Pressable>)
}

function videoHandler(setVideoVisible, videoVisible, video, videoSource) {
    return (
        <Modal style={{ width: "100%", height: "100%", alignSelf: "center" }}
            visible={videoVisible}

            onShow={() => video.current.playAsync()}>

            <Pressable onPress={() => { setVideoVisible(false); video.current.stopAsync() }}>
                <View>
                    <Video
                        ref={video}
                        style={{ width: "100%", height: "100%" }}
                        source={videoSource}
                        resizeMode={Platform.OS === "ios" ? "contain" : "cover"}
                        isLooping={false}
                        onPlaybackStatusUpdate={status => { if (status.durationMillis == status.positionMillis && status.durationMillis) { setVideoVisible(false) } }}

                    />
                </View>
            </Pressable>
        </Modal>
    )
}
function lutImg(sportname) {
    var lut = {
        Trail: require('./assets/sports/run.png'),
        Dodgeball: require('./assets/sports/dodgeball.png'),
        Pizza: require('./assets/sports/pizza.png'),
        Tong: require('./assets/sports/tong.png'),
        Babyfoot: require('./assets/sports/babyfoot.png'),
        Flechette: require('./assets/sports/flechette.png'),
        PingPong: require('./assets/sports/pingpong.png'),
        Orientation: require('./assets/sports/orientation.png'),
        Beerpong: require('./assets/sports/beerpong.png'),
        Volley: require('./assets/sports/volley.png'),
        Waterpolo: require('./assets/sports/waterpolo.png'),
        Larmina: require('./assets/sports/polish.png'),
        Natation: require('./assets/sports/natationsynchro.png'),
        SpikeBall: require('./assets/sports/spikeball.png'),
        Ventriglisse: require('./assets/sports/ventriglisse.png'),
        "100mRicard": require('./assets/sports/100mricard.png'),
        Petanque: require('./assets/sports/petanque.png'),
        Molky: require('./assets/sports/molkky.png'),

    };
    return lut[sportname];
}

// var firsttimesoun
async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;

    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}
async function pushtoken(token, username) {
    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // // push to server
    fetch("http://91.121.143.104:7070/pushtoken", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "token": token, "username": username }) }).then(r => {
        return;
    }).catch((err) => { alert("May be it's normal") });
}
async function pushcluedo() {
    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    // // push to server
    fetch("http://91.121.143.104:7070/cluedo", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "cluedo": username }) }).then(r => {


    }).catch((err) => { alert("May be it's normal") });
}

async function askPushNotif(username, title, body, to) {
    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    // // push to server
    fetch("http://91.121.143.104:7070/pushnotif", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": username, "title": title, "body": body, "to": to }) }).then(r => {
    }).catch((err) => { alert("May be it's normal") });
}

const Stack = createStackNavigator();
function App() {
    const [arbitre, setArbitre] = React.useState(false);
    const [soundstatus, setSound] = React.useState();


    const [load, setLoad] = React.useState(true);

    const [currentSport, setCurrentSport] = React.useState("Sportname");
    // username = getValueFor("username");
    async function playmegaphone() {
        if (soundstatus == undefined) {


            Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

            const { sound } = await Audio.Sound.createAsync(
                require('./assets/guylabedav.mp3')
            );
            setSound(sound);
            await sound.playAsync();

        }
        if (soundstatus != undefined) {
            var test = await soundstatus.getStatusAsync();

            if (test.isPlaying == true) {
                await soundstatus.stopAsync();

            }
            else {
                await soundstatus.stopAsync();
                await soundstatus.playAsync();
            }
        }

    }

    React.useEffect(() => {

        getValueFor("username").then(r => username = r);
        setLoad(false);




    }, []);
    if (load) {
        return (
            <View></View>
        )
    }
    return (
        <NavigationContainer>
            <ArbitreContext.Provider value={arbitre}>
                <Stack.Navigator screenOptions={{
                    headerStyle: {
                        backgroundColor: '#000',
                        height: 100
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} initialRouteName="Home">
                    <Stack.Screen options={({ navigation }) => ({
                        title: "Home", headerRight: () => (
                            <View style={{ flexDirection: "row", margin: 10 }}>
                                <TouchableOpacity onPress={playmegaphone}>
                                    <Image style={{ borderRadius: 40, width: 20, height: 20, margin: 30 }} source={require('./assets/megaphone.png')} />
                                </TouchableOpacity>
                                <View><TouchableOpacity style={{ alignContent: "center", textAlignVertical: "center" }} onPress={() => { navigation.navigate('UsernameScreen') }}>
                                    <Text style={{ color: "white", margin: 10, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text>
                                </TouchableOpacity></View>
                            </View>)
                    })} initialParams={{setCurrentSport: setCurrentSport }} name="Home" component={HomeScreen} />

                    <Stack.Screen options={{
                        title: "Login", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}><Text style={{ color: "white", marginRight: 20, alignSelf: "center" }}>{username}</Text>
                        </View>
                    }} initialParams={{ pushtoken: "" }} name="Login" component={Login} />

                    <Stack.Screen options={({ navigation }) => ({
                        title: "Planning", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}>
                            <View><TouchableOpacity style={{ alignContent: "center", textAlignVertical: "center" }} onPress={() => { navigation.navigate('UsernameScreen') }}>
                                <Text style={{ color: "white", margin: 10, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text>
                            </TouchableOpacity></View></View>
                    })} initialParams={{ setCurrentSport: setCurrentSport }} name="Planning" component={PlanningScreen} />
                    <Stack.Screen options={({ navigation }) => ({
                        title: currentSport, headerRight: () =>
                            <View style={{ flexDirection: "row", margin: 10 }}>
                                <View><TouchableOpacity style={{ alignContent: "center", textAlignVertical: "center" }} onPress={() => { navigation.navigate('UsernameScreen') }}>
                                    <Text style={{ color: "white", margin: 10, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text>
                                </TouchableOpacity></View>
                                <TouchableOpacity onPress={() => { setArbitre(true) }} onPressOut={() => setTimeout(() => { setArbitre(false) }, 3000)}>
                                    <Image style={{ borderRadius: 15, width: 30, height: 30 }} source={require('./assets/sifflet.png')} />
                                </TouchableOpacity>
                            </View>
                    })} initialParams={{ sportname: currentSport }} name="SportDetails" component={SportDetailsScreen} />
                    <Stack.Screen options={() => ({ title: "Tableau des médailles" })} name="SummaryScreen" component={SummaryScreen} />
                    <Stack.Screen options={() => ({
                        title: username
                    })} initialParams={{ setCurrentSport: setCurrentSport }} name="UsernameScreen" component={UsernameScreen} />

                    <Stack.Screen options={() => ({
                        title: "Notif tool"
                    })} initialParams={{ username: username }} name="pushNotifScreen" component={pushNotifScreen} />

                    <Stack.Screen options={() => ({
                        title: "Clicker!"
                    })} initialParams={{ username: username }} name="ClickerScreen" component={ClickerScreen} />
                    <Stack.Screen options={() => ({
                        title: "Van Rommel"
                    })} name="VanRommel" component={VanRommelScreen} />

                </Stack.Navigator>
            </ArbitreContext.Provider>
        </NavigationContainer>
    );
};

export default App;

