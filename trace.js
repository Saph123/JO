// import styles from "./style";
import { useNavigation } from '@react-navigation/native';
import { Button, View, Dimensions, ActivityIndicator, TextInput, Text, Image } from 'react-native';
import * as React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Svg, Polyline } from 'react-native-svg';
import { Table, Row } from 'react-native-table-component';
import { username } from './App.js'
const styles = require("./style.js");
let offline = false;
let displayed_state = "";
export const Trace = (props) => {
    const [displayed_state, setDisplayedState] = React.useState("playoff")
    const sport = props.sport;
    const autho = props.autho;
    const username = props.username;
    const [loading, setloading] = React.useState(true);
    const [matches, setmatches] = React.useState([]);
    const [levels, setlevels] = React.useState([]);
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [groups, setGroups] = React.useState([]);
    const [groupmatches, setmatchesgroup] = React.useState([]);
    React.useEffect(() => {
        fetch_matches(sport, setmatches, setGroups, setlevels, setDisplayedState, setmatchesgroup, props.setWidth, props.setHeight).then(r => {
            setloading(false)
        }).catch(err => console.log(err));


    }, []);

    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />);
    }
    if (displayed_state == "playoff") {
        return (
            <View onLayout={(event) => {
                var { x, y, width, height } = event.nativeEvent.layout;
                setWidth(width);
            }} >
                <Svg style={styles.svg}>
                    {levels.slice(1).reverse().map((r, index) => matches[r].map((m, index2) =>
                        <Polyline style={styles.svg}
                            points={(index2 * 2 + 1) * width / (matches[r].length * 2) + "," + ((index * height) + (height - 30)) + " " + (index2 * 2 + 1) * width / (matches[r].length * 2) + "," + ((index * height) + (height + (height - 30) / 2)) + " " + ((index2 * 4 + 1) * width / ((matches[r].length) * 4)) + "," + ((index * height) + (height + (height - 30) / 2)) + " " + ((index2 * 4 + 3) * width / ((matches[r].length) * 4)) + "," + ((index * height) + (height + (height - 30) / 2))}
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                        />))}
                </Svg>
                {levels.slice(0).reverse().map(r =>

                    <View onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout;
                        setHeight(height);
                    }} style={{ flexDirection: 'row', alignItems: "stretch", justifyContent: "space-between" }}>
                        <Matchcomp username={username} loading={loading} matches={matches} level={r} sport={sport} autho={autho}></Matchcomp>
                    </View>)}

            </View>
        );
    }
    return (


        <View style={{ flexDirection: "row", flex: 1, position: "absolute", top: 0, left: 0 }}>
            {groups.map((r, index) =>
                <View style={styles.tablecontainer}>
                    <Text style={{ textAlign: "center" }}>{r.name}</Text>
                    <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                        <Row data={["Team", "P", "W", "L", "Points", "Diff"]} widthArr={[150, 30, 30, 30, 60, 50]} style={{ width: "100%", height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ margin: 6 }}></Row>
                        {r.teams.sort((a, b) => a.points > b.points ? 1 : (a.points == b.points ? (a.diff > b.diff ? 1 : -1) : -1)).reverse().map(q =>
                            <Row data={[q.name, q.played, q.wins, q.loses, q.points, q.diff]} widthArr={[150, 30, 30, 30, 60, 50]} textStyle={{ margin: 6 }}></Row>)}
                    </Table>
                    <View style={{ flexDirection: "column", justifyContent: "space-around" }}>
                        <Matchpoule sportname={sport} setGroups={setGroups} setmatches={setmatches} setlevel={setlevels} setDisplayedState={setDisplayedState} setmatchesgroup={setmatchesgroup} setWidth={setWidth} setHeight={setHeight} username={username} setloading={setloading} loading={loading} poule={r.name} matches={groupmatches[index]} level={0} sport={sport} autho={autho}></Matchpoule>
                    </View>
                </View>)}
        </View>
    )

}
async function fetch_matches(sportname, setmatches, setgroups, setlevel, setDisplayedState, setmatchesgroup, setWidth, setHeight) {

    let matches = {};
    let status = {};
    let matches_group = {};
    if (offline) {
        if (sportname == "Beerpong") {
            matches = beerpong_matches_json;
        }
        else {
            matches = ventriglisse_matches_json;

        }

    }
    else {
        if (displayed_state == "poules") {

            matches_group = await fetch("http://91.121.143.104:7070/teams/" + sportname + "_poules.json").then(response => response.json()).then(data => { return data });
        }
        else {
            matches = await fetch("http://91.121.143.104:7070/teams/" + sportname + "_matches.json").then(response => response.json()).then(data => { return data });

        }
        status = await fetch("http://91.121.143.104:7070/teams/" + sportname + "_status.json").then(response => response.json()).then(data => {
            displayed_state = data['status'];
            return data;
        });
    }
    let level = [];
    let local_array_match = [[]];
    if (displayed_state == "poules") // group phasis:
    {
        setDisplayedState("poules");
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
                local_array_groupmatch.push(new Match(sportname, local_match.team1, local_match.team2, local_match.uniqueId, local_match.score, local_match.over, local_match.level, local_group.name));
                i++;
            }
            array_matches_groups.push(local_array_groupmatch);
        }
        setgroups(array_groups);
        setmatchesgroup(array_matches_groups);
        setWidth(200 * (array_groups.length + 1));
        setHeight(100 * (array_groups.length + 1) * 4);
    }
    else {
        setDisplayedState("playoff");
        for (let j = 0; j < await matches['levels']; j++) {
            level.push(j);
            local_array_match.push([]); // need to be initiliazed or doesnt work ffs...
        }
        for (const prop in await matches) {
            for (const match_iter in await matches[prop]) {
                local_array_match[matches[prop][match_iter]["level"]].push(new Match(sportname, matches[prop][match_iter]["team1"], matches[prop][match_iter]["team2"], matches[prop][match_iter]["match"], matches[prop][match_iter]["score"], matches[prop][match_iter]["over"], matches[prop][match_iter]["level"]));
            }
        }
        setlevel(level);
        setWidth(400 * (level.length + 1));
        setHeight(Math.max(200 * (level.length + 1), Dimensions.get("window").height + 100));
        setmatches(local_array_match);
    }
}


