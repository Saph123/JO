import styles from "./style.js"
import * as React from 'react';
import { View, Modal, Platform, Pressable, Linking, KeyboardAvoidingView, Image, ScrollView, Text, TextInput } from 'react-native';
import { Video } from 'expo-av';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Planning } from './planning';
import { version, initialLineNumber, adminlist } from "./global.js"
import CountDown from 'react-native-countdown-component';

class Liste {
    constructor(username, score, rank = 0, level = 0) {
        this.username = username;
        this.score = score;
        this.rank = rank;
        this.level = level // 0 is final, the rest is series
    }
}
class Group {
    constructor(sport, name, teams, uniqueId, over, matches) {
        this.name = name;
        this.teams = teams;
        this.sport = sport;
        this.uniqueId = uniqueId;
        this.over = over;
        this.matches = matches;
    }
}

class Match {
    constructor(sport, team1, team2, uniqueId, score, over, level, poulename, nextmatch) {
        // this.numberOfPlayer = Number(numberOfPlayer)
        this.team1 = team1;
        this.team2 = team2;
        this.sport = sport;
        this.uniqueId = uniqueId;
        this.score = score;
        this.over = over;
        this.level = level;
        this.poulename = poulename;
        this.nextmatch = nextmatch;
    }
}

export function firstDay(secondsleft, setSecondsleft) {

    return (
        <View key={secondsleft}>
            {secondsleft < 0 ? <View></View> : <View><Text style={{ alignSelf: "center" }}>{"Soirée d'ouverture dans :"}</Text><CountDown
                style={{ color: "black" }}
                digitStyle={{ backgroundColor: "#FF8484" }}
                until={secondsleft}
                onFinish={() => { setSecondsleft(0); setTimeout(() => setSecondsleft(-1), 1000 * 5 * 60 * 60) }}
                size={20}
            /></View>}
            <View key={"details"} style={{ justifyContent: "center" }}>
                <Text style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}> BIENVENUE!</Text>
                <Text style={{ textAlign: "center" }}> What's new?!</Text>
                <Text style={{ textAlign: "center" }}> * Système de paris!</Text>
                <Text style={{ textAlign: "center" }}> * Ta mère</Text>
                <Text style={{ textAlign: "center" }}> * Ta soeur</Text>
            </View>
        </View>
    );
}
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
export async function fetch_matches(username, setAutho, setStatus, sportname, setmatches, setgroups, setlevel, setmatchesgroup, setListe, setFinal, setRealListe, setSeriesLevel, setModifListe, setBetListe) {


    let allok = false
    while (!allok) {
        allok = await fetch("https://applijo.freeddns.org/teams/" + sportname + "_status.json").then(response => response.json()).then(data => {
            for (var authouser in data['arbitre']) {
                if (data['arbitre'][authouser] == "All") {
                    setAutho(true);
                }
                else if (data['arbitre'][authouser] == username) {
                    if (!data['states'].includes("final_locked") && !data['states'].includes("playoff_locked") && !data['states'].includes("poules_locked"))
                    {
                        setAutho(true);
                    }
                }
                for (var state in data['states']) {
                    if (data['states'][state] != "paris_locked")
                    {
                        data['states'][state] = data['states'][state].replace("_locked", "");
                    }
                }
                data["status"] = data["status"].replace("_locked", "");
                if (adminlist.includes(username)) {
                    setAutho(true);
                    if (!data['states'].includes("modif")) {
                        data['states'].push("modif");
                    }
                    fetch_teams(sportname).then(r => {
                        setModifListe(r);
                    }).catch(err => { console.log(err); allok = false });
                }
            }
            fetch_teams_bet(sportname, username).then(r => {
                setBetListe(r);
            }).catch(err => { console.log(err); allok = false });
            setStatus(data);
            let status = data;
            if (status['states'].includes("poules")) {
                fetch("https://applijo.freeddns.org/teams/" + sportname + "_poules.json").then(response => response.json()).then(data => {

                    var i = 0;
                    let array_groups = [];
                    let array_matches_groups = [];
                    let local_array_groupmatch = [];
                    var matches_group = data;
                    for (var groupname in matches_group["groups"]) {
                        let local_group = matches_group["groups"][groupname];
                        array_groups.push(new Group(sportname, local_group.name, local_group.teams, i, false));
                        i++;
                    }
                    for (var groupname in matches_group["groups"]) {
                        let local_group = matches_group["groups"][groupname];
                        for (var match in local_group.matches) {
                            let local_match = local_group.matches[match];
                            local_array_groupmatch.push(new Match(sportname, local_match.team1, local_match.team2, local_match.uniqueId, local_match.score, local_match.over, local_match.level, local_group.name, ""));
                            i++;
                        }
                        array_matches_groups.push(local_array_groupmatch);
                    }
                    setgroups(JSON.parse(JSON.stringify(array_groups)));
                    setmatchesgroup(JSON.parse(JSON.stringify(array_matches_groups)));
                    allok = true;
                }).catch((err => { console.log("oui", err), allok = false }));
            }
            if (status['states'].includes("playoff")) {
                fetch("https://applijo.freeddns.org/teams/" + sportname + "_playoff.json").then(response => response.json()).then(data => {

                    let level = [];
                    let local_array_match = [[]];
                    for (let j = 0; j < data['levels']; j++) {
                        level.push(j);

                        local_array_match.push([]); // need to be initiliazed or doesnt work ffs...

                    }
                    for (const prop in data) {
                        for (const match_iter in data[prop]) {
                            local_array_match[data[prop][match_iter]["level"]].push(new Match(sportname, data[prop][match_iter]["team1"], data[prop][match_iter]["team2"], data[prop][match_iter]["uniqueId"], data[prop][match_iter]["score"], data[prop][match_iter]["over"], data[prop][match_iter]["level"], "", data[prop][match_iter]["nextmatch"]));
                        }
                    }
                    setlevel(JSON.parse(JSON.stringify(level)));
                    setmatches(JSON.parse(JSON.stringify(local_array_match)));
                    allok = true;
                }).catch(err => { console.log(err, "err during playoff retrieval"), allok = false });
            }
            if (status['states'].includes("final")) { // gestion listes (trail/tong)

                let liste = {};
                let filename = (sportname == "Pizza" ? sportname + "/" + username : sportname)
                fetch("https://applijo.freeddns.org/teams/" + filename + "_series.json").then(response => response.json()).then(data => {
                    liste = data;
                    let local_liste = [];
                    let local_final = [];
                    var levellist = 1;
                    for (var series in liste["Series"]) {
                        if (liste["Series"][series]["Name"] == "Final") {
                            var templist = liste["Series"][series]["Teams"];
                            for (var i in liste["Series"][series]["Teams"]) {
                                local_final.push(new Liste(templist[i]["Players"], templist[i]["score"], templist[i]["rank"], 0));
                            }
                            setFinal([...local_final])

                        }
                        else { // consolidation des series avant la finale
                            var templist = liste["Series"][series]["Teams"];
                            for (var i in liste["Series"][series]["Teams"]) {
                                local_liste.push(new Liste(templist[i]["Players"], templist[i]["score"], templist[i]["rank"], levellist));
                            }
                            levellist += 1;
                        }
                        setListe([...local_liste]);
                    }
                    if (status.status == "final") {

                        var temp_level_series = local_final.map(r => r.level);
                        setSeriesLevel([...new Set(temp_level_series)]); // unique levels
                        setRealListe(local_final);
                    }
                    else if (status.status == "series") {
                        var temp_level_series = local_liste.map(r => r.level);
                        setSeriesLevel([...new Set(temp_level_series)]); // unique levels
                        setRealListe(local_liste);
                    }
                    allok = true;
                }).catch(err => { console.log(err, "err in list"); allok = false; });

            }
            return allok;
        }).catch(err => { console.log("ici", err); setStatus({ status: "error", states: ["error"], arbitre: "error", rules: "error" }); return false; });
    }
}


