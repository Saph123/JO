// import styles from "./style";
import * as React from 'react';
import { Button, View, Dimensions, ActivityIndicator, TextInput, Text, Image, Modal, Platform, Pressable } from 'react-native';
import { NavigationContainer, useNavigation, useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PinchZoomView from 'react-native-pinch-zoom-view';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import CountDown from 'react-native-countdown-component';
import { Planning, getNextEventseconds } from "./planning.js";
import { Trace, GetState, fetch_status, fetch_results, fetch_activities } from "./trace.js";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
let username = "";
let current_sport = "Sportname";
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


function HomeScreen({ route, navigation }) {
    const [loading, setLoading] = React.useState(1);
    const [secondsleft, setSecondsleft] = React.useState(1000);
    const [nextEvent, setNextEvent] = React.useState("");
    const [soundstatus, setSound] = React.useState();
    const [currentEvents, setCurrentEvents] = React.useState([]);
    const [eventsDone, setEventsDone] = React.useState([]);
    var planning = new Planning();
    var now = Date.now();
    async function playcluedo() {
        pushcluedo(route.params.pushtoken);
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
        var dateJO = new Date('2021-08-26T20:00:00');
        var test = getNextEventseconds();
        var eventDone = []
        var currEvent = []
        // setSecondsleft(Math.trunc((dateJO - Date.now())/1000));
        setSecondsleft(test.time);
        setNextEvent(test.name);
        for (var event in planning["listeevent"]) {
            if (now > planning["listeevent"][event].timeEnd) {
                eventDone.push(planning["listeevent"][event].eventname);
            }
        }
        for (var event in planning["listeevent"]) {
            if (now > planning["listeevent"][event].timeBegin && now < planning["listeevent"][event].timeEnd) {
                currEvent.push(planning["listeevent"][event].eventname);
            }
        }
        setEventsDone(eventDone);
        setCurrentEvents(currEvent);
        setLoading(0);
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
            <View>
                <Text style={{ alignSelf: "center" }}>{nextEvent + " dans :"}</Text>
                <CountDown
                    style={{ color: "black" }}
                    digitStyle={{ backgroundColor: "#FF8484" }}
                    until={secondsleft}
                    onFinish={() => alert('finished')}
                    onPress={() => navigation.navigate('Planning')}
                    size={20}
                />
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    {eventView(currentEvents, eventsDone, "Trail", navigation)}
                    {eventView(currentEvents, eventsDone, "Dodgeball", navigation)}
                    {eventView(currentEvents, eventsDone, "Pizza", navigation)}
                    {eventView(currentEvents, eventsDone, "Tong", navigation)}
                    {eventView(currentEvents, eventsDone, "Babyfoot", navigation)}
                    {eventView(currentEvents, eventsDone, "Flechette", navigation)}
                </View>
                <View style={{ flex: 1 }}>
                    {eventView(currentEvents, eventsDone, "PingPong", navigation)}
                    {eventView(currentEvents, eventsDone, "Orientation", navigation)}
                    {eventView(currentEvents, eventsDone, "Beerpong", navigation)}
                    {eventView(currentEvents, eventsDone, "Volley", navigation)}
                    {eventView(currentEvents, eventsDone, "Waterpolo", navigation)}
                    {eventView(currentEvents, eventsDone, "Larmina", navigation)}
                </View>
                <View style={{ flex: 1 }}>
                    {eventView(currentEvents, eventsDone, "Natation", navigation)}
                    {eventView(currentEvents, eventsDone, "SpikeBall", navigation)}
                    {eventView(currentEvents, eventsDone, "Ventriglisse", navigation)}
                    {eventView(currentEvents, eventsDone, "100mRicard", navigation)}
                    {eventView(currentEvents, eventsDone, "Petanque", navigation)}
                    {eventView(currentEvents, eventsDone, "Molky", navigation)}
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
                    onPress={() => { navigation.navigate('Login') }}
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

function PlanningScreen({ navigation }) {

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
                                    <View><TouchableOpacity onPressIn={() => { current_sport = r.eventname; navigation.navigate('SportDetails', { sportname: r.eventname }) }}><Text style={styles.textevent}>{r.eventname}</Text></TouchableOpacity></View>
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
                                    <View><TouchableOpacity onPressIn={() => { current_sport = r.eventname; navigation.navigate('SportDetails', { sportname: r.eventname }) }}><Text style={styles.textevent}>{r.eventname}</Text></TouchableOpacity></View>
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
                                    <View><TouchableOpacity onPressIn={() => { if (r.timeBegin.getHours() < 12) { current_sport = r.eventname; navigation.navigate('SportDetails', { sportname: r.eventname }) } }}><Text style={styles.textevent}>{r.eventname}</Text></TouchableOpacity></View>
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
    const controller = new AbortController()
    // 5 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    if (username == "") {
        return (
            <View style={{ flexDirection: "column", flex: 1 }}>
                <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>
                    <View style={{ flexDirection: "row", margin: 15 }}>
                        {/* <Text style={{ textAlign: "center", borderWidth: 1, borderRadius:15, borderRightWidth: 0, height: 20 }}> Username:</Text> */}
                        <TextInput onFocus={() => { if (Platform.OS !== "ios") { setuserName("") } }} onTouchStart={() => { if (Platform.OS === "ios") { setuserName("") } }} autoCompleteType="username" style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100 }} onChangeText={text => { setuserName(""); setuserName(text) }} value={userName}></TextInput>
                    </View>
                    <View style={{ flexDirection: "row", margin: 15 }}>
                        {/* <Text style={{ textAlign: "center", borderWidth: 1, borderRadius:15, borderRightWidth: 0, height: 20 }}> Password:</Text> */}
                        <TextInput onFocus={() => setpassword("")} autoCompleteType="password" secureTextEntry={true} style={{ textAlign: "center", borderWidth: 1, borderRadius: 15, height: 20, minWidth: 100 }} onChangeText={text => setpassword(text)} value={password}></TextInput>
                    </View>
                    <View style={{ margin: 30, flexDirection: "row" }}>
                        <Pressable style={{ width: 60, height: 30, borderRadius: 15, backgroundColor: "#ff8484", justifyContent: "center" }} title="Log in" onPress={() =>

                            fetch("http://91.121.143.104:7070/login", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": userName, "password": password }) }).then(r => {
                                if (r.status == 200) {
                                    username = userName;
                                    pushtoken(route.params.pushtoken, userName);
                                    navigation.navigate('Home', { refresh: "refresh" });
                                    return;
                                }
                                else {
                                    alert("Wrong login or password!");
                                    return;
                                }
                            }).catch((err) => { alert(err, "Issue with server!"); return })}>
                            <Text style={{ textAlign: "center", textAlignVertical: "center" }}>Login</Text>
                        </Pressable>
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
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Nos partenaires </Text></View>
                    {/* <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    </View> */}
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Image style={styles.logosah} source={require('./assets/sah.png')} />
                        <Image style={styles.logosah} source={require('./assets/vanrommel.png')} />
                        <Image style={styles.logomaximator} source={require('./assets/maximator.png')} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <Image style={styles.logoalstom} source={require('./assets/alstom.png')} />
                    </View>
                </View>
            </View >
        )
    }
    return (
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
                <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Nos partenaires </Text></View>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Image style={styles.logosah} source={require('./assets/sah.png')} />
                    <Image style={styles.logosah} source={require('./assets/vanrommel.png')} />
                    <Image style={styles.logomaximator} source={require('./assets/maximator.png')} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <Image style={styles.logoalstom} source={require('./assets/alstom.png')} />
                </View>
            </View>
        </View>
    )
};