export function toggle_status(status, setStatus, navigation) {

    for (var i = 0; i < status.states.length; i++) {
        if (status.states[i] == displayed_state) {
            if (i + 1 < status.states.length) {
                displayed_state = status.states[i + 1];
            }
            else {
                displayed_state = status.states[0];
            }
            status.status = displayed_state;
            // toggle = 1;
            setStatus(status);
            navigation.navigate(navigation.dangerouslyGetState().routes[navigation.dangerouslyGetState().index].name);
            break;
        }
    }
}

export async function fetch_status(sportname, setStatus) {
    let fetch_status = {}


    fetch_status = await fetch("http://91.121.143.104:7070/teams/" + sportname + "_status.json").then(response => response.json()).then(data => {
        setStatus(data);
        console.log("setstatus tho")
        displayed_state = data['status'];
        return data;
    }).catch(err => console.log(err));
    return fetch_status;
}

export function GetState(sportname, status, setStatus, navigation, state) {

    const [loaded, setloaded] = React.useState(0);


    React.useEffect(() => {
        // const fetch_status = async () => {await fetch("http://91.121.143.104:7070/teams/" + sportname + "_status.json").then(response => response.json()).then(data => {
        //     setStatus(data);
        //     displayed_state = data['status'];
        //     setloaded(1);
        //     });}
        fetch_status(sportname, setStatus).then(r => setloaded(1));
    }, []);

    if (loaded == 0) {
        return <View><ActivityIndicator color="000000" /></View>;
    }
    //toggle_status(status, setStatus, navigation);
    else {
        return <View><TouchableOpacity onPressIn={() => navigation.setOptions({ title: "fdp" })}><Text style={{ marginTop: 10, marginRight: 30, color: "white" }}>{status["status"]}</Text></TouchableOpacity></View>;
    }
}


