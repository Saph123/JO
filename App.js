// import styles from "./style";
import * as React from 'react';
import { Button, View, Dimensions, ActivityIndicator, TextInput, Text, Image, Modal, Platform } from 'react-native';
import { NavigationContainer, useNavigation, useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PinchZoomView from 'react-native-pinch-zoom-view';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import CountDown from 'react-native-countdown-component';
import { Planning, getNextEventseconds } from "./planning.js";
import { Trace, GetState, fetch_status, fetch_results } from "./trace.js";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
let username = "Max";
let current_sport = "Sportname";
const styles = require("./style.js");
const ArbitreContext = React.createContext(false);
function HomeScreen({ route, navigation }) {
    const [loading, setLoading] = React.useState(1);
    const [secondsleft, setSecondsleft] = React.useState(1000);
    const [nextEvent, setNextEvent] = React.useState("");
    const [soundstatus, setSound] = React.useState();
    
    async function playcluedo() {
        pushcluedo(route.params.pushtoken);
        if (soundstatus == undefined) {

            console.log('Loading Sound');
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
        // setSecondsleft(Math.trunc((dateJO - Date.now())/1000));
        setSecondsleft(test.time);
        setNextEvent(test.name);
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
                <Text>Home Screen</Text>
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
                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Trail", navigation.navigate('SportDetails', { sportname: "Trail" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/run.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Dodgeball", navigation.navigate('SportDetails', { sportname: "Dodgeball" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/dodgeball.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Pizza", navigation.navigate('SportDetails', { sportname: "Pizza" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/pizza.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Tong", navigation.navigate('SportDetails', { sportname: "Tong" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/tong.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Babyfoot", navigation.navigate('SportDetails', { sportname: "Babyfoot" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/babyfoot.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Flechette", navigation.navigate('SportDetails', { sportname: "Flechette" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/flechette.png')} />
                    </TouchableOpacity>

                </View>
                <View style={{ flex: 1 }}>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "PingPong", navigation.navigate('SportDetails', { sportname: "PingPong" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/pingpong.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Orientation", navigation.navigate('SportDetails', { sportname: "Orientation" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/orientation.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Beerpong", navigation.navigate('SportDetails', { sportname: "Beerpong" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/beerpong.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Volley", navigation.navigate('SportDetails', { sportname: "Volley" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/volley.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Waterpolo", navigation.navigate('SportDetails', { sportname: "Waterpolo" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/waterpolo.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Larmina", navigation.navigate('SportDetails', { sportname: "Larmina" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/polishhorseshoe.png')} />
                    </TouchableOpacity>

                </View>
                <View style={{ flex: 1 }}>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Natation", navigation.navigate('SportDetails', { sportname: "Natation" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/natationsynchro.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "SpikeBall", navigation.navigate('SportDetails', { sportname: "SpikeBall" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/spikeball.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "100mRicard", navigation.navigate('SportDetails', { sportname: "100mRicard" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/100mricard.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Ventriglisse", navigation.navigate('SportDetails', { sportname: "Ventriglisse" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/100mricard.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Petanque", navigation.navigate('SportDetails', { sportname: "Petanque" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/petanque.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homebuttons}
                        onPress={() => { current_sport = "Molky", navigation.navigate('SportDetails', { sportname: "Molky" }) }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/petanque.png')} />
                    </TouchableOpacity>

                </View>

            </View>

            <View>
                <TouchableOpacity style={{ alignSelf: "center" }} onPressIn={playcluedo}>
                    <Image style={{ borderRadius: 10, borderWidth: 1, borderColor: "black" }} source={require('./assets/cluedo.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: "center" }} onPressIn={() => { navigation.navigate('SummaryScreen') }}>
                    <Image style={{ borderRadius: 5, borderWidth: 1, width: 60, height: 80, borderColor: "black", margin: 10 }} resizeMode="contain" source={require('./assets/summary.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginbutton}
                    onPress={() => { navigation.navigate('Login') }}
                >
                    <Text style={styles.texthomebutton}>Login</Text>
                </TouchableOpacity>
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
                        var minutes = r.time.getMinutes();
                        if (minutes == 0) {
                            minutes = "00"
                        }
                        if (r.time < jeudi) {
                            return (
                                <View>
                                    <View><Text style={styles.texttime}>{r.time.getHours() + ":" + minutes}</Text></View>
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
                        var minutes = r.time.getMinutes();
                        if (minutes == 0) {
                            minutes = "00"
                        }
                        if (r.time < vendredi && r.time > jeudi) {
                            return (
                                <View>
                                    <View><Text style={styles.texttime}>{r.time.getHours() + ":" + minutes}</Text></View>
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
                        var minutes = r.time.getMinutes();
                        if (minutes == 0) {
                            minutes = "00"
                        }
                        if (r.time < samedi && r.time > vendredi) {
                            return (
                                <View>
                                    <View><Text style={styles.texttime}>{r.time.getHours() + ":" + minutes}</Text></View>
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
                        var minutes = r.time.getMinutes();
                        if (minutes == 0) {
                            minutes = "00"
                        }
                        if (r.time < dimanche && r.time > samedi) {
                            return (
                                <View>
                                    <View><Text style={styles.texttime}>{r.time.getHours() + ":" + minutes}</Text></View>
                                    <View><TouchableOpacity onPressIn={() => { if (r.time.getHours() < 12) { current_sport = r.eventname; navigation.navigate('SportDetails', { sportname: r.eventname }) } }}><Text style={styles.textevent}>{r.eventname}</Text></TouchableOpacity></View>
                                </View>)
                        }
                    })
                }
            </View>
        </PinchZoomView>)

};
function Login({ navigation }) {
    const [userName, setuserName] = React.useState(null);
    const [password, setpassword] = React.useState(null);
    const controller = new AbortController()

    // 5 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    if (username == "") {
        return (
            <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>
                <View style={{ flexDirection: "row", margin: 15 }}>
                    <Text style={{ textAlign: "center", borderWidth: 1, borderRightWidth: 0, height: 20 }}> Username:</Text>
                    <TextInput style={{ textAlign: "center", borderWidth: 1, height: 20, minWidth: 100 }} onChangeText={text => { setuserName(""); setuserName(text) }} value={userName}></TextInput>
                </View>
                <View style={{ flexDirection: "row", margin: 15 }}>
                    <Text style={{ textAlign: "center", borderWidth: 1, borderRightWidth: 0, height: 20 }}> Password:</Text>
                    <TextInput secureTextEntry={true} style={{ textAlign: "center", borderWidth: 1, height: 20, minWidth: 100 }} onChangeText={text => setpassword(text)} value={password}></TextInput>
                </View>
                <View style={{ margin: 30, flexDirection: "row" }}>
                    <Button style={{ margin: 30 }} color='red' title="Log in" onPress={() =>

                        fetch("http://91.121.143.104:7070/login", { signal: controller.signal, method: "POST", body: JSON.stringify({ "username": userName, "password": password }) }).then(r => {
                            if (r.status == 200) {
                                username = userName; navigation.navigate('Home', { refresh: "refresh" });
                                return;
                            }
                            else {
                                alert("Wrong login or password!");
                                return;
                            }
                        }).catch(() => { alert("Issue with server!"); return })}>
                    </Button>
                    <Button style={{ margin: 30 }} color='grey' title="Register" onPress={() =>

                        fetch("http://91.121.143.104:7070/register", { method: "POST", body: JSON.stringify({ "username": userName, "password": password }) }).then(r => {
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
                    </Button>
                </View>
            </View>
        )
    }
    return (
        <View>
            <Text style={styles.texthomebutton}>Currently logged in as {username}</Text>
            <TouchableOpacity style={styles.logoutbutton}
                onPress={() => { { username = "" }; navigation.navigate('Login', { refresh: "refresh" }) }}
            >
                <Text style={styles.texthomebutton}>Log out!</Text>
            </TouchableOpacity></View>
    )
};

function SportDetailsScreen({ route, navigation }) {

    const [window_width, setWidth] = React.useState(Dimensions.get("window").width);
    const [window_height, setHeight] = React.useState(Dimensions.get("window").height);
    const [authorized, setauthorized] = React.useState(false);
    const [loadingmain, setloading] = React.useState(true);
    const [status, setlocalStatus] = React.useState();
    React.useEffect(() => {
        fetch_status(route.params.sportname, setlocalStatus).then(r => {
            setlocalStatus(r);
            for (var authouser in r['arbitre']) {
                if (r['arbitre'][authouser] == username) {
                    setauthorized(true);
                }
                else if ("Max" == username || "Antoine" == username || "Ugo" == username) {
                    setauthorized(true);
                }
            }
            setloading(false);

        }
        );

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
                                visible={value}
                                supportedOrientations={['portrait', 'landscape']}
                            >
                                <View style={styles.modalView}>
                                    <View style={styles.centeredView}>
                                        <Text style={styles.modalText}>Arbitres:</Text>
                                        {status['arbitre'].map(r => <Text style={styles.modalText} >{r}</Text>)}
                                    </View>

                                </View>
                            </Modal>
                        </View>)
                }

                }
            </ArbitreContext.Consumer>

            <Trace username={username} sport={route.params.sportname} width={window_width} height={window_height} setHeight={setHeight} setWidth={setWidth} autho={authorized} />
        </PinchZoomView>

    )
};

function SummaryScreen() {
    return (
        <View>
            <Text> Summary screen blyat!</Text>
        </View>
    )
}
function UsernameScreen() {
    const [loading, setLoading] = React.useState(true);
    const [goldMedals, setGoldMedal] = React.useState(0);
    const [rank, setRank] = React.useState(0);
    const [silverMedals, setSilverMedal] = React.useState(0);
    const [bronzeMedals, setBronzeMedal] = React.useState(0);
    const [goldWins, setGoldWins] = React.useState([]);
    const [silverWins, setSilverWins] = React.useState([]);
    const [bronzeWins, setBronzeWins] = React.useState([]);
    React.useEffect(() => {
        fetch_results().then(r => {

            for (var player_data in r) {
                if (r[player_data]["name"] == username) {
                    console.log(r[player_data])
                    switch (Number(r[player_data]["rank"])) {
                        case 1:
                            setRank("1st!!!");
                            break;
                        case 2:
                            setRank("2nd!");
                            break;
                        case 3:
                            setRank("3rd!")
                            break;
                        default:
                            setRank(r[player_data]["rank"] + "th")
                            break;

                    }
                    setGoldMedal(r[player_data]["gold"]["number"])
                    if (goldMedals) {
                        setGoldWins(r[player_data]["gold"]["sports"])
                    }
                    setSilverMedal(r[player_data]["silver"]["number"])
                    if (silverMedals) {
                        setSilverWins(r[player_data]["silver"]["sports"])
                    }
                    setBronzeMedal(r[player_data]["bronze"]["number"])
                    if (bronzeMedals) {
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
        <View style={{ flex: 1 }}>
            <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Mes médailles </Text></View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={styles.medailleNumber}>{goldMedals}</Text>
                <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/or.png')} />
            </View>
            <View style={{ alignItems: "center" }}>
                {goldWins.map(r => {
                    return (
                        <Text>{r}</Text>
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
                        <Text>{r}</Text>
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
                        <Text>{r}</Text>
                    )
                })}
            </View>
            <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Mon rang </Text></View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={styles.medailleNumber}>{rank}</Text>
            </View>
        </View>
    );
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
        console.log(token);
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
async function pushtoken(token){
        // 5 second timeout:
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        console.log("pushing token", token);
        // // push to server
    fetch("http://91.121.143.104:7070/pushtoken", { signal: controller.signal, method: "POST", body: JSON.stringify({ "token": token }) }).then(r => {


    }).catch((err) => { console.log(err, "May be it's normal") });
}
async function pushcluedo(){
        // 5 second timeout:
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        // // push to server
    fetch("http://91.121.143.104:7070/cluedo", { signal: controller.signal, method: "POST", body: JSON.stringify({ "cluedo": username }) }).then(r => {


    }).catch((err) => { console.log(err, "May be it's normal") });
}

async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'CLUEDOOOOO',
      body: '',
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
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

            console.log('Loading Sound');
            Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

            const { sound } = await Audio.Sound.createAsync(
                require('./assets/guylabedav.mp3')
            );
            setSound(sound);
            await sound.playAsync();

        }
        if (soundstatus != undefined) {
            var test = await soundstatus.getStatusAsync();
            console.log(test.isPlaying)
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
        registerForPushNotificationsAsync().then(token => {setExpoPushToken(token); pushtoken(token)});
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
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
                            <Text style={{ color: "white", marginTop: 32, marginRight: 10, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text></TouchableOpacity></View>)
                    })} initialParams={{ pushtoken: expoPushToken }} name="Home" component={HomeScreen} />

                    <Stack.Screen options={{
                        title: "Login", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}><Text style={{ color: "white", marginRight: 20, alignSelf: "center" }}>{username}</Text>
                        </View>
                    }} name="Login" component={Login} />

                    <Stack.Screen options={{
                        title: "Planning", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}>
                            <Text style={{ color: "white", marginRight: 10, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text
                            ></View>
                    }} name="Planning" component={PlanningScreen} />

                    <Stack.Screen options={({ navigation }) => ({
                        title: current_sport, headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}>{GetState(current_sport, headerstatus, setstatus, navigation)}<View>
                            <TouchableOpacity style={{ alignContent: "center", textAlignVertical: "center" }} onPressIn={() => { navigation.navigate('UsernameScreen') }}><Text style={{ color: "white", margin: 10, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text></TouchableOpacity></View>
                            <TouchableOpacity onPressIn={() => { setArbitre(true) }} onPressOut={() => setTimeout(() => { setArbitre(false) }, 1000)}><Image style={{ borderRadius: 15, width: 30, height: 30 }} source={require('./assets/sifflet.png')} /></TouchableOpacity></View>
                    })} initialParams={{ sportname: current_sport }} name="SportDetails" component={SportDetailsScreen} />
                    <Stack.Screen options={() => ({ title: "Résumé" })} name="SummaryScreen" component={SummaryScreen} />
                    <Stack.Screen options={() => ({
                        title: username
                    })} name="UsernameScreen" component={UsernameScreen} />
                </Stack.Navigator>
            </ArbitreContext.Provider>
        </NavigationContainer>
    );
};

export default App;