function SportDetailsScreen({ route }) {

    const [window_width, setWidth] = React.useState(Dimensions.get("window").width);
    const [window_height, setHeight] = React.useState(Dimensions.get("window").height);
    const [loadingmain, setloading] = React.useState(true);
    const [status, setSportStatus] = React.useState({ arbitre: "error", status: "error" });
    const [regle, setRegle] = React.useState(false);
    React.useEffect(() => {
        setloading(false);

    }, []);

    if (loadingmain) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <PinchZoomView style={{ position: 'absolute', backgroundColor: "lightgrey", top: 0, left: 0, width: window_width, height: window_height }} maxScale={1} minScale={0.5} >
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
                                    <ScrollView onScroll={() => setRegle(true)} onScrollEndDrag={() => setTimeout(() => setRegle(false), 3000)} >
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

            <Trace status={status} username={username} sport={route.params.sportname} width={window_width} height={window_height} setHeight={setHeight} setWidth={setWidth} setSportStatus={setSportStatus} traceload={setloading} />
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
        <ScrollView>
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
function ClickerScreen() {
    return (
        <Pressable style={styles.inProgress} >
            <Image style={styles.sportimage} source={require('./assets/sports/clicker.png')} />
        </Pressable>
    )

}
function pushNotifScreen() {
    const [title, setTitle] = React.useState("Title");
    const [body, setBody] = React.useState("Body");
    const [to, setTo] = React.useState("all");
    return (
        <View>
            <TextInput onFocus={() => setTitle("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setTitle(text); }} value={title}></TextInput>
            <TextInput onFocus={() => setBody("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setBody(text); }} value={body}></TextInput>
            <TextInput onFocus={() => setTo("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setTo(text); }} value={to}></TextInput>
            <Pressable style={styles.logoutbutton} onPressIn={() => askPushNotif(username, title, body, to)}><Text style={{ textAlign: "center" }}> Push!</Text></Pressable>
        </View>
    )
}
function UsernameScreen({ navigation }) {
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
        var eventDone = []
        var currEvent = []
        fetch_activities(username, setArbitre, setEvents)
        for (var event in planning["listeevent"]) {
            if (now > planning["listeevent"][event].timeEnd) {
                eventDone.push(planning["listeevent"][event].eventname);
            }
        }
        setEventsDone(eventDone)
        for (var event in planning["listeevent"]) {
            if (now > planning["listeevent"][event].timeBegin && now < planning["listeevent"][event].timeEnd) {
                currEvent.push(planning["listeevent"][event].eventname);
            }
        }
        setEventsInProgess(currEvent)
    }, []);


    React.useEffect(() => {
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
                                    {eventView(eventsInProgress, eventsDone, r, navigation)}
                                </View>
                            )
                        })}
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> J'arbitre </Text></View>
                        {arbitre.map(r => {
                            return (
                                <View key={r}>
                                    {eventView([], [], r, navigation)}
                                </View>
                            )
                        })}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

function eventView(currentEvents, eventsDone, sportname, navigation) {
    return (
        <TouchableOpacity style={currentEvents.includes(sportname) ? styles.inProgress : (eventsDone.includes(sportname) ? styles.eventDone : styles.homebuttons)}
            onPress={() => { current_sport = sportname, navigation.navigate('SportDetails', { sportname: sportname }) }}
        >
            <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={lutImg(sportname)} />
        </TouchableOpacity>)
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
    // var test = new Planning();
    var firsttime = 1;
    const [arbitre, setArbitre] = React.useState(false);
    const [headerstatus, setstatus] = React.useState();
    const [soundstatus, setSound] = React.useState();
    const [expoPushToken, setExpoPushToken] = React.useState('');
    const [notification, setNotification] = React.useState(false);
    const notificationListener = React.useRef();
    const responseListener = React.useRef();
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

        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
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
                        title: "Home", headerRight: () => (<View style={{ flexDirection: "row", margin: 10 }}><TouchableOpacity onPressIn={playmegaphone}><Image style={{ borderRadius: 40, width: 20, height: 20, margin: 30 }} source={require('./assets/megaphone.png')} /></TouchableOpacity><TouchableOpacity style={{ alignContent: "center", textAlignVertical: "center" }} onPressIn={() => { navigation.navigate('UsernameScreen') }}>
                            <Text style={{ color: "white", marginTop: 32, marginRight: 40, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text></TouchableOpacity></View>)
                    })} initialParams={{ pushtoken: expoPushToken }} name="Home" component={HomeScreen} />

                    <Stack.Screen options={{
                        title: "Login", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}><Text style={{ color: "white", marginRight: 20, alignSelf: "center" }}>{username}</Text>
                        </View>
                    }} initialParams={{ pushtoken: expoPushToken }} name="Login" component={Login} />

                    <Stack.Screen options={{
                        title: "Planning", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}>
                            <Text style={{ color: "white", marginRight: 10, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text
                            ></View>
                    }} name="Planning" component={PlanningScreen} />
                    <Stack.Screen options={({ navigation }) => ({
                        title: current_sport, headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}><View>
                            <TouchableOpacity style={{ alignContent: "center", textAlignVertical: "center" }} onPressIn={() => { navigation.navigate('UsernameScreen') }}><Text style={{ color: "white", margin: 10, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text></TouchableOpacity></View>
                            <TouchableOpacity onPressIn={() => { setArbitre(true) }} onPressOut={() => setTimeout(() => { setArbitre(false) }, 3000)}><Image style={{ borderRadius: 15, width: 30, height: 30 }} source={require('./assets/sifflet.png')} /></TouchableOpacity></View>
                    })} initialParams={{ sportname: current_sport }} name="SportDetails" component={SportDetailsScreen} />
                    <Stack.Screen options={() => ({ title: "Tableau des médailles" })} name="SummaryScreen" component={SummaryScreen} />
                    <Stack.Screen options={() => ({
                        title: username
                    })} name="UsernameScreen" component={UsernameScreen} />

                    <Stack.Screen options={() => ({
                        title: "Notif tool"
                    })} initialParams={{ username: username }} name="pushNotifScreen" component={pushNotifScreen} />

                    <Stack.Screen options={() => ({
                        title: "Clicker!"
                    })} initialParams={{ username: username }} name="ClickerScreen" component={ClickerScreen} />

                </Stack.Navigator>
            </ArbitreContext.Provider>
        </NavigationContainer>
    );
};

export default App;