const Matchcomp = (props) => {
    const matches = props.matches;
    const level = props.level;
    const autho = props.autho;
    const sport = props.sport;
    const username = props.username;
    const [local_load, setLoading] = React.useState(true)
    const [score, setScore] = React.useState([]);
    const match_array = [];
    const array_score = [];
    for (var i = 0; i < matches.length; i++) {
        if (matches[i]['level'] == level) {

            match_array.push(matches[i]);
            array_score.push(matches[i].score);
        }
    }

    React.useEffect(() => {
        setLoading(false);
        setScore(array_score);
    }, []);
    if (local_load) {
        return (<View></View>);
    }

    if (autho) {
        return (
            <View style={styles.line}>
                {match_array.map((r, index) => {
                    return (<View style={r.over == 0 ? styles.match : styles.matchover}>
                        <Text style={r.over == 2 ? styles.lose : styles.teamnormal}>{r.team1}</Text>
                        <Text style={{ fontSize: 24, fontWeight: "bold" }}>{"vs"}</Text><Text style={r.over == 1 ? styles.lose : styles.teamnormal}>{r.team2}</Text><TextInput style={styles.score} value={score[index]} onChangeText={(text) => { array_score[index] = text; setScore(array_score) }} /><Button color='blue' title="Submit" onPress={() => alert("wesh")} />
                    </View>)
                })}
            </View>
        );
    }
    return (
        <View style={styles.line}>
            {match_array.map((r, index) => {
                return (<View style={r.over == 0 ? styles.match : styles.matchover}>
                    <Text style={r.over == 2 ? styles.lose : styles.teamnormal}>{r.team1}</Text>
                    <Text>{"vs"}</Text><Text style={r.over == 1 ? styles.lose : styles.teamnormal}>{r.team2}</Text><Text style={styles.score} >{score[index]}</Text></View>)
            })}
        </View>
    );


}
function pushmatch(username, sport, match) {

    // 5 second timeout:
    console.log(username, sport, match)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    console.log("pushing!")
    // // push to server
    fetch("http://91.121.143.104:7070/pushmatch", { signal: controller.signal, method: "POST", body: JSON.stringify({ "sport": sport, "username": username, "type": "poules", "match": match }) }).then(r => {
    console.log(r)    ;
    if (r.status == 200) {
            console.log("kekw");
        }
        else {
            alert("Wrong login or password!");
        }

    }).catch((err) => { console.log(err, "Issue with server!") });
}

