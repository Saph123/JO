import styles from "./style";
import * as React from 'react';
import { View, ActivityIndicator, Text, Image, Pressable, Linking, Alert } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import CountDown from 'react-native-countdown-component';
import { getNextEventseconds } from "./planning.js";
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { getValueFor, manageEvents, registerForPushNotificationsAsync, videoHandler, modalChat, eventView, fetchChat, pushtoken, pushcluedo } from './utils.js';
import { ChatContext, SportContext } from "./App";

export function HomeScreen({ route, navigation }) {
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
    const [chatText, setChatText] = React.useState("");
    const [localText, setLocalText] = React.useState("");
    const chatcontext = React.useContext(ChatContext);
    async function playcluedo() {
        pushcluedo()
        if (soundstatus == undefined) {


            const { sound } = await Audio.Sound.createAsync(
                require('./assets/cluedo.wav')
            );
            setSound(sound);
            await sound.playAsync()
        }
        if (soundstatus != undefined) {

            var soundlocal = await soundstatus.getStatusAsync();
            if (soundlocal.isPlaying == true) {
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
        var startEvent = getNextEventseconds();
        setSecondsleft(startEvent.time);
        setNextEvent(startEvent.name);
        registerForPushNotificationsAsync().then(token => { setExpoPushToken(token); pushtoken(token, username) });
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            let message = notification.request.content
            if (message.title == "CLUEDO!") {
                Alert.alert(message.title, message.body, [{text : "Say no more"}, {text : "Hold my beer"}])
            }
            else if (message.title == "Clicker: Happy Hour!") {
                if (message.body.indexOf("fin") != -1) {
                    alert("Fin de l'happy hour!")
                }
                else if (message.body.indexOf("T'es mauvais") != -1) {
                    Linking.openURL('https://www.youtube.com/watch?v=J1-JmvaT2WU');
                }
                else if (message.body.indexOf("C'est parti") != -1) {
                    alert("Vite! c'est l'happy hour clicker!");
                    navigation.navigate('ClickerScreen');
                }
            }
            else {
                Alert.alert(message.title, message.body, [{text : "Ok"}])
            }


        });
        var chatInterval = setInterval(() => fetchChat("Home", setChatText, chatcontext.setNewMessage), 3000);

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            
            let message = response.notification.request.content

            
            if (message.title == "CLUEDO!") {
                Alert.alert(message.title, message.body, [{text : "Say no more"}, {text : "Hold my beer"}])
            }
            else if (message.body.indexOf("PUSH") != -1) {
                navigation.navigate('pushNotifScreen');
            }
            else if (message.title.indexOf("Easter Egg!") != -1) {

                Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
            }
            else if (message.title == "Clicker: Happy Hour!") {
                if (message.body.indexOf("fin") != -1) {
                    alert("Fin de l'happy hour!")
                }
                else if (message.body.indexOf("T'es mauvais") != -1) {
                    alert("T'es mauvais!")
                    Linking.openURL('https://www.youtube.com/watch?v=J1-JmvaT2WU');
                }
                else if (message.body.indexOf("C'est parti") != -1) {
                    alert("Vite! c'est l'happy hour clicker!");
                    navigation.navigate('ClickerScreen');
                }
            }
            else {
                Alert.alert(message.title, message.body, [{text : "Ok"}])
            }

        });
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
            clearInterval(chatInterval);
        };

    }, [chatcontext]);
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
                    onPress={() => { navigation.navigate('LoginScreen') }}
                >
                    <Text style={styles.texthomebutton}>Login</Text>
                </TouchableOpacity>
                <StatusBar style="light" />
            </View>
        )
    }
    return (

        <ScrollView>
            <ChatContext.Consumer>
                {value => modalChat(value, chatText, setChatText, localText, setLocalText, "Home")}

            </ChatContext.Consumer>
            {videoHandler(setBoules, boules, videoBoule, require('./assets/boules.mp4'), true)}
            {secondsleft < 0 ? <View><Pressable onPress={() => navigation.navigate('PlanningScreen')} style={styles.loginbutton}><Text style={styles.texthomebutton}>Planning</Text></Pressable></View> : secondsleft == 0 ? <Pressable onPress={() => navigation.navigate('PlanningScreen')}>
                <Image style={{ alignSelf: "center" }} source={require('./assets/80s.gif')} /></Pressable> : <View><Text style={{ alignSelf: "center" }}>{nextEvent + " dans :"}</Text><CountDown
                    style={{ color: "black" }}
                    digitStyle={{ backgroundColor: "#FF8484" }}
                    until={secondsleft}
                    onFinish={() => { setSecondsleft(0); setTimeout(() => setSecondsleft(-1), 1000 * 5 * 60 * 60) }}
                    onPress={() => navigation.navigate('PlanningScreen')}
                    size={20}
                /></View>}
            <SportContext.Consumer>
                {value =>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            {eventView(currentEvents, eventsDone, "Trail", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Dodgeball", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Pizza", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Tong", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Babyfoot", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Flechette", navigation, value.setCurrentSport)}
                        </View>
                        <View style={{ flex: 1 }}>
                            {eventView(currentEvents, eventsDone, "PingPong", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Orientation", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Beerpong", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Volley", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Waterpolo", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Larmina", navigation, value.setCurrentSport)}
                        </View>
                        <View style={{ flex: 1 }}>
                            {eventView(currentEvents, eventsDone, "Natation", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "SpikeBall", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Ventriglisse", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "100mRicard", navigation, value.setCurrentSport)}
                            {eventView(currentEvents, eventsDone, "Petanque", navigation, value.setCurrentSport, setBoules)}
                            {eventView(currentEvents, eventsDone, "Molky", navigation, value.setCurrentSport)}
                        </View>

                    </View>
                }
            </SportContext.Consumer>

            <View>
                <TouchableOpacity style={{ alignSelf: "center", backgroundColor: "lightgrey", borderRadius: 30 }} onPress={playcluedo}>
                    <Image style={{ borderRadius: 30, borderWidth: 1, borderColor: "black" }} source={require('./assets/cluedo.png')} />
                </TouchableOpacity>
                <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1 }, styles.inProgress]} onPress={() => { navigation.navigate('ClickerScreen') }} >
                    <Image style={styles.sportimage} source={require('./assets/sports/clicker.png')} />
                </Pressable>
                <TouchableOpacity style={{ alignSelf: "center", width: 65, height: 85, margin: 10 }} onPress={() => { navigation.navigate('SummaryScreen') }}>
                    <Image style={{ borderRadius: 15, borderWidth: 1, borderColor: "black" }} source={require('./assets/summary.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginbutton}
                    onPress={() => { navigation.navigate('LoginScreen', { pushtoken: expoPushToken }) }}
                >

                    <Text style={styles.texthomebutton}>Logout</Text>
                </TouchableOpacity>
                {username == "Max" || username == "Ugo" || username == "Antoine" ? <TouchableOpacity style={styles.logoutbutton}
                    onPress={() => { navigation.navigate('pushNotifScreen') }}
                >

                    <Text style={styles.texthomebutton}>Push Notif!</Text>
                </TouchableOpacity> : <View></View>}
            </View>
            <StatusBar style="light" />
        </ScrollView>

    );
}