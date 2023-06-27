import styles from "./style";
import * as React from 'react';
import { View, ScrollView, ActivityIndicator, Text, Image, Pressable, Linking, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { getNextEventseconds, Planning } from "./planning.js";
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { getValueFor, manageEvents, registerForPushNotificationsAsync, videoHandler, modalChat, eventView, fetchChat, pushtoken, pushcluedo, firstDay, vibrateLight, getShifumiNbPlayers, getPokeInfo, fetchAnnonce } from './utils.js';
import { SportContext, ChatContext, adminlist } from "./global.js"
export function HomeScreen({ route, navigation }) {
    const [loading, setLoading] = React.useState(1);
    const [username, setusername] = React.useState("");
    const [secondsleft, setSecondsleft] = React.useState(1000);
    const [nextEvent, setNextEvent] = React.useState("");
    const [currentEvents, setCurrentEvents] = React.useState([]);
    const [eventsDone, setEventsDone] = React.useState([]);
    const [soundstatus, setSound] = React.useState();
    const [boules, setBoules] = React.useState(false);
    const [displayDay, setDisplayDay] = React.useState(new Date('2022-07-13T00:00:00+02:00'));
    const notificationListener = React.useRef();
    const videoBoule = React.useRef();
    const [notification, setNotification] = React.useState(false);
    const [expoPushToken, setExpoPushToken] = React.useState('');
    const responseListener = React.useRef();
    const [chatText, setChatText] = React.useState("");
    const [localText, setLocalText] = React.useState("");
    const [nbShifumiPlayers, setNbShifumiPlayers] = React.useState(0)
    const chatcontext = React.useContext(ChatContext);
    const [annonce, setAnnonce] = React.useState("")
    const [all_players, setAllPlayers] = React.useState([[
        { name: "Antoine", poke: false },
        { name: "Armand", poke: false },
        { name: "Beranger", poke: false },
        { name: "Bifteck", poke: false },
        { name: "Boulbi", poke: false },
        { name: "Brice", poke: false },
        { name: "Bryan", poke: false },
        { name: "Chachav", poke: false },
        { name: "Chloe", poke: false },
        { name: "Clement", poke: false },
        { name: "Emma", poke: false }
    ],
    [
        { name: "Florent", poke: false },
        { name: "Girex", poke: false },
        { name: "Gui", poke: false },
        { name: "Guillaume", poke: false },
        { name: "Hugo", poke: false },
        { name: "Jason", poke: false },
        { name: "Jess", poke: false },
        { name: "Jo", poke: false },
        { name: "Keke", poke: false },
        { name: "Mams", poke: false },
        { name: "Mathias", poke: false }
    ],
    [
        { name: "Max", poke: false },
        { name: "Mimo", poke: false },
        { name: "LaGuille", poke: false },
        { name: "Lapinou", poke: false },
        { name: "Leo", poke: false },
        { name: "Pierrick", poke: false },
        { name: "Quentin", poke: false },
        { name: "Reminem", poke: false },
        { name: "Shmav", poke: false },
        { name: "Thomas", poke: false },
        { name: "Ugo", poke: false }
    ]
    ])
    let planning = new Planning();
    let now = new Date(Date.now());
    var jeudi = new Date('2023-07-13T00:00:00+02:00');
    var vendredi = new Date('2023-07-14T00:00:00+02:00');
    var samedi = new Date('2023-07-15T00:00:00+02:00');
    var dimanche = new Date('2023-07-16T00:00:00+02:00');
    async function playcluedo() {
        pushcluedo().then(r => console.log("pushing cluedo")).catch((err) => console.error("cluedo", err));
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
        switch (now.getDay()) {

            case vendredi.getDay():
                setDisplayDay(vendredi);
                break
            case samedi.getDay():
                setDisplayDay(samedi);
                break
            case dimanche.getDay():
                setDisplayDay(dimanche);
                break
            default:
                setDisplayDay(jeudi);
        }
        getValueFor("username").then(r => {
            setusername(r);
            setLoading(0)
            tempList = all_players
            tempList.map(sublist => (
                sublist.map(
                    player => (
                        getPokeInfo(r, player.name).then(info => {
                            if (info.can_send && info.score > 0) {
                                player.poke = true
                            }
                            else {
                                player.poke = false
                            }
                        })
                    )
                )))
            setAllPlayers(tempList)
        }).catch(() => setLoading(0));
        chatcontext.setChatName("Home");
        getShifumiNbPlayers(setNbShifumiPlayers)
        manageEvents(setEventsDone, setCurrentEvents)
        var startEvent = getNextEventseconds();
        setSecondsleft(startEvent.time);
        setNextEvent(startEvent.name);
        fetchAnnonce(setAnnonce)
        registerForPushNotificationsAsync().then(token => { setExpoPushToken(token); pushtoken(token, username) });
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            let message = notification.request.content
            if (message.title == "CLUEDO!") {
                Alert.alert(message.title, message.body, [{ text: "Say no more" }, { text: "Hold my beer" }])
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
            else if (message.title == "Nouvelle victime") {
                Alert.alert(message.title, message.body, [{ text: "Voir prochaine victime", onPress: () => navigation.navigate('KillerScreen') }, { text: "Balec" }])
            }
            else {
                Alert.alert(message.title, message.body, [{ text: "Ok" }])
            }


        });
        if (chatcontext.chatName == "Home") {
            var chatInterval = setInterval(() => fetchChat("Home", setChatText, chatcontext.setNewMessage), 3000);
        }

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

            let message = response.notification.request.content


            if (message.title == "CLUEDO!") {
                Alert.alert(message.title, message.body, [{ text: "Say no more" }, { text: "Hold my beer" }])
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
            else if (message.title == "Nouvelle victime") {
                Alert.alert(message.title, message.body, [{ text: "Voir prochaine victime", onPress: () => navigation.navigate('KillerScreen') }, { text: "Balec" }])
            }
            else {
                Alert.alert(message.title, message.body, [{ text: "Ok" }])
            }

        });
        // setLoading(0);
        return () => {
            clearInterval(chatInterval);
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [chatcontext.chatName, route.params.refresh]);
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
                <Pressable style={styles.loginbutton}
                    onPress={() => { vibrateLight(); navigation.navigate('LoginScreen') }}
                >
                    <Text style={styles.texthomebutton}>Login</Text>
                </Pressable>
                <StatusBar style="light" />
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: "black" }}>
            <View style={{ backgroundColor: "black", height: 50, marginTop: 10, flexDirection: "row" }}>
                <Pressable onPress={() => { vibrateLight(); setDisplayDay(jeudi) }} style={displayDay.getDay() === jeudi.getDay() ? styles.dateTabsSelected : styles.dateTabsNotSelected}><Text style={displayDay.getDay() === jeudi.getDay() ? styles.dateTextTabs : styles.dateTextTabsNotSelected}>13 Juillet</Text></Pressable>
                <Pressable onPress={() => { vibrateLight(); setDisplayDay(vendredi) }} style={displayDay.getDay() === vendredi.getDay() ? styles.dateTabsSelected : styles.dateTabsNotSelected}><Text style={displayDay.getDay() === vendredi.getDay() ? styles.dateTextTabs : styles.dateTextTabsNotSelected}>14 Juillet</Text></Pressable>
                <Pressable onPress={() => { vibrateLight(); setDisplayDay(samedi) }} style={displayDay.getDay() === samedi.getDay() ? styles.dateTabsSelected : styles.dateTabsNotSelected}><Text style={displayDay.getDay() === samedi.getDay() ? styles.dateTextTabs : styles.dateTextTabsNotSelected}>15 Juillet</Text></Pressable>
                <Pressable onPress={() => { vibrateLight(); setDisplayDay(dimanche) }} style={displayDay.getDay() === dimanche.getDay() ? styles.dateTabsSelected : styles.dateTabsNotSelected}><Text style={displayDay.getDay() === dimanche.getDay() ? styles.dateTextTabs : styles.dateTextTabsNotSelected}>16 Juillet</Text></Pressable>
            </View>
            <View style={{ flex: 15, marginTop: 10, backgroundColor: "white" }}>

                <ScrollView >
                    <ChatContext.Consumer>
                        {value => modalChat(value, chatText, setChatText, localText, setLocalText, "Home", username)}

                    </ChatContext.Consumer>
                    {videoHandler(setBoules, boules, videoBoule, require('./assets/boules.mp4'), true)}


                    <SportContext.Consumer>
                        {value =>
                            <View key={value} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                                <View style={{ flex: 1 }}>
                                    {planning["listeevent"].map(r => {
                                        if (r.timeBegin.getDay() == displayDay.getDay()) {
                                            if (displayDay.getDay() == jeudi.getDay()) {
                                                {
                                                    return (
                                                        firstDay(secondsleft, setSecondsleft, navigation, username, all_players, annonce, setAnnonce)
                                                    )
                                                }
                                            }
                                            else {

                                                return (
                                                    eventView(currentEvents, eventsDone, r.eventname, navigation, value.setCurrentSport, 'SportDetails', r.timeBegin));
                                            }
                                        }
                                    })}
                                </View>
                            </View>
                        }
                    </SportContext.Consumer>



                    {/* <View style={{ height: 60 }}></View> */}
                </ScrollView>
            </View>
            <View style={{ backgroundColor: "black", height: 65, flexDirection: "row", borderColor: "black", borderWidth: 1, justifyContent: "space-between" }}>
                <Pressable style={styles.bottomTabs} onPress={() => { vibrateLight(); playcluedo() }}>
                    <Image style={{ tintColor: "white", height: 35, marginBottom: 2 }} resizeMode="contain" source={require('./assets/cluedo.png')} />
                    <Text style={{ color: "white", fontSize: 8, alignSelf: "center" }} >Cluedo</Text>
                </Pressable>
                <Pressable style={styles.bottomTabs} onPress={() => { vibrateLight(); navigation.navigate('ShifumiScreen') }}>
                    <Image style={{ tintColor: "white", height: 35, marginBottom: 2 }} resizeMode="contain" source={require('./assets/shifumi.png')} />
                    {nbShifumiPlayers > 0 ? <View style={{ position: "absolute", height: 30 }}>
                        <Image style={{ position: "absolute", height: 30, left: 20 }} resizeMode="contain" source={require("./assets/dot.png")} />
                        <Text style={{ position: "absolute", color: "white", left: nbShifumiPlayers > 9 ? 36 : 40, top: 3, fontSize: 15 }}>{nbShifumiPlayers}</Text>
                    </View>
                        : null}
                    <Text style={{ color: "white", fontSize: 8, alignSelf: "center" }} >ShiFUmi</Text>
                </Pressable>
                <Pressable style={styles.bottomTabs}
                    onPress={() => { vibrateLight(); navigation.navigate('LoginScreen', { pushtoken: expoPushToken }) }}
                >
                    <Image style={{ tintColor: "white", height: 35, marginBottom: 2 }} resizeMode="contain" source={require('./assets/person.png')} />
                    <Text style={{ color: "white", fontSize: 8, alignSelf: "center" }} >Mon profil</Text>
                </Pressable>
                <Pressable style={styles.bottomTabs}
                    onPress={() => { vibrateLight(); navigation.navigate('CanvaScreen') }}
                >
                    <Image style={{ tintColor: "white", height: 35, marginBottom: 2 }} resizeMode="contain" source={require('./assets/palette.png')} />
                    <Text style={{ color: "white", fontSize: 8, alignSelf: "center" }} >Canva</Text>
                </Pressable>
                <Pressable style={styles.bottomTabs}
                    onPress={() => { vibrateLight(); navigation.navigate('KillerScreen') }}
                >
                    <Image style={{ tintColor: "white", height: 35, marginBottom: 2 }} resizeMode="contain" source={require('./assets/target.png')} />
                    <Text style={{ color: "white", fontSize: 8, alignSelf: "center" }} >Killer</Text>
                </Pressable>

                {adminlist.includes(username) ?
                    <Pressable style={styles.bottomTabs}
                        onPress={() => { vibrateLight(); navigation.navigate('pushNotifScreen') }}
                    >
                        <Image style={{ tintColor: "white", height: 35, marginBottom: 2 }} resizeMode="contain" source={require('./assets/wrench.png')} />
                        <Text style={{ color: "white", fontSize: 8, alignSelf: "center" }} >Outils</Text>
                    </Pressable>

                    : <View></View>}
            </View>
            <StatusBar style="light" />
        </View>

    );
}
