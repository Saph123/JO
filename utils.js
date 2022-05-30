import styles from "./style.js" 
import * as React from 'react';
import { View, Modal, Platform, Pressable, Linking, KeyboardAvoidingView, Image, ScrollView, Text, TextInput } from 'react-native';
import { Video } from 'expo-av';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Planning } from './planning';
import { version, initialLineNumber } from "./App"

export async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return result;
    } else {
        return "";
    }
}

export function manageEvents(setEventsDone, setCurrentEvents) {
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

export async function registerForPushNotificationsAsync() {
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

export function videoHandler(setVideoVisible, videoVisible, video, videoSource, easteregg) {
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
                        onPlaybackStatusUpdate={status => { if (status.durationMillis == status.positionMillis && status.durationMillis) { setVideoVisible(false); if (easteregg) { Linking.openURL('tel:+33 6 84 09 57 16') } } }}

                    />
                </View>
            </Pressable>
        </Modal>
    )
}

export function modalChat(value, text, setChatText, localText, setLocalText, sportname) {
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={value.chat}
            supportedOrientations={['portrait', 'landscape']}
            onRequestClose={() => { value.setChat(false) }}
            onShow={() => { value.setNewMessage(false); initialLineNumber[sportname] = countLines(text); save("initialLineNumber", JSON.stringify(initialLineNumber)); }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 6, flexDirection: 'row' }}>
                        <View style={{ flex: 5 }}>
                            <ScrollView style={{ marginTop: 20 }} ref={ref => { this.scrollView = ref }} onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}>

                                <Text >{text}</Text>
                            </ScrollView>
                        </View>
                        <Pressable style={{ flex: 1, marginTop: 30, marginLeft: 20 }} onPress={() => value.setChat(false)}>
                            <Image style={{ width: 28, height: 23}} resizeMode="cover" resizeMethod="resize" source={require('./assets/close-button.png')} />
                        </Pressable>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <TextInput onSubmitEditing={() => { pushChat(sportname, localText); setChatText(text + "\n" + username + ":" + localText); setLocalText(""); }} style={{ borderWidth: 1, flex: 1 }} value={localText} onChangeText={(txt) => setLocalText(txt)} />
                        <Pressable onPress={() => { pushChat(sportname, localText); setChatText(text + "\n" + username + ":" + localText); setLocalText(""); }}>
                            <Image style={{ width: 50, height: 50 }} source={require('./assets/sendmessage.png')} />
                        </Pressable>

                    </View>
                </View>
            </KeyboardAvoidingView>

        </Modal>

    )

}

export function addth(rank) {
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


export function eventView(currentEvents, eventsDone, sportname, navigation, setCurrentSport, setfun) {

    return (
        <Pressable delayLongPress={5000} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1 }, currentEvents.includes(sportname) ? styles.inProgress : (eventsDone.includes(sportname) ? styles.eventDone : styles.homebuttons)]}
            onPress={() => { setCurrentSport(sportname), navigation.navigate('SportDetails', { sportname: sportname }) }} onLongPress={() => { if (sportname == 'Petanque') { setfun(true) } }}
        >
            <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={lutImg(sportname)} />
        </Pressable>)
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

export function fetchChat(sportname, setChatText, setNewMessage) {
    fetch("http://91.121.143.104:7070/chat/" + sportname + "_chat.txt").then(response => response.text()).then(r => {
        if (initialLineNumber[sportname] != countLines(r) && countLines(r) > 1) {
            setNewMessage(true);
        }
        setChatText(r);
    });

}

function pushChat(sportname, text) {
    fetch("http://91.121.143.104:7070/chat", { method: "POST", body: JSON.stringify({ "version": version, "username": username, "text": text, "sportname": sportname }) }).then(res => {
        if (res.status == 200) {
            initialLineNumber[sportname]++;
            save("initialLineNumber", JSON.stringify(initialLineNumber));
            return;

        }
    }).catch(err => console.log(err, "in push chat"));


}


function countLines(str) {
    return (str.match(/\n/g) || '').length + 1;
}

// var firsttimesoun
export async function pushtoken(token, username) {
    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // // push to server
    fetch("http://91.121.143.104:7070/pushtoken", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "token": token, "username": username }) }).then(r => {
        return;
    }).catch((err) => { console.log("Maybe it's normal") });
}

export async function pushcluedo() {
    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    // // push to server
    fetch("http://91.121.143.104:7070/cluedo", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "cluedo": username }) }).then(r => {


    }).catch((err) => { console.log("Maybe it's normal") });
}

export async function askPushNotif(username, title, body, to) {
    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    // // push to server
    fetch("http://91.121.143.104:7070/pushnotif", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": username, "title": title, "body": body, "to": to }) }).then(r => {
        return
    }).catch((err) => { console.log(err, "Maybe it's normal") });
}