export function modalChat(value, text, setChatText, localText, setLocalText, sportname, username) {
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
                            <Image style={{ width: 28, height: 23 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/close-button.png')} />
                        </Pressable>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <TextInput onSubmitEditing={() => { pushChat(sportname, localText, username); setChatText(text + "\n" + username + ":" + localText); setLocalText(""); }} style={{ borderWidth: 1, flex: 1 }} value={localText} onChangeText={(txt) => setLocalText(txt)} />
                        <Pressable onPress={() => { pushChat(sportname, localText, username); setChatText(text + "\n" + username + ":" + localText); setLocalText(""); }}>
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


export function eventView(currentEvents, eventsDone, sportname, navigation, setCurrentSport, navigateTo, timeBegin, summary = false) {

    if (!summary) {
        return (

            <View key={sportname} style={{ flex: 1, margin: -1, flexDirection: "row", borderColor: "black", borderWidth: 2, borderTopWidth: 0 }}>
                <View style={{ alignSelf: "center", width: 70, height: "100%", flexDirection: "column", justifyContent: "center", borderRightWidth: 2, borderRightColor: "black" }}><Text style={{ textAlign: "center", fontWeight: "bold" }}>{timeBegin.getHours() + "H" + timeBegin.getMinutes().toString().padStart(2, "0")}</Text></View>
                <Pressable delayLongPress={5000} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1 }, currentEvents.includes(sportname) ? styles.inProgress : (eventsDone.includes(sportname) ? styles.eventDone : styles.homebuttons)]}
                    onPress={() => { sportlist().includes(sportname) ? setCurrentSport(sportname) : "", sportlist().includes(sportname) ? navigation.navigate(navigateTo, { sportname: sportname }) : "" }}
                >
                    <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={lutImg(sportname)} />
                </Pressable>
                <View style={{ flexDirection: "column", justifyContent: "center", alignSelf: "center", marginLeft: 50 }}><Text>{sportname}</Text></View>
            </View>
        )
    }
    else {
        return (
            <View key={sportname}  style={{ flex: 1, margin: -1, flexDirection: "row", borderColor: "black", borderWidth: 2, borderTopWidth: 0, justifyContent: "flex-start", maxHeight: 80 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Pressable delayLongPress={5000} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1 }, currentEvents.includes(sportname) ? styles.inProgress : (eventsDone.includes(sportname) ? styles.eventDone : styles.homebuttons)]}
                        onPress={() => { sportlist().includes(sportname) ? setCurrentSport(sportname) : "", sportlist().includes(sportname) ? navigation.navigate(navigateTo, { sportname: sportname }) : "" }}
                    >
                        <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={lutImg(sportname)} />
                    </Pressable>
                </View>
                <View style={{ flex:1, flexDirection: "column", justifyContent: "center", alignSelf:"center" }}><Text>{sportname}</Text></View>
            </View>
        )

    }
}