function determine_winner(match, index, setfun, score, setFetching, username, sport) {
    // TODO : add push function to json through raspi
    let tmp_array = JSON.parse(JSON.stringify(match));
    let topush = false;

    if (tmp_array[index].over != 0) {
        tmp_array[index].over = 0;
        setfun(tmp_array);
        tmp_array[index].score = score[index];
        setFetching(true);
        pushmatch(username, sport, tmp_array[index])
        setfun(tmp_array);
        setFetching(false);
        return;
    }
    tmp_array[index].score = score[index];
    let scores = score[index].split(":");
    if (scores.length == 2) {
        if (parseInt(scores[0]) > parseInt(scores[1])) {
            tmp_array[index].over = 1;
            topush = true;
        }
        else if (parseInt(scores[0]) < parseInt(scores[1])) {
            tmp_array[index].over = 2;
            topush = true;
        }
        else {
            alert("Either a tie, or not parsable. Score should be x:x")
        }
    }
    if (topush) {
        setFetching(true);
        pushmatch(username, sport, tmp_array[index])
        setfun(tmp_array);
        setFetching(false);
    }
}
const Matchpoule = (props) => {
    const matches = props.matches;
    const level = props.level;
    const autho = props.autho;
    const username = props.username;
    const sport = props.sport;
    const poulename = props.poule;
    const [local_fetch, setFetching] = React.useState(true)
    const [score, setScore] = React.useState([]);
    const [match, setMatch] = React.useState([])
    const navigation = useNavigation()
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
        setScore(array_score);
        setMatch(match_array);
    }, []);
    if (local_fetch) {

        return (<View><ActivityIndicator size="large" color="#000000" style={styles.fetching} /></View>)
    }
    if (autho && !local_fetch) {
        return (
            <View style={styles.column}>
                {match.map((r, index) => {
                    return (<View style={r.over == 0 ? styles.matchpoule : styles.matchpouleover}>
                        <Text style={r.over == 2 ? styles.lose : styles.teamnormal}>{r.team1}</Text>
                        <Text>{"vs"}</Text><Text style={r.over == 1 ? styles.lose : styles.teamnormal}>{r.team2}</Text>
                        <View style={{ flexDirection: "row" }}>{manage_score_over(match, index, score, setScore, username, sport)}</View>
                        <TouchableOpacity onPress={() => {
                            props.setloading(true); setFetching(true); determine_winner(match, index, setMatch, score, setFetching, username, sport); fetch_matches(props.sport, props.setmatches, props.setGroups, props.setlevels, props.setDisplayedState, props.setmatchesgroup, props.setWidth, props.setHeight).then(r => {
                                props.setloading(false)
                            })
                        }}><Text>{over_text(match, index)}</Text></TouchableOpacity>
                    </View>)
                })}
            </View>
        );
    }


    return (
        <View style={styles.column}>
            {match_array.map((r, index) => {
                return (
                    <View style={r.over == 0 ? styles.matchpoule : styles.matchpouleover}>
                        <Text style={r.over == 2 ? styles.lose : styles.teamnormal}>{r.team1}</Text>
                        <Text>{"vs"}</Text><Text style={r.over == 1 ? styles.lose : styles.teamnormal}>{r.team2}</Text><Text style={styles.score}>{score[index]}</Text>
                    </View>)
            })}
        </View>
    );


}


function over_text(match, index) {
    if (match[index].over != 0) {
        return (
            <Image style={{ borderRadius: 5, borderWidth: 2, borderColor: "black", width: 20, height: 20, alignSelf: "center" }} source={require('./assets/goback.png')} />
        )
    }
    return (
        <Image style={{ borderRadius: 5, borderWidth: 2, borderColor: "black", width: 20, height: 20 }} source={require('./assets/finish.png')} />

    )

}
function manage_score_over(match, index, score, setScore, username, sport) {
    if (match[index].over == 0) {
        return (
            <View style={{ flexDirection: "row" }}>
                <TextInput style={styles.score} value={score[index]} onChangeText={(text) => { let tmp_array_score = JSON.parse(JSON.stringify(score)); tmp_array_score[index] = text; setScore(tmp_array_score) }} />
                <TouchableOpacity onPress={() => { match[index].score = score[index]; pushmatch(username, sport, match[index]) }} ><Image style={{ borderRadius: 5, borderWidth: 2, borderColor: "black", width: 20, height: 20, alignSelf: "center" }} source={require('./assets/validatelogo.png')} /></TouchableOpacity>
            </View>
        )
    }
    return (
        <View>
            <Text style={styles.score} >{score[index]}</Text>
            {/* <TouchableOpacity onPress={() => { pushscore(score[index]) }} ><Image style={{ borderRadius: 5, borderWidth: 2, borderColor: "black", width: 20, height: 20, alignSelf: "center" }} source={require('./assets/validatelogo.png')} /></TouchableOpacity> */}
        </View>
    )
}

class Match {
    constructor(sport, team1, team2, uniqueId, score, over, level, poulename) {
        // this.numberOfPlayer = Number(numberOfPlayer)
        this.team1 = team1
        this.team2 = team2
        this.sport = sport
        this.uniqueId = uniqueId
        this.score = score
        this.over = over
        this.level = level
        this.poulename = poulename
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
