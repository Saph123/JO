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
import * as Haptics from 'expo-haptics';
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

export function fetchAnnonce(setAnnonce) {
    fetch("https://jo.pierrickperso.ddnsfree.com/annonce").then(response => response.text()).then(r => {
        setAnnonce(r)
    }).catch(err => console.error("fetch annonce err", err));
}

export function pushAnnonce(annonce) {
    fetch("https://jo.pierrickperso.ddnsfree.com/annonce", { method: "POST", body: annonce }).then(res => {
        if (res.status == 200) {
        }
        else {
            alert("Couldn't update annonce!");
        }
    }).catch(err => console.log(err, "err push annonce"));
}


export function firstDay(secondsleft, setSecondsleft, navigation, username, all_players, annonce, setAnnonce) {
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
                <Text style={{ textAlign: "center", fontSize: 18 }}>1605 Chemin des Pierres, 38440 Meyssiez, France</Text>
                {adminlist.includes(username) ? <TextInput multiline={true} style={{ textAlign: "center" }} onChangeText={text => { setAnnonce(text) }} onEndEditing={() => { pushAnnonce(annonce) }}  >{annonce}</TextInput> : <Text style={{ textAlign: "center" }}> {annonce}</Text>}
            </View>
            <View style={{ marginBottom: 10, marginTop: 50 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Athlètes présents cette année:</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
                {
                    all_players.map((sublist, index) => (
                        <View key={index} style={{ flex: 1, flexDirection: "column" }}>
                            {
                                sublist.map((person) => (
                                    <Pressable key={person.name} onPress={() => {
                                        if (username != person.name) {
                                            navigation.navigate("PokeScreen", { username: username, other_user: person.name })
                                        }
                                    }}>
                                        {
                                            personView(person.name, true, person.poke)
                                        }
                                    </Pressable>
                                )
                                )}
                        </View>
                    ))
                }
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
        token = (await Notifications.getExpoPushTokenAsync({ projectId: "da62a0e3-7efc-4944-9e8b-b411e0fbfcdb" })).data;

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
export async function fetch_matches(username, setAutho, setStatus, sportname, setmatches, setgroups, setlevel, setmatchesgroup, setListe, setFinal, setRealListe, setSeriesLevel, setModifListe, setBetListe, setLock, setAuthoVote, setVoteListe) {


    let allok = false
    while (!allok) {
        allok = await fetch("https://jo.pierrickperso.ddnsfree.com/teams/" + sportname + "_status.json").then(response => response.json()).then(data => {
            for (var authouser in data['arbitre']) {
                if (data['arbitre'][authouser] == "All") {
                    setAutho(true);
                }
                else if (data['arbitre'][authouser] == username) {
                    if (!data["locked"]) {
                        setAutho(true);
                    }
                }
                setLock(data["locked"]);

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
                fetch("https://jo.pierrickperso.ddnsfree.com/teams/" + sportname + "_poules.json").then(response => response.json()).then(data => {

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
                }).catch((err => { console.error("oui", err); allok = false }));
            }
            if (status['states'].includes("playoff")) {
                fetch("https://jo.pierrickperso.ddnsfree.com/teams/" + sportname + "_playoff.json").then(response => response.json()).then(data => {

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
                fetch("https://jo.pierrickperso.ddnsfree.com/teams/" + sportname + "_series.json").then(response => response.json()).then(data => {
                    liste = data;
                    let local_liste = [];
                    let local_final = [];
                    var levellist = 1;
                    var score = 0;
                    rank = 0;
                    for (var series in liste["Series"]) {
                        if (liste["Series"][series]["Name"] == "Final") {
                            var templist = liste["Series"][series]["Teams"];
                            for (var i in liste["Series"][series]["Teams"]) {
                                if (sportname == "Pizza") {
                                    rank = templist[i]["score"].includes(username) ? 1 : templist[i]["Players"].includes(username) ? -1 : 0;
                                    score = templist[i]["score"].length;
                                }
                                else {
                                    rank = templist[i]["rank"];
                                    score = templist[i]["score"];
                                }
                                local_final.push(new Liste(templist[i]["Players"], score, rank, 0));
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
            if (status['states'].includes("votes")) { // gestion listes (trail/tong)
                if (data["can_vote"].includes(username) || data["can_vote"].includes("all")) {
                    setAuthoVote(true)
                }
                let liste = {};
                fetch("https://jo.pierrickperso.ddnsfree.com/teams/" + sportname + "_votes.json").then(response => response.json()).then(data => {
                    liste = data;
                    let local_final = [];
                    var score = 0;
                    rank = 0;
                    var templist = liste["Teams"]
                    for (var i in liste["Teams"]) {
                        rank = templist[i]["votes"].includes(username) ? 1 : templist[i]["Players"].includes(username) ? -1 : 0;
                        score = templist[i]["votes"].length;
                        local_final.push(new Liste(templist[i]["Players"], score, rank, 0));
                    }
                    setVoteListe(local_final)
                    setSeriesLevel([0])
                    allok = true;
                }).catch(err => { console.log(err, "err in list"); allok = false; });

            }
            return allok;
        }).catch(err => { console.log("ici", err); setStatus({ status: "error", states: ["error"], arbitre: "error", rules: "error" }); return false; });
    }
}

export function chatView(text, setChatText, localText, setLocalText, sportname, username, canBeClosed, value = null) {
    function setNewMessageMock(value) {
        return
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ height: "100%" }}
        >
            <View style={{ flex: 1 }}>
                <View style={{ flex: 6, flexDirection: 'row', backgroundColor: "white" }}>
                    <View style={{ flex: 5 }}>
                        <ScrollView nestedScrollEnabled={true} style={{ flex: 4 }} ref={ref => { this.scrollView = ref }} onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}>

                            <View style={{ flex: 10, flexDirection: "column" }}>
                                {text.split("\n").map((r, index) => {
                                    if (index == 0) {
                                        return
                                    }
                                    var date = r.split("- ")[0]
                                    var who = r.replace(date + '-  ', "").split(" : ")[0]
                                    var what = r.replace(date + '-  ' + who + " : ", "")
                                    date = date.replace(",", "")
                                    return (
                                        <View key={r + index} style={{ flex: 1, flexDirection: "row" }}>
                                            <View style={{ borderWidth: 1, borderRadius: 4, flex: 1, flexDirection: "column", margin: 2 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text>{date}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 6 }}>
                                                <View key={index} style={
                                                    { borderRadius: 10, marginTop: 5, padding: 3, alignSelf: who == username ? "flex-end" : "flex-start", backgroundColor: who == username ? "#186edb" : "lightblue" }}>
                                                    {who == username ? <Text style={{ color: "white" }}>{what}</Text> :
                                                        <View><Text style={{ fontSize: 10, color: "purple" }}>{who}</Text>
                                                            <Text>{what}</Text></View>}

                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </ScrollView>
                    </View>
                    {canBeClosed ?
                        <Pressable style={{ flex: 1, marginTop: 30, marginLeft: 20 }} onPress={() => value.setChat(false)}>
                            <Image style={{ width: 28, height: 23 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/remove.png')} />
                        </Pressable> : null
                    }
                </View>
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <TextInput onSubmitEditing={() => {
                        pushChat(sportname, localText, username);
                        setTimeout(() => {

                            fetchChat(sportname, setChatText, setNewMessageMock)
                        }, 200);
                        setLocalText("");
                    }} style={{ borderWidth: 1, flex: 1, borderRadius: 8, minHeight: 50 }} value={localText} onChangeText={(txt) => setLocalText(txt)} />
                    <Pressable onPress={() => {
                        pushChat(sportname, localText, username);
                        setTimeout(() => {

                            fetchChat(sportname, setChatText, setNewMessageMock)
                        }, 200);
                        setLocalText("");
                    }}>
                        <Image style={{ width: 50, height: 50 }} source={require('./assets/sendmessage.png')} />
                    </Pressable>

                </View>
            </View>
        </KeyboardAvoidingView>)
}

export function modalChat(value, text, setChatText, localText, setLocalText, sportname, username) {
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={value.chat}
            onRequestClose={() => { value.setChat(false) }}
            onShow={() => { value.setNewMessage(false); initialLineNumber[sportname] = countLines(text); save("initialLineNumber", JSON.stringify(initialLineNumber)); }}
        >
            {chatView(text, setChatText, localText, setLocalText, sportname, username, true, value)}

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
    let now = new Date()
    let planning = new Planning()
    if (!summary) {
        return (

            <View key={sportname} style={{ flex: 1, margin: -1, flexDirection: "row", borderColor: "black", borderWidth: 2, borderTopWidth: 0 }}>
                <View style={{ alignSelf: "center", width: 70, height: "100%", flexDirection: "column", justifyContent: "center", borderRightWidth: 2, borderRightColor: "black" }}><Text style={{ textAlign: "center", fontWeight: "bold" }}>{timeBegin.getHours() + "H" + timeBegin.getMinutes().toString().padStart(2, "0")}</Text></View>
                <Pressable delayLongPress={5000} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1 }, currentEvents.includes(sportname) ? styles.inProgress : (eventsDone.includes(sportname) ? styles.eventDone : styles.homebuttons)]}
                    onPress={() => { vibrateLight(); sportlist().includes(sportname) ? setCurrentSport(sportname) : "", sportlist().includes(sportname) ? navigation.navigate(navigateTo, { sportname: sportname }) : now > planning["listeevent"][planning["listeevent"].length - 1].timeBegin ? navigation.navigate("SummaryScreen") : "" }}
                >
                    <Image style={[styles.sportimage, { tintColor: "black" }]} resizeMode="contain" resizeMethod="auto" source={lutImg(sportname)} />
                </Pressable>
                <View style={{ flexDirection: "column", justifyContent: "center", alignSelf: "center", marginLeft: 50 }}><Text>{sportname}</Text></View>
            </View>
        )
    }
    else {
        return (
            <View key={sportname} style={{ flex: 1, margin: -1, flexDirection: "row", borderColor: "black", borderWidth: 2, borderTopWidth: 0, justifyContent: "flex-start", maxHeight: 80 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Pressable delayLongPress={5000} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1 }, currentEvents.includes(sportname) ? styles.inProgress : (eventsDone.includes(sportname) ? styles.eventDone : styles.homebuttons)]}
                        onPress={() => { sportlist().includes(sportname) ? setCurrentSport(sportname) : "", sportlist().includes(sportname) ? navigation.navigate(navigateTo, { sportname: sportname }) : "" }}
                    >
                        <Image style={[styles.sportimage, { tintColor: "black" }]} resizeMode="contain" resizeMethod="auto" source={lutImg(sportname)} />
                    </Pressable>
                </View>
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignSelf: "center" }}><Text>{sportname}</Text></View>
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
        Corde: require('./assets/sports/corde.png'),
        Slackline: require('./assets/sports/slackline.png'),
        Blindtest: require('./assets/sports/blindtest.png'),
        Krossfit: require('./assets/sports/kro2.png'),
        Larmina: require('./assets/sports/polish.png'),
        Natation: require('./assets/sports/natationsynchro.png'),
        SpikeBall: require('./assets/sports/spikeball.png'),
        Ventriglisse: require('./assets/sports/ventriglisse.png'),
        "100mRicard": require('./assets/sports/100mricard.png'),
        Petanque: require('./assets/sports/petanque.png'),
        Molky: require('./assets/sports/molkky.png'),
        Crepes: require('./assets/sports/bretagne.png'),
        Fairplay: require('./assets/sports/fairplay.png'),
        Surprise: require('./assets/point_inter.png'),
        "Cache-cache": require('./assets/sports/cachecache.png'),
        paris: require('./assets/paris.png'),
        paris_locked: require('./assets/paris.png'),
        poules: require('./assets/poules.png'),
        playoff: require('./assets/playoff.png'),
        modif: require('./assets/editlogo2.png'),
        final: require('./assets/liste.png'),
        series: require('./assets/liste.png'),
        results: require('./assets/podium.png'),
        "Remise des prix": require('./assets/podium.png'),
        "Rangement": require('./assets/sweep.png'),
        "résumé": require('./assets/memo.png'),
        "kills": require('./assets/memo.png'),
        "people": require('./assets/group.png'),
        "en cours": require('./assets/target.png'),
        "waiting": require('./assets/wait.png'),
        "votes": require('./assets/vote.png'),
    };
    return lut[imgname];
}

export function sportlist() {
    return [
        "Trail",
        "Dodgeball",
        "PingPong",
        "Pizza",
        "Volley",
        "SpikeBall",
        "Krossfit",
        "Corde",
        "Orientation",
        "Beerpong",
        "Surprise",
        "Waterpolo",
        "Larmina",
        "Blindtest",
        "Tong",
        "Babyfoot",
        "Flechette",
        "Slackline",
        "Ventriglisse",
        "100mRicard",
        "Petanque",
        "Rangement",
        "Fairplay",
        "Home"
    ]
}

export function fetchChat(sportname, setChatText, setNewMessage) {
    fetch("https://jo.pierrickperso.ddnsfree.com/Chatalere/" + sportname + ".txt").then(response => response.text()).then(r => {
        if (initialLineNumber[sportname] != countLines(r) && countLines(r) > 1) {
            setNewMessage(true);
        }
        setChatText(r);
    }).catch(err => console.error("chatalerr", err));

}

export async function fetchKiller(username, setKills, setAlive, setMission, setTarget, setTab, setMissionAsRef, setMotivText, setPlayers, setGameOver, setChatText, setNewMessage, setLifetime, setNbMissions) {
    let start = fetch("https://jo.pierrickperso.ddnsfree.com/killer/" + username).then(response => {
        if (response.ok) {
            return response.json()
        }
        return "Error"
    }).then(data => {
        if (data == "Error") {
            return 0
        }
        if (data["over"]) {
            setTab({ states: ["results", "people"], status: "results" })
            let players = { left: [], middle: [], right: [], everyone: [] }
            for (let index = 0; index < data["participants"].length; index++) {
                let player = data["participants"][index]
                if (index % 3 == 0) {
                    players["left"].push({ name: player["name"], mission: player["how_to_kill"], alive: player["is_alive"], kills: player["kills"], death: player["is_alive"] == false ? player["death"] : "", nbr_of_kills: player["kills"].length })
                }
                else if (index % 3 == 1) {
                    players["middle"].push({ name: player["name"], mission: player["how_to_kill"], alive: player["is_alive"], kills: player["kills"], death: player["is_alive"] == false ? player["death"] : "", nbr_of_kills: player["kills"].length })
                }
                else if (index % 3 == 2) {
                    players["right"].push({ name: player["name"], mission: player["how_to_kill"], alive: player["is_alive"], kills: player["kills"], death: player["is_alive"] == false ? player["death"] : "", nbr_of_kills: player["kills"].length })
                }
                players["everyone"].push({ name: player["name"], rank: player["rank"], nbr_of_kills: player["kills"].length, kills_rank: player["kills_rank"] })
            }
            setPlayers(players)
            setGameOver(true)
        }
        else if (!data["is_arbitre"]) {
            setKills(data["kills"])
            setAlive(data["is_alive"])
            if (data["is_alive"]) {
                if (data["started"]) {
                    setTab({ states: ["en cours", "résumé"], status: "en cours" })
                }
                else {
                    setNbMissions(data["missions"])
                }
                setMission(data["how_to_kill"])
                setTarget(data["target"])
                fetchChat("killer/" + data["target"], setChatText, setNewMessage);

            }
            else {
                setLifetime(data["lifetime"])
                setTab({ states: ["résumé", "en cours"], status: "résumé" })
            }
        }
        else {
            setMissionAsRef(data["missions"])
            let nb_missions = data["missions"].length
            for (let index = 0; index < data["missions"].length; index++) {
                if (data["missions"][index].title == "") {
                    nb_missions--;
                }
            }
            setMotivText(nb_missions + "/25")
            if (data["started"]) {
                setTab({ states: ["people", "kills"], status: "people" })
                let players = { left: [], middle: [], right: [] }
                for (let index = 0; index < data["participants"].length; index++) {
                    let player = data["participants"][index]
                    if (index % 3 == 0) {
                        players["left"].push({ name: player["name"], mission: player["how_to_kill"], alive: player["is_alive"], death: player["is_alive"] == false ? player["death"] : "" })
                    }
                    else if (index % 3 == 1) {
                        players["middle"].push({ name: player["name"], mission: player["how_to_kill"], alive: player["is_alive"], death: player["is_alive"] == false ? player["death"] : "" })
                    }
                    else if (index % 3 == 2) {
                        players["right"].push({ name: player["name"], mission: player["how_to_kill"], alive: player["is_alive"], death: player["is_alive"] == false ? player["death"] : "" })
                    }
                }
                setPlayers(players)
            }
            else {
                setMotivText(nb_missions + "/25")
                setTab({ states: ["kills"], status: "kills" })
            }
        }
        return data["start_date"]
    }).catch(err => console.error("killer", err));
    return start
}

export function updateMission(missions, username, setRefresh, setShouldSave) {
    fetch("https://jo.pierrickperso.ddnsfree.com/killer/" + username, { method: "POST", body: JSON.stringify({ "version": version, "data": "missions", "missions": missions }) }).then(res => {
        if (res.status == 200) {
            alert("Saved", "Saved to server!", ["Ok"])
            setRefresh(true)
            setShouldSave(false)
        }
        else {
            alert("Wrong login or password!");
        }
    }).catch(err => console.log(err, "in update missions"));

}

export function startKiller(username) {
    fetch("https://jo.pierrickperso.ddnsfree.com/killer/" + username, { method: "POST", body: JSON.stringify({ "version": version, "start_killer": true }) }).then(res => {
        if (res.status == 200) {
        }
        else {
            alert("Couldn't start killer!");
        }
    }).catch(err => console.log(err, "start killer"));

}

export function die(username, setAlive, setRefresh, counterKill = fasle) {
    fetch("https://jo.pierrickperso.ddnsfree.com/killer/" + username, { method: "POST", body: JSON.stringify({ "version": version, "counter_kill": counterKill }) }).then(res => {
        if (res.status == 200) {
            setAlive(false)
            setRefresh(true)
            return;
        }
    }).catch(err => console.log(err, "in die"));

}

export function kill(username, personToKill, giveCredit, counterKill, setFocus) {
    fetch("https://jo.pierrickperso.ddnsfree.com/killer/" + username, { method: "POST", body: JSON.stringify({ "version": version, "data": "kill", "counter_kill": counterKill, "to_kill": { name: personToKill, give_credit: giveCredit } }) }).then(res => {
        if (res.status == 200) {
            setFocus(false);
        }
    }).catch(err => console.log(err, "in kill"));

}

export function endKiller(username, setTab) {
    fetch("https://jo.pierrickperso.ddnsfree.com/killer/" + username, { method: "POST", body: JSON.stringify({ "version": version, "data": "end_killer" }) }).then(res => {
        if (res.status == 200) {
            setTab({ states: ["results"], status: "results" });
        }
    }).catch(err => console.log(err, "in end killer"));

}

export function changeMission(username, person) {
    fetch("https://jo.pierrickperso.ddnsfree.com/killer/" + username, { method: "POST", body: JSON.stringify({ "version": version, "data": "modify_mission", target: { name: person.name, mission: person.mission } }) }).then(res => {
        if (!res.status == 200) {
            alert("Error", "Please try again later")
        }
    }).catch(err => console.log(err, "in end killer"));

}

export function getPokeInfo(username, otherUser) {
    if (username != ""){

        let info = fetch("https://jo.pierrickperso.ddnsfree.com/poke/" + username + "-" + otherUser).then(res => {
            if (res.ok) {
                return res.json()
            }
            return { "can_send": false, "score": 0 }
        }).then(data => {
            return data
        }).catch(err => {console.log(err, "err in poke fetch")})
        return info
    }
}

export function sendPoke(username, otherUser) {
    let ret = fetch("https://jo.pierrickperso.ddnsfree.com/poke/" + username + "-" + otherUser, { method: "POST" }).then(res => {
        if (!res.status == 200) {
            alert("Error", "Please try again later")
        }
    }).catch(err => console.log(err, "in end killer"));
    return ret
}
export async function fetch_teams(sportname) {
    let fetch_teams = {}

    fetch_teams = await fetch("https://jo.pierrickperso.ddnsfree.com/teams/" + sportname + ".json").then(response => response.json()).then(data => {
        let local_liste = { "Teams": [], "Others": [] };
        for (var i in data["Teams"]) {
            local_liste["Teams"].push(new Liste(data["Teams"][i]["Players"], data["Teams"][i]["Players"], 0, 0));
        }
        for (var i in data["Others"]) {
            local_liste["Others"].push(new Liste(data["Others"][i]["Players"], data["Others"][i]["Players"], 0, 0));
        }
        local_liste["Teams"].push(new Liste("", "", 0, 0));
        return local_liste;
    }).catch(err => console.log(err));
    return fetch_teams;
}

export async function fetch_sport_results(sportname, setResults) {
    let lists;
    lists = await fetch("https://jo.pierrickperso.ddnsfree.com/results/sports/" + sportname + "_summary.json").then(response => response.json()).then(data => {
        let results = { "1": {}, "2": {}, "3": {} }
        for (var i in data) {
            results["1"][i] = [];
            results["2"][i] = [];
            results["3"][i] = [];
            for (team in data[i]["Teams"]) {
                results[data[i]["Teams"][team]['rank'].toString()][i].push(data[i]["Teams"][team]["Players"].replace(/\//g, "\n"));
            }
        }
        setResults(results)
        return results;
    }).catch(err => console.log(err));
}

export function pushChat(sportname, text, username) {
    fetch("https://jo.pierrickperso.ddnsfree.com/Chatalere/" + sportname + ".txt", { method: "POST", body: JSON.stringify({ "version": version, "username": username, "text": text }) }).then(res => {
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
    fetch("https://jo.pierrickperso.ddnsfree.com/updateTeams", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "sport": sport, "teams": teams }) }).then(r => {
        if (r.status == 200) {
            alert("Saved", "Saved to server!", ["Ok"])
        }
        else {
            alert("Wrong login or password!");
        }

    }).catch((err) => { alert("Issue with server!") });
}

export function pushbets(username, sport, vote) {

    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // // push to server
    fetch("https://jo.pierrickperso.ddnsfree.com/pushBets", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": username, "sport": sport, "bets": vote }) }).then(r => {
        if (r.status == 200) {
            return true;
        }
        else {
            alert("Wrong login or password!");
        }

    }).catch((err) => { alert("Issue with server!") });
    return;
}

export function pushvote(username, vote, sportname) {

    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // // push to server
    fetch("https://jo.pierrickperso.ddnsfree.com/pushvote", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": username, "vote": vote, "sportname": sportname }) }).then(r => {
        if (r.status == 200) {
            return true;
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
    fetch("https://jo.pierrickperso.ddnsfree.com/pushtoken", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "token": token, "username": username }) }).then(r => {
        return;
    }).catch((err) => { console.log("Maybe it's normal") });
}

export async function pushcluedo() {
    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    // // push to server
    getValueFor("username").then(username =>
        fetch("https://jo.pierrickperso.ddnsfree.com/cluedo", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "cluedo": username }) }).then(r => {


        }).catch((err) => { console.log("Maybe it's normal") })
    );
}

export async function askPushNotif(username, title, body, to) {
    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    // // push to server
    fetch("https://jo.pierrickperso.ddnsfree.com/pushnotif", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": username, "title": title, "body": body, "to": to }) }).then(r => {
        return
    }).catch((err) => { console.log(err, "Maybe it's normal") });
}

export async function fetch_teams_bet(sportname, username) {
    let fetch_teams = {}

    fetch_teams = await fetch("https://jo.pierrickperso.ddnsfree.com/bets/" + sportname + ".json").then(response => response.json()).then(data => {
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
    fetch("https://jo.pierrickperso.ddnsfree.com/locksport", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "sport": sportname, "type": type }) }).then(r => {
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

export function vibrateLight() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function toggleLockBets(sportname) {
    const controller = new AbortController();
    fetch("https://jo.pierrickperso.ddnsfree.com/lockBets", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "sport": sportname }) }).then(r => {
        if (r.status != 200) {
            let msg = "Server reply :" + r.status
            alert(msg);
        }
    }
    ).catch(err => console.error(err))
}


export function personView(name, alive, poke) {
    return (
        <View key={name + alive + poke} style={{ width: 100, height: 170, margin: 10 }}>
            <View style={{ height: 150 }}>
                <Image style={{ height: 150, width: 100, borderRadius: 10 }} source={{ cache: 'force-cache', uri: "https://jo.pierrickperso.ddnsfree.com/photo/" + name }} />
            </View>
            {alive == false ? <Image style={{ position: "absolute", height: 150 }} source={require("./assets/dead2.png")} /> : null}
            {poke ? <Image style={{ position: "absolute", height: 30, resizeMode: "contain", left: 75, top: -10 }} source={require("./assets/dot.png")} /> : null}
            <Text style={{ height: 20, textAlign: "center", fontWeight: "bold" }}>{name}</Text>
        </View>
    )
}

export function draw_sign(sign) {
    if (sign == "Pierre") {
        return (<Image style={{ alignSelf: "center", tintColor: "black", height: 30, width: 30 }} resizeMode="contain" source={require('./assets/fist.png')}></Image>)
    }
    if (sign == "Ciseaux") {
        return (<Image style={{ alignSelf: "center", tintColor: "black", height: 30, width: 30, transform: [{ rotate: '270deg' }] }} resizeMode="contain" source={require('./assets/scissors.png')}></Image>)
    }
    if (sign == "Papier") {
        return (<Image style={{ alignSelf: "center", tintColor: "black", height: 30, width: 30 }} resizeMode="contain" source={require('./assets/paper.png')}></Image>)
    }
}

export function life(username, screen) {
    fetch("https://jo.pierrickperso.ddnsfree.com/life", {
        method: "POST",
        body: JSON.stringify({ "version": version, "username": username, "screen": screen })
    }).catch(err => console.error(err))
}


export function getOnlinePersons(screen = "") {
    let online = fetch("https://jo.pierrickperso.ddnsfree.com/life").then(response => {
        if (response.ok) {
            return response.json()
        }
        let data = { online: [] }
        return data
    }).then(data => {
        if (screen == "") {
            return data.online
        }
        else {
            let online = []
            for (let index = 0; index < data.online.length; index++) {
                if (data.online[index].screen == screen) {
                    online.push(data.online[index])
                }
            }
            return online
        }
    }
    ).catch(err => console.error(err))
    return online
}