export function lutImg(imgname) {
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
        paris: require('./assets/paris.png'),
        paris_locked: require('./assets/paris.png'),
        poules: require('./assets/poules.png'),
        playoff: require('./assets/playoff.png'),
        modif: require('./assets/editlogo2.png'),
        final: require('./assets/liste.png'),
        series: require('./assets/liste.png'),
        results: require('./assets/podium.png'),
    };
    return lut[imgname];
}

export function sportlist() {
    return [
        "Trail",
        "Dodgeball",
        "Pizza",
        "Tong",
        "Babyfoot",
        "Flechette",
        "PingPong",
        "Orientation",
        "Beerpong",
        "Volley",
        "Waterpolo",
        "Larmina",
        "Natation",
        "SpikeBall",
        "Ventriglisse",
        "100mRicard",
        "Petanque",
        "Molky",
        "Clicker",
        "Home"
    ]
}
export function fetchChat(sportname, setChatText, setNewMessage) {
    fetch("https://applijo.freeddns.org/Chatalere/" + sportname + ".txt").then(response => response.text()).then(r => {
        if (initialLineNumber[sportname] != countLines(r) && countLines(r) > 1) {
            setNewMessage(true);
        }
        setChatText(r);
    }).catch(err => console.error("chatalerr", err));

}

export async function fetch_teams(sportname) {
    let fetch_teams = {}

    fetch_teams = await fetch("https://applijo.freeddns.org/teams/" + sportname + ".json").then(response => response.json()).then(data => {
        let local_liste = [];
        for (var i in data["Teams"]) {
            local_liste.push(new Liste(data["Teams"][i]["Players"], data["Teams"][i]["Players"], 0, 0));
        }
        local_liste.push(new Liste("", "", 0, 0));
        return local_liste;
    }).catch(err => console.log(err));
    return fetch_teams;
}

