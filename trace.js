// import styles from "./style";
import { useNavigation } from '@react-navigation/native';
import { Platform, Button, View, Dimensions, ActivityIndicator, TextInput, Text, Image, Modal, Pressable } from 'react-native';
import * as React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Svg, Polyline } from 'react-native-svg';
import { Table, Row } from 'react-native-table-component';
import 'react-native-url-polyfill/auto';
import { version } from "./App"
const styles = require("./style.js");

let displayed_state = {
    "Trail": "",
    "Dodgeball": "",
    "Pizza": "",
    "Tong": "",
    "Babyfoot": "",
    "Flechette": "",
    "PingPong": "",
    "Orientation": "",
    "Beerpong": "",
    "Volley": "",
    "Waterpolo": "",
    "Larmina": "",
    "Natation": "",
    "SpikeBall": "",
    "Ventriglisse": "",
    "100mRicard": "",
    "Petanque": "",
    "Molky": ""
};
export const Trace = (props) => {
    const sport = props.sport;
    const username = props.username;
    const width = props.width;
    const height = 170;

    const [autho, setAutho] = React.useState(false);
    const [loading, setloading] = React.useState(true);
    const [matches, setmatches] = React.useState([]);
    const [levels, setlevels] = React.useState([]);
    const [liste, setListe] = React.useState([]);
    const [groups, setGroups] = React.useState([]);
    const [groupmatches, setmatchesgroup] = React.useState([]);
    const navigation = useNavigation();
    React.useEffect(() => {
        fetch_matches(username, setAutho, props.setSportStatus, sport, setmatches, setGroups, setlevels, setmatchesgroup, setListe, props.setWidth, props.setHeight).then(r => {

            props.traceload(false);
            setloading(false)
        }).catch(err => { alert(err); navigation.navigate('Home') });


    }, []);

    if (loading) {
        return (<Modal
            // animationType=""
            transparent={false}
            visible={loading}
            supportedOrientations={['portrait', 'landscape']}
        ><View><ActivityIndicator size="large" color="black" /></View></Modal>);
    }
    if (displayed_state[sport] == "playoff") {
        return (
            <View>
                <Svg style={styles.svg}>
                    {levels.slice(1).reverse().map((r, index) => matches[r].map((m, index2) =>
                        <Polyline key={index * 100 + index2} style={styles.svg}
                            points={(index2 * 2 + 1) * width / (matches[r].length * 2) + "," + ((index * height)) + " " + (index2 * 2 + 1) * width / (matches[r].length * 2) + "," + ((index * height) + (height + (height - 30) / 2)) + " " + ((index2 * 4 + 1) * width / ((matches[r].length) * 4)) + "," + ((index * height) + (height + (height - 30) / 2)) + " " + ((index2 * 4 + 3) * width / ((matches[r].length) * 4)) + "," + ((index * height) + (height + (height - 30) / 2))}
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                        />))}
                </Svg>
                {levels.slice(0).reverse().map(r =>
                    <View key={r}
                        style={{ flexDirection: 'row', alignItems: "stretch", justifyContent: "space-between" }}>
                        <Matchcomp setSportStatus={props.setSportStatus} sportname={sport} setGroups={setGroups} setmatches={setmatches} setlevel={setlevels} setmatchesgroup={setmatchesgroup} setWidth={props.setWidth} setHeight={props.setHeight} setloading={setloading} username={username} loading={loading} matches={matches} level={r} sport={sport} autho={autho}></Matchcomp>
                    </View>)}
            </View>
        );
    }
    else if (displayed_state[sport] == "poules") {

        return (
            <View style={{ flexDirection: "row", flex: 1, position: "absolute", top: 0, left: 0 }}>
                {groups.map((r, index) =>
                    <View key={r.name} style={styles.tablecontainer}>
                        <Text style={{ textAlign: "center" }}>{r.name}</Text>
                        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                            <Row data={["Team", "P", "W", "L", "Points", "Diff"]} widthArr={[180, 35, 35, 35, 60, 50]} style={{ width: "100%", height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ margin: 6, fontSize: 16 }}></Row>
                            {r.teams.sort((a, b) => a.points > b.points ? 1 : (a.points == b.points ? (a.diff > b.diff ? 1 : -1) : -1)).reverse().map(q =>
                                <Row key={q.name} data={[q.name, q.played, q.wins, q.loses, q.points, q.diff]} widthArr={[180, 35, 35, 35, 60, 50]} textStyle={{ margin: 6, fontSize: 16, fontWeight : (q.name.includes(username) ? "bold" : "normal") }}></Row>)}
                        </Table>
                        <View style={{ flexDirection: "column", justifyContent: "space-around" }}>
                            <Matchpoule setSportStatus={props.setSportStatus} key={index} sportname={sport} setGroups={setGroups} setmatches={setmatches} setlevel={setlevels} setmatchesgroup={setmatchesgroup} setWidth={props.setWidth} setHeight={props.setHeight} username={username} setloading={setloading} loading={loading} poule={r.name} matches={groupmatches[index]} level={0} sport={sport} autho={autho}></Matchpoule>
                        </View>
                    </View>)}
            </View>
        )

    }
    else { // Other (list like trail etc.)
        var temp_level_series = liste.map(r => r.level);
        var series_level = [...new Set(temp_level_series)]; // unique levels

        if (!autho) {
            return (
                <View style={{ flexDirection: "row" }}>
                    <View>
                        <Text style={styles.showPlayers}>Athlete</Text>
                        {liste.map(r =>
                            <Text style={r.username.includes(username) ? styles.showPlayersIsIn : styles.showPlayers}>{r.username}</Text>
                        )
                        }
                    </View>
                    <View>
                        <Text style={styles.inputScore}>Score/Temps</Text>
                        {liste.map(r =>
                            <Text style={styles.inputScore}>{r.score}</Text>
                        )
                        }
                    </View>
                    <View>
                        <View style={{ width: 20, height: 30, backgroundColor: "lightgrey" }}></View>
                        {liste.map((r, index) => {
                            if (r.rank == 1) {
                                return (
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={styles.medailleopaque}>
                                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/or.png')} />
                                            {/* <Text>KEKW</Text> */}
                                        </View>
                                    </View>)

                            }
                            else if (r.rank == 2) {
                                return (
                                    <View style={styles.medailleopaque}>
                                        <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/argent.png')} />
                                    </View>)
                            }
                            else if (r.rank == 3) {
                                return (
                                    <View style={styles.medailleopaque}>
                                        <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/bronze.png')} />
                                    </View>
                                )
                            }
                            else {
                                return (
                                    <View style={{ width: 20, height: 30, backgroundColor: "lightgrey" }}></View>
                                )
                            }
                        }
                        )}
                    </View>

                </View>


            )
        }
        else { // authorized so referee!


            return (
                <View>

                    {series_level.map(cur_level =>
                        <View key={cur_level}>
                            <View>
                                <Text style={{ marginLeft: 175, fontSize: 20, fontWeight: "bold" }}>{cur_level == 0 ? "Final" : ("Serie" + cur_level)}</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <View>
                                    <Text style={styles.showPlayers}>Athlete</Text>
                                    {liste.map((r, index) => {
                                        if (cur_level == r.level) {
                                            return (

                                                <View key={r.username}>
                                                    <Text style={r.username.includes(username) ? styles.showPlayersIsIn : styles.showPlayers}>{r.username}</Text>
                                                </View>
                                            )
                                        }
                                    }
                                    )
                                    }
                                </View>
                                <View>
                                    <Text style={styles.inputScore}>Score/Temps</Text>
                                    {liste.map((r, index) => {
                                        if (cur_level == r.level) {
                                            return (
                                                <TextInput key={r.username} onChangeText={(text) => { r.score = text; }} style={styles.inputScore}>{r.score}</TextInput>
                                            )
                                        }
                                    }
                                    )
                                    }
                                </View>
                                <View>
                                    <View style={{ width: 60, height: 30, backgroundColor: "lightgrey" }}>
                                        <Pressable style={{ alignSelf: "center" }} onPress={() => { // Function to save only the results!
                                            setListe([...liste]);
                                            pushmatch(username, sport, liste, "liste", 0);
                                        }
                                        }>
                                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/save.png')}></Image>
                                        </Pressable>

                                    </View>
                                    {liste.map((r, index) => {
                                        if (cur_level == r.level) {
                                            return (


                                                <View key={r.username} style={{ flexDirection: "row" }} >
                                                    <View style={r.rank == 3 ? styles.medailleopaque : styles.medailletransparent}>
                                                        <TouchableOpacity
                                                            onPressIn={() => {
                                                                setloading(true);
                                                                var count = 0;
                                                                for (var i = 0; i < liste.length; ++i) {
                                                                    if (liste[i].rank == 3)
                                                                        count++;
                                                                }
                                                                if (r.rank == 3) {
                                                                    r.rank = 0
                                                                }
                                                                else if (count < 2) {
                                                                    r.rank = 3;
                                                                }
                                                                // uncomment if you want only one medal
                                                                // liste.map((q, index2) => { if (r != q && q.rank == 3) { q.rank = 0 } }); 
                                                                setListe([...liste]);
                                                                setloading(false)
                                                            }}
                                                        >
                                                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/bronze.png')} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={r.rank == 2 ? styles.medailleopaque : styles.medailletransparent}>
                                                        <TouchableOpacity
                                                            onPressIn={() => {
                                                                setloading(true);
                                                                var count = 0;
                                                                for (var i = 0; i < liste.length; ++i) {
                                                                    if (liste[i].rank == 2)
                                                                        count++;
                                                                }
                                                                if (r.rank == 2) {
                                                                    r.rank = 0
                                                                }
                                                                else if (count < 2) {
                                                                    r.rank = 2;
                                                                }
                                                                // uncomment if you want only one medal
                                                                // liste.map((q, index2) => { if (r != q && q.rank == 2) { q.rank = 0 } });
                                                                setListe([...liste]);
                                                                setloading(false)
                                                            }}
                                                        >
                                                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/argent.png')} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={r.rank == 1 ? styles.medailleopaque : styles.medailletransparent}>
                                                        <TouchableOpacity
                                                            onPressIn={() => {
                                                                setloading(true);

                                                                var count = 0;
                                                                for (var i = 0; i < liste.length; ++i) {
                                                                    if (liste[i].rank == 1)
                                                                        count++;
                                                                }
                                                                if (r.rank == 1) {
                                                                    r.rank = 0
                                                                }
                                                                else if (count < 2) {
                                                                    r.rank = 1;
                                                                }
                                                                // uncomment if you want only one medal
                                                                // liste.map((q, index2) => { if (r != q && q.rank == 1) { q.rank = 0 } });
                                                                setListe([...liste]);
                                                                setloading(false)
                                                            }}
                                                        >
                                                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/or.png')} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    }
                                    )}
                                </View>
                            </View>
                        </View>)}
                </View >
            )


        }

    }


}
async function fetch_matches(username, setAutho, setSportStatus, sportname, setmatches, setgroups, setlevel, setmatchesgroup, setListe, setWidth, setHeight) {

    let matches = {};

    let matches_group = {};
    let status = { arbitre: "error", status: "error" }
    while (status['arbitre'] == 'error') {


        status = await fetch("http://91.121.143.104:7070/teams/" + sportname + "_status.json").then(response => response.json()).then(data => {
            if (displayed_state[sportname] == "") {
                // first time we use the one in the server
                displayed_state[sportname] = data['status'];
            }
            else { // seen an issue when going from a sport that have more states than another
                var possibleState = false;
                for (var i in data['states']) {
                    if (displayed_state[sportname] == data['states'][i]) {
                        possibleState = true;
                        break;
                    }
                }
                if (!possibleState) {
                    displayed_state[sportname] = data['status'];
                }
            }
            for (var authouser in data['arbitre']) {
                if (data['arbitre'][authouser] == username) {
                    setAutho(true);
                }
                else if ("Max" == username || "Antoine" == username || "Ugo" == username) {
                    setAutho(true);
                }
            }
            setSportStatus(data);

            return data;
        }).catch(err => { alert(err); setSportStatus({ arbitre: "error", status: "error" }); return { arbitre: "error", status: "error" } });
    }
    let allok = false;
    while (!allok) {


        if (status['status'] == "poules") {
            matches_group = await fetch("http://91.121.143.104:7070/teams/" + sportname + "_poules.json").then(response => response.json()).then(data => { allok=true;return data });
            var i = 0;
            let array_groups = [];
            let array_matches_groups = [];
            let local_array_groupmatch = [];
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
            setgroups(array_groups);
            setmatchesgroup(array_matches_groups);
            // gestion taille fenetre
            setWidth(400 * (array_groups.length + 1));
            setHeight(400 * (array_groups.length + 1) * 4);

        }
        else if (status['status'] == "playoff") {
            matches = await fetch("http://91.121.143.104:7070/teams/" + sportname + "_playoff.json").then(response => response.json()).then(data => { allok=true;return data });

            let level = [];
            let local_array_match = [[]];
            for (let j = 0; j < await matches['levels']; j++) {
                level.push(j);

                local_array_match.push([]); // need to be initiliazed or doesnt work ffs...

            }
            for (const prop in await matches) {
                for (const match_iter in await matches[prop]) {
                    local_array_match[matches[prop][match_iter]["level"]].push(new Match(sportname, matches[prop][match_iter]["team1"], matches[prop][match_iter]["team2"], matches[prop][match_iter]["uniqueId"], matches[prop][match_iter]["score"], matches[prop][match_iter]["over"], matches[prop][match_iter]["level"], "", matches[prop][match_iter]["nextmatch"]));
                }
            }
            setlevel(level);
            // gestion taille fenetre: affichage un peu plus large :)
            if (level.length > 1) {
                setWidth(Math.min(400 * ((level.length - 1) * (level.length - 1)), 3500));
                setHeight(Math.max(200 * (level.length + 1), Dimensions.get("window").height + 100));
            }
            else {
                setWidth(1000);
                setHeight(1000);

            }
            setmatches(local_array_match);
        }
        else if (status['status'] != "error") { // gestion listes (trail/tong)
            let liste = {};
            liste = await fetch("http://91.121.143.104:7070/teams/" + sportname + ".json").then(response => response.json()).then(data => { allok=true;return data });
            let local_liste = [];
            if (liste["Series"].length == 1) { // only final, as before
                liste = liste["Series"][0]["Teams"];
                for (var i in liste) {
                    local_liste.push(new Liste(liste[i]["Players"], liste[i]["score"], liste[i]["rank"], 0));
                }
                setHeight(i * 100);
            }
            else {

                if (displayed_state[sportname] == "final") { // affichage de la finale
                    for (var series in liste["Series"]) {
                        if (liste["Series"][series]["Name"] == "Final") {
                            var templist = liste["Series"][series]["Teams"];
                            for (var i in liste["Series"][series]["Teams"]) {
                                local_liste.push(new Liste(templist[i]["Players"], templist[i]["score"], templist[i]["rank"], 0));
                            }
                        }
                    }
                    setHeight(i * 100);
                }
                else { // consolidation des series avant la finale
                    var level = 1;
                    for (var series in liste["Series"]) {
                        if (liste["Series"][series]["Name"] != "Final") {
                            var templist = liste["Series"][series]["Teams"];
                            for (var i in liste["Series"][series]["Teams"]) {
                                local_liste.push(new Liste(templist[i]["Players"], templist[i]["score"], templist[i]["rank"], level));
                            }
                            level += 1;
                        }
                    }
                    setHeight(i * 100 * level);
                }
            }

            setListe(local_liste);
            setWidth(1000);

        }
    }

}


export function toggle_status(status, setStatus, navigation, sportname) {

    for (var i = 0; i < status.states.length; i++) {
        if (status.states[i] == displayed_state[sportname]) {
            if (i + 1 < status.states.length) {
                displayed_state[sportname] = status.states[i + 1];
            }
            else {
                displayed_state[sportname] = status.states[0];
            }
            status.status = displayed_state[sportname]
            setStatus(status);
            navigation.reset({ routes: [{ name: "Home" }, { name: navigation.dangerouslyGetState().routes[navigation.dangerouslyGetState().index].name, sportname: sportname }] });
            break;
        }
    }
}

export async function fetch_status(sportname, setStatus) {
    let fetch_status = {}


    fetch_status = await fetch("http://91.121.143.104:7070/teams/" + sportname + "_status.json").then(response => response.json()).then(data => {
        if (displayed_state[sportname] == "") {
            // first time we use the one in the server
            displayed_state[sportname] = data['status'];
        }
        else { // seen an issue when going from a sport that have more states than another
            var possibleState = false;
            for (var i in data['states']) {
                if (displayed_state[sportname] == data['states'][i]) {
                    possibleState = true;
                    data["status"] = displayed_state[sportname];
                    break;
                }
            }
            if (!possibleState) {
                displayed_state[sportname] = data['status'];
            }
        }
        setStatus(data);
        return data;
    }).catch(err => { alert(err); return { status: "error", arbitre: "tamere" } });
    return fetch_status;

}

export async function fetch_results() {
    let fetch_results = {}

    fetch_results = await fetch("http://91.121.143.104:7070/results/global.json").then(response => response.json()).then(data => {
        return data;
    }).catch(err => alert(err));
    return fetch_results;
}

export async function fetch_activities(username, setArbitre, setEvents) {
    await fetch("http://91.121.143.104:7070/athletes/" + username + ".json").then(response => response.json()).then(data => {
        setArbitre(data["arbitre"])
        setEvents(data["activities"])
        return;
    }).catch(err => alert(err));
    return;
}

// export async function fetchSummary(sport) {
//     let fetch_results = {}

//     fetch_results = await fetch("http://91.121.143.104:7070/results/sports/.json").then(response => response.json()).then(data => {
//         return data;
//     }).catch(err => alert(err));
//     return fetch_results;
// }
function updateMatchArray(curMatch, matchArray, setMatchArray) {
    for (var i in matchArray) {
        if (curMatch.uniqueId == matchArray[i].uniqueId) {
            matchArray[i] = curMatch;
        }
    }
    setMatchArray([...matchArray]);
}
export function GetState(sportname, status, setStatus, navigation) {

    const [loaded, setloaded] = React.useState(0);
    const [local_status, setLocalStatus] = React.useState("");
    var top
    var left
    React.useEffect(() => {
        // fetch_status(sportname, setStatus).then(r => { if(r['status'] == "error"){navigation.Back()};setLocalStatus(r['status']); setloaded(1) });
    }, []);
    if (Platform.OS === "ios") {

        if (local_status == "final") {
            left = 120
        }
        else {
            left = 120
        }
        top = 40
    }
    else {
        left = 120
        top = 10
    }

    if (loaded == 0) {
        return <View><ActivityIndicator color="000000" /></View>;
    }
    else {
        return <View><TouchableOpacity onPressIn={() => toggle_status(status, setStatus, navigation, sportname)}><Text style={{ marginTop: top, marginLeft: left, color: "white" }}>{local_status}</Text></TouchableOpacity></View>;
    }
}
function crement_score_team(teamnumber, curMatch, matchArray, setMatchArray, incrementorDecrement) { // 0 to increment, 1 to decrement
    let scoreteam1 = Number(curMatch.score.split(":")[0]);
    let scoreteam2 = Number(curMatch.score.split(":")[1]);
    if (teamnumber == 1) {
        if (incrementorDecrement == 0) {

            scoreteam1 += 1;
        }
        else if (scoreteam1 > 0) {
            scoreteam1 -= 1;
        }
    }
    else {
        if (incrementorDecrement == 0) {

            scoreteam2 += 1;
        }
        else if (scoreteam2 > 0) {
            scoreteam2 -= 1;
        }
    }
    let finalscore = scoreteam1 + ":" + scoreteam2;
    for (let i in matchArray) {
        if (matchArray[i].uniqueId == curMatch.uniqueId) {
            matchArray[i].score = finalscore;
        }
    }
    setMatchArray([...matchArray]);

}
function matchDetail(r, autho, setInitScore, setCurrMatchZoom, setMatchZoom, type, username, index) {
    return (

        <View key={index} style={r.over == 0 ? (type == "playoff" ? styles.match : styles.matchpoule) : (type == "playoff" ? styles.matchover : styles.matchpouleover)}>
            <Text style={r.over == 2 ? styles.lose : (r.over == 0 ? (r.team1.includes(username) ? styles.teamUserIsIn : styles.teamnormal) : styles.teamnormal)}>{r.team1}</Text>
            <Text style={styles.score}>{r.team1 == "" ? "" : r.score}</Text>
            <View><Text style={r.over == 1 ? styles.lose : (r.over == 0 ? (r.team2.includes(username) ? styles.teamUserIsIn : styles.teamnormal) : styles.teamnormal)}>{r.team2}</Text></View>
            {(r.team1 != "" && r.team2 != "" && autho) ?
                <Pressable onPress={() => { setInitScore(r.score); setCurrMatchZoom(r); setMatchZoom(true) }}>
                    <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/editlogo.png')} />
                </Pressable> : <View />
            }

        </View>)

}
function modalZoomMatch(setSportStatus, username, sport, curMatchZoom, setCurrMatchZoom, match_array, set_match_array, matchZoom, setMatchZoom, setFetching, props, type, initScore) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={matchZoom}
            supportedOrientations={['portrait', 'landscape']}
        >
            <View style={styles.matchZoomView}>
                <Pressable style={styles.closeButton} onPressIn={() => { curMatchZoom.score = initScore; updateMatchArray(curMatchZoom, match_array, set_match_array); setMatchZoom(false) }}><Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/close-button.png')} /></Pressable>
                <View style={{ flexDirection: "column", flex: 1, justifyContent: "space-evenly" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: 200, justifyContent: "center" }}><Text style={{ textAlignVertical: "center" }}>{curMatchZoom.team1}</Text></View>
                        <View style={{ marginLeft: 30, justifyContent: "center" }}>
                            <Pressable onPressIn={() => { crement_score_team(1, curMatchZoom, match_array, set_match_array, 0) }}><Image resizeMode="cover" resizeMethod="resize" source={require('./assets/plus.png')} /></Pressable>
                            <Text style={{ textAlign: "center" }}>{curMatchZoom.score == undefined ? "0" : curMatchZoom.score.split(":")[0]}</Text>
                            <Pressable onPressIn={() => { crement_score_team(1, curMatchZoom, match_array, set_match_array, 1) }}><Image resizeMode="cover" resizeMethod="resize" source={require('./assets/moins.png')} /></Pressable>
                        </View>
                    </View>
                    <View><Text style={{ textAlign: "center" }}>VS</Text></View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: 200, justifyContent: "center" }}><Text style={{ textAlignVertical: "center" }}>{curMatchZoom.team2}</Text></View>
                        <View style={{ marginLeft: 30, justifyContent: "center" }}>
                            <Pressable onPressIn={() => { crement_score_team(2, curMatchZoom, match_array, set_match_array, 0) }}><Image resizeMode="cover" resizeMethod="resize" source={require('./assets/plus.png')} /></Pressable>
                            <Text style={{ textAlign: "center" }}>{curMatchZoom.score == undefined ? "0" : curMatchZoom.score.split(":")[1]}</Text>
                            <Pressable onPressIn={() => { crement_score_team(2, curMatchZoom, match_array, set_match_array, 1) }}><Image resizeMode="cover" resizeMethod="resize" source={require('./assets/moins.png')} /></Pressable>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Pressable style={{ alignSelf: "center" }} onPress={() => {
                            setFetching(true);
                            props.setloading(true);
                            setCurrMatchZoom(determine_winner(curMatchZoom, type));
                            updateMatchArray(curMatchZoom, match_array, set_match_array);
                            pushmatch(username, sport, curMatchZoom, type, curMatchZoom.uniqueId);
                            fetch_matches(username, setAutho, setSportStatus, props.sport, props.setmatches, props.setGroups, props.setlevel, props.setmatchesgroup, null, props.setWidth, props.setHeight).then(r => {
                                setFetching(false);
                                props.setloading(false);
                            })
                            setMatchZoom(false);
                        }}>
                            <View>{over_text(match_array, match_array.indexOf(curMatchZoom))}</View>
                        </Pressable>
                        <Pressable onPress={() => { // Function to save only the results!
                            setFetching(true);
                            updateMatchArray(curMatchZoom, match_array, set_match_array);
                            pushmatch(username, sport, curMatchZoom, type, curMatchZoom.uniqueId)
                            setFetching(false);
                            setMatchZoom(false);
                            alert("Saved to server!"); // TODO : transform to modal
                        }
                        }>
                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/save.png')}></Image>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>

    );
}
const Matchcomp = (props) => {
    const matches = props.matches;
    const level = props.level;
    const autho = props.autho;
    const sport = props.sport;
    const username = props.username;
    const [matchZoom, setMatchZoom] = React.useState(false);
    const [local_fetch, setFetching] = React.useState(true)
    const type = "playoff"
    const [match_array, set_match_array] = React.useState([]);
    const [curMatchZoom, setCurrMatchZoom] = React.useState({});
    const temp_array = [];
    const [initScore, setInitScore] = React.useState("");
    for (var i = 0; i < matches.length; i++) {
        for (var match in matches[i]) {
            if (matches[i][match]['level'] == level) {
                temp_array.push(matches[i][match]);
            }
        }
    }

    React.useEffect(() => {
        setFetching(false);
        set_match_array(temp_array);
    }, []);
    if (local_fetch) {
        return (<Modal
            // animationType=""
            transparent={false}
            visible={local_fetch}
            supportedOrientations={['portrait', 'landscape']}
        ><View ><ActivityIndicator size="large" color="black" /></View></Modal>);
    }

    return (
        <View style={styles.line}>
            {modalZoomMatch(props.setSportStatus, username, sport, curMatchZoom, setCurrMatchZoom, match_array, set_match_array, matchZoom, setMatchZoom, setFetching, props, type, initScore)}
            {match_array.map((r, index) => matchDetail(r, autho, setInitScore, setCurrMatchZoom, setMatchZoom, type, username, index))}
        </View>
    );

}
function pushmatch(username, sport, match, type, uniqueId) {

    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // // push to server
    fetch("http://91.121.143.104:7070/pushmatch", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "sport": sport, "username": username, "type": type, "match": match, uniqueId: uniqueId }) }).then(r => {
        if (r.status == 200) {
            alert("Saved to server!")
        }
        else {
            alert("Wrong login or password!");
        }

    }).catch((err) => { alert("Issue with server!") });
}
function determine_winner(curMatch, type) {

    if (curMatch.over != 0) {
        curMatch.over = 0;
        return curMatch;
    }
    let scores = curMatch.score.split(":");
    if (scores.length == 2) {
        if (parseInt(scores[0]) > parseInt(scores[1])) {
            curMatch.over = 1;
        }
        else if (parseInt(scores[0]) < parseInt(scores[1])) {
            curMatch.over = 2;
        }
        else {
            alert("Either a tie, or not parsable. Score should be x:x");
        }
    }
    else {
        alert("Either a tie, or not parsable. Score should be x:x");
    }

    return curMatch;

}
const Matchpoule = (props) => {
    const matches = props.matches;
    const level = props.level;
    const autho = props.autho;
    const username = props.username;
    const sport = props.sport;
    const poulename = props.poule;
    const [local_fetch, setFetching] = React.useState(true)
    const [match, setMatch] = React.useState([]);
    const [curMatchZoom, setCurrMatchZoom] = React.useState({});
    const [matchZoom, setMatchZoom] = React.useState(false);
    const [initScore, setInitScore] = React.useState("");
    const type = "poules";
    let match_array = [];
    let array_score = [];
    for (var i = 0; i < matches.length; i++) {
        if (matches[i]['level'] == level && matches[i]['poulename'] == poulename) {

            match_array.push(matches[i]);
            array_score.push(matches[i].score);
        }
    }
    React.useEffect(() => {
        setFetching(false);
        setMatch(match_array);
    }, []);
    if (local_fetch) {

        return (<View><ActivityIndicator size="large" color="#000000" style={styles.fetching} /></View>)
    }

    return (
        <View style={styles.column}>
            {modalZoomMatch(props.setSportStatus, username, sport, curMatchZoom, setCurrMatchZoom, match, setMatch, matchZoom, setMatchZoom, setFetching, props, type, initScore)}
            {match.map((r, index) =>
                matchDetail(r, autho, setInitScore, setCurrMatchZoom, setMatchZoom, type, username, index)
            )}
        </View>
    );

}


function over_text(match, index) {
    if (index == -1) {
        return (
            <View></View>
        )
    }
    if (match[index].over != 0) {
        return (
            <Image style={{ borderRadius: 5, borderWidth: 2, borderColor: "black", width: 24, height: 26, alignSelf: "center" }} source={require('./assets/goback.png')} />
        )
    }
    return (
        <Image style={{ borderRadius: 5, borderWidth: 2, borderColor: "black", width: 24, height: 26 }} source={require('./assets/finish.png')} />

    )

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