export async function fetch_sport_results(sportname, setResults) {
    let lists;
    lists = await fetch("https://applijo.freeddns.org/results/sports/" + sportname + "_summary.json").then(response => response.json()).then(data => {
        let results = {"1":{}, "2":{}, "3":{}}
        for (var i in data)
            {
                results["1"][i] = [];
                results["2"][i] = [];
                results["3"][i] = [];
                for(team in data[i]["Teams"])
                {
                    results[data[i]["Teams"][team]['rank'].toString()][i].push(data[i]["Teams"][team]["Players"].replace(/\//g, "\n"));
                }
            }
            setResults(results)
            return results;
    }).catch(err => console.log(err));
}

function pushChat(sportname, text, username) {
    fetch("https://applijo.freeddns.org/Chatalere/" + sportname + ".txt", { method: "POST", body: JSON.stringify({ "version": version, "username": username, "text": text }) }).then(res => {
        if (res.status == 200) {
            initialLineNumber[sportname]++;
            save("initialLineNumber", JSON.stringify(initialLineNumber));
            return;

        }
    }).catch(err => console.log(err, "in push chat"));


}

export function updateTeams(sport, teams) {

    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // // push to server
    fetch("https://applijo.freeddns.org/updateTeams", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "sport": sport, "teams": teams }) }).then(r => {
        if (r.status == 200) {
            alert("Saved", "Saved to server!", ["Ok"])
        }
        else {
            alert("Wrong login or password!");
        }

    }).catch((err) => { alert("Issue with server!") });
}

export function pushbets(username, sport, bets) {

    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    var vote = ""

    // // push to server
    for (var i in bets) {
        if (bets[i]['rank'] == 1) {
            vote = bets[i]["username"];
            break;
        }
    }
    fetch("https://applijo.freeddns.org/pushBets", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": username, "sport": sport, "bets": vote }) }).then(r => {
        if (r.status == 200) {
            alert("Saved", "Saved to server!", ["Ok"])
        }
        else {
            alert("Wrong login or password!");
        }

    }).catch((err) => { alert("Issue with server!") });
    return;
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
    fetch("https://applijo.freeddns.org/pushtoken", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "token": token, "username": username }) }).then(r => {
        return;
    }).catch((err) => { console.log("Maybe it's normal") });
}

export async function pushcluedo() {
    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    // // push to server
    getValueFor("username").then( username =>
    fetch("https://applijo.freeddns.org/cluedo", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "cluedo": username }) }).then(r => {


    }).catch((err) => { console.log("Maybe it's normal") })
    );
}

export async function askPushNotif(username, title, body, to) {
    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    // // push to server
    fetch("https://applijo.freeddns.org/pushnotif", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": username, "title": title, "body": body, "to": to }) }).then(r => {
        return
    }).catch((err) => { console.log(err, "Maybe it's normal") });
}

export async function fetch_teams_bet(sportname, username) {
    let fetch_teams = {}

    fetch_teams = await fetch("https://applijo.freeddns.org/bets/" + sportname + ".json").then(response => response.json()).then(data => {
        let local_liste = [];
        for (var i in data["Teams"]) {
            local_liste.push(new Liste(data["Teams"][i]["Players"], data["Teams"][i]["TotalVotes"], data["Teams"][i]["Votes"].includes(username) ? 1 : 0, 0));
        }
        return local_liste;
    }).catch(err => console.log(err));
    return fetch_teams;
}

export function lock_unlock(lock, setLock, sportname) {
    const controller = new AbortController();
    let type = "";
    if (lock) {

        type = "unlock";
    }
    else {

        type = "lock";
    }
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    fetch("https://applijo.freeddns.org/locksport", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "sport": sportname, "type": type }) }).then(r => {
        if (r.status == 200) {

            setLock(!lock);
        }
        else {
            let msg = "Server reply :" + r.status
            alert(msg);
        }
    }
    ).catch(err => console.error(err))

}