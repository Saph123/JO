import styles from "./style";
import { useNavigation } from '@react-navigation/native';
import { View, ActivityIndicator, ScrollView, TextInput, Text, Image, Modal, Pressable, Alert } from 'react-native';
import * as React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Svg, Polyline } from 'react-native-svg';
import { Table, Row } from 'react-native-table-component';
import 'react-native-url-polyfill/auto';
import { version } from "./App"
import { updateTeams, pushbets } from "./utils";


const MedailleView = (props) => {
    const rank = props.rank;
    const r = props.r;
    const maxMedals = props.maxMedals
    return (
        <View style={r.rank == rank ? styles.medailleopaque : styles.medailletransparent}>
            <TouchableOpacity
                onPress={() => {
                    props.setloading(true);
                    var count = 0;
                    for (var i = 0; i < props.liste.length; ++i) {
                        if (props.liste[i].rank == rank)
                            count++;
                    }
                    if (r.rank == rank) {
                        r.rank = 0
                    }
                    else if (count < maxMedals) {
                        r.rank = rank;
                    }
                    else
                    {
                        for (var i = 0; i < props.liste.length; ++i) {
                            if (props.liste[i].rank == rank)
                            props.liste[i].rank = 0;
                        }
                        r.rank = rank;
                    }
                    // uncomment if you want only one medal
                    // props.liste.map((q, index2) => { if (r != q && q.rank == rank) { q.rank = 0 } }); 
                    props.setRealListe([...props.liste]);
                    props.setloading(false)
                }}
            >
                <Image resizeMode="cover" resizeMethod="resize" source={props.metal} />
            </TouchableOpacity>
        </View>
    )

}
export const Trace = (props) => {
    const sport = props.sport;
    const username = props.username;
    const [loading, setloading] = React.useState(true);
    const navigation = useNavigation();
    React.useEffect(() => {
            setloading(false)


    }, [props.all_teams.status.status]);
    if (loading) {
        return (

            <View><ActivityIndicator size="large" color="black" /></View>);
    }
    if (props.all_teams.status.status == "playoff") {
        return (

            <ScrollView horizontal={true}>

                {props.all_teams.levels.slice(0).map(r =>
                    <View key={r}
                        style={{ flexDirection: 'row', alignItems: "stretch", justifyContent: "space-between" }}>
                        <Matchcomp status={props.all_teams.status} sportname={sport} setGroups={props.all_teams.setGroups} setmatches={props.all_teams.setmatches} setlevel={props.all_teams.setlevels} setmatchesgroup={props.all_teams.setmatchesgroup} setloading={props.all_teams.setloading} username={username} loading={loading} matches={props.all_teams.matches} level={r} sport={sport} autho={props.all_teams.autho}></Matchcomp>
                    </View>)}
            </ScrollView>
        );
    }
    if (props.all_teams.status.status == "poules") {
        return (
            <ScrollView kek={console.log(props.all_teams.groups)} horizontal={true}>
                {props.all_teams.groups.map((r, index) =>
                    <View key={r.name} style={styles.tablecontainer}>
                        <View style={{ flex: 3 }}>
                            <Text style={{ textAlign: "center" }}>{r.name}</Text>
                            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                <Row data={["Team", "P", "W", "L", "Points", "Diff"]} widthArr={[180, 35, 35, 35, 60, 50]} style={{ width: "100%", height: 40, backgroundColor: '#f1f8ff', margin: 6, fontSize: 16 }}></Row>
                                {r.teams.sort((a, b) => a.points > b.points ? 1 : (a.points == b.points ? (a.diff > b.diff ? 1 : -1) : -1)).reverse().map(q =>
                                    <Row key={q.name} data={[q.name, q.played, q.wins, q.loses, q.points, q.diff]} widthArr={[180, 35, 35, 35, 60, 50]} style={{ margin: 6, fontSize: 16, fontWeight: (q.name.includes(username) ? "bold" : "normal") }}></Row>)}
                            </Table>
                        </View>
                        <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-around" }}>
                            <Matchpoule status={props.all_teams.status} key={index} sportname={sport} setGroups={props.all_teams.setGroups} setmatches={props.all_teams.setmatches} setlevel={props.all_teams.setlevels} setmatchesgroup={props.all_teams.setmatchesgroup} username={username} setloading={props.all_teams.setloading} loading={loading} poule={r.name} matches={props.all_teams.groupmatches[index]} level={0} sport={sport} autho={props.all_teams.autho}></Matchpoule>
                        </View>
                    </View>)}
            </ScrollView>
        )

    }
    if (props.all_teams.status.status == "modif")
    {
        return (
            <ScrollView>
                <View style={{ flexDirection: "row" }}>
                    <View>
                        <Text style={[styles.showPlayers, { height: 60 }]}>Équipe/Athlète</Text>
                        {props.all_teams.modifListe.map(r =>
                            <TextInput key={r.username} onChangeText={(text) => { r.username = text; }} style={styles.showPlayers}>{r.username}</TextInput>
                        )
                        }
                    </View>
                    <View style={{ width: 60, height: 60, backgroundColor: "lightgrey", justifyContent:"center" }}>
                        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => { // Function to save only the results!
                            props.all_teams.setModifListe([...props.all_teams.modifListe]);
                            updateTeams(sport, props.all_teams.modifListe);
                        }
                        }>
                            <Image resizeMode="cover" resizeMethod="resize" style={{alignSelf:"center"}} source={require('./assets/save.png')}></Image>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        )
    }
    if (props.all_teams.status.status == "paris")
    {
        return (
            <ScrollView>
                <View style={{ flexDirection: "row" }}>
                    <View>
                        <Text style={[styles.showPlayers, { height: 60 }]}>Équipe/Athlète</Text>
                        {props.all_teams.betListe.map(r =>
                            <Text key={r.username} onChangeText={(text) => { r.username = text; }} style={styles.showPlayers}>{r.username}</Text>
                        )
                        }
                    </View>
                        <View>
                            <Text style={[styles.inputScore, { height: 60 }]}>Nb votes</Text>
                            {props.all_teams.betListe.map(r =>
                                <Text key={r.username} style={styles.inputScore}>{r.score}</Text>
                            )
                            }
                        </View>
                        <View style={{ flexDirection: "column" }}>
                            <View style={{ width: 60, height: 60, backgroundColor: "lightgrey", justifyContent: "center" }}>
                                <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => { // Function to save only the results!
                                    pushbets(username, sport, props.all_teams.betListe);
                                }
                                }>
                                    <Image resizeMode="cover" resizeMethod="resize" style={{ alignSelf: "center" }} source={require('./assets/save.png')}></Image>
                                </Pressable>

                            </View>
                            {props.all_teams.betListe.map(r =>
                            <View key={r.username} style={{ flexDirection: "row" }} >
                                <MedailleView maxMedals={1} r={r} liste={props.all_teams.betListe} setRealListe={props.all_teams.setBetListe} setloading={props.all_teams.setloading} metal={require('./assets/youpin.png')} rank={1}></MedailleView>
                            </View>
                            )
                            }
                        </View>
                </View>
            </ScrollView>
        )
    }
    else { // Other (list like trail etc.)

        if (!props.all_teams.autho) {
            return (
                <ScrollView kek={console.log(props.all_teams.status)} styles={{ flex: 1 }} horizontal={true}>

                    <View styles={{ width: 30, height: 70, alignSelf: "center" }}>

                        {/* {(status.states.length > 1) ? button_switch(status, setStatus, sport, (status.status == "series") ? "final" : "series", setloading, 0, setListe, setFinal, username, setSeriesLevel, setRealListe) : <Text></Text>} */}
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View>
                            <Text style={styles.inputScore}>Athlete</Text>
                            {props.all_teams.realListe.map(r =>
                                <Text key={r.username} style={r.username.includes(username) ? styles.showPlayersIsIn : styles.showPlayers}>{r.username}</Text>
                            )
                            }
                        </View>
                        <View>
                            <Text style={styles.inputScore}>Score/Temps</Text>
                            {props.all_teams.realListe.map(r =>
                                <Text key={r.username} style={styles.inputScore}>{r.score}</Text>
                            )
                            }
                        </View>
                        <View>
                            <View style={{ width: 20, height: 30, backgroundColor: "lightgrey" }}></View>
                            {props.all_teams.realListe.map((r, index) => {
                                if (r.rank == 1) {
                                    return (
                                        <View key={index} style={{ flexDirection: "row" }} >
                                            <View style={styles.medailleopaque}>
                                                <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/or.png')} />
                                            </View>
                                        </View>)

                                }
                                else if (r.rank == 2) {
                                    return (
                                        <View key={index} style={styles.medailleopaque}>
                                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/argent.png')} />
                                        </View>)
                                }
                                else if (r.rank == 3) {
                                    return (
                                        <View key={index} style={styles.medailleopaque}>
                                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/bronze.png')} />
                                        </View>
                                    )
                                }
                                else {
                                    return (
                                        <View key={index} style={{ width: 20, height: 30, backgroundColor: "lightgrey" }}></View>
                                    )
                                }
                            }
                            )}
                        </View>

                    </View>
                </ScrollView>


            )
        }
        else { // authorized so referee!


            return (
                <ScrollView kek={console.log(props.all_teams.status)}  styles={{ height: "100%", flex: 1 }} horizontal={true} >
                    {props.all_teams.seriesLevel.map(cur_level =>
                        <View key={cur_level}>
                            <View style={{ flexDirection: "row" }}>
                                <View>
                                    <Text style={[styles.showPlayers, { height: 60 }]}>Athlete</Text>
                                    {props.all_teams.realListe.map((r, index) => {

                                        if (cur_level == r.level) {
                                            return (

                                                <View key={index}>
                                                    <Text style={r.username.includes(username) ? styles.showPlayersIsIn : styles.showPlayers}>{r.username}</Text>
                                                </View>
                                            )
                                        }
                                    }
                                    )
                                    }
                                </View>
                                <View>
                                    <Text style={[styles.inputScore, { height: 60 }]}>Score/Temps</Text>
                                    {props.all_teams.realListe.map((r, index) => {
                                        if (cur_level == r.level) {
                                            return (
                                                <TextInput key={index} onChangeText={(text) => { r.score = text; }} style={styles.inputScore}>{r.score}</TextInput>
                                            )
                                        }
                                    }
                                    )
                                    }
                                </View>
                                <View>
                                    <View style={{ width: 60, height: 60, backgroundColor: "lightgrey", justifyContent: "center" }}>
                                        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => { // Function to save only the results!
                                            props.all_teams.setListe([...props.all_teams.realListe]);
                                            pushmatch(username, sport, props.all_teams.realListe, "liste", 0);
                                        }
                                        }>
                                            <Image resizeMode="cover" resizeMethod="resize" style={{ alignSelf: "center" }} source={require('./assets/save.png')}></Image>
                                        </Pressable>

                                    </View>
                                    {props.all_teams.realListe.map((r, index) => {
                                        if (cur_level == r.level) {
                                            if (sport == 'Pizza')
                                                return (
                                                    <View key={index} style={{ flexDirection: "row" }} >
                                                        <MedailleView maxMedals={1} r={r} liste={props.all_teams.realListe} setRealListe={props.all_teams.setRealListe} setloading={props.all_teams.setloading} metal={require('./assets/or.png')} rank={1}></MedailleView>
                                                    </View>
                                                )

                                            return (
                                                <View key={index} style={{ flexDirection: "row" }} >
                                                    <MedailleView maxMedals={2} r={r} liste={props.all_teams.realListe} setRealListe={props.all_teams.setRealListe} setloading={props.all_teams.setloading} metal={require('./assets/bronze.png')} rank={3}></MedailleView>
                                                    <MedailleView maxMedals={2} r={r} liste={props.all_teams.realListe} setRealListe={props.all_teams.setRealListe} setloading={props.all_teams.setloading} metal={require('./assets/argent.png')} rank={2}></MedailleView>
                                                    <MedailleView maxMedals={2} r={r} liste={props.all_teams.realListe} setRealListe={props.all_teams.setRealListe} setloading={props.all_teams.setloading} metal={require('./assets/or.png')} rank={1}></MedailleView>
                                                </View>
                                            )
                                        }
                                    }
                                    )}
                                </View>
                            </View>
                        </View>)}
                </ScrollView >
            )


        }

    }


}
// function button_switch(status, setStatus, sport, otherState, setloading, team_number, setListe, setFinal, username, setSeriesLevel, setRealListe) {
// if (otherState == "playoff") { // so we will be in groups
//     setWidth(400 * (team_number.length + 1));
//     setHeight(400 * (team_number.length + 1) * 4); // poule de 4 en dur
// }
// else if (otherState == "poules") {
//     if (team_number.length > 1) {
//         setWidth(Math.min(400 * ((team_number.length - 1) * (team_number.length - 1)), 3500));
//         setHeight(Math.max(200 * (team_number.length + 1), Dimensions.get("window").height + 100));
//     }
//     else {
//         setWidth(1000);
//         setHeight(1000);
//     }
// }

//     return (
//         <Pressable style={styles.inProgress}
//             onPress={() => { setloading(true); toggle_status(status, setStatus, sport, setloading); if (status.status == "series" || status.status == "final") { fetch_matches(false, status, username, null, null, null, sport, null, null, null, null, setListe, setFinal, setRealListe, setSeriesLevel) }; }}
//         >
//             <Text alignSelf="center">Switch to {otherState}</Text>
//         </Pressable>)
// }


// export function toggle_status(status, setStatus, sportname, setloading) {

//     for (var i = 0; i < status.states.length; i++) {
//         if (status.states[i] == displayed_state[sportname]) {
//             if (i + 1 < status.states.length) {
//                 displayed_state[sportname] = status.states[i + 1];
//             }
//             else {
//                 displayed_state[sportname] = status.states[0];
//             }
//             status.status = displayed_state[sportname]
//             setloading(true);
//             setStatus(JSON.parse(JSON.stringify(status))); // immutable object ffs
//             setloading(false);
//             break;
//         }
//     }
// }


export async function fetch_results() {
    let fetch_results = {}

    fetch_results = await fetch("http://91.121.143.104:7070/results/global.json").then(response => response.json()).then(data => {
        return data;
    }).catch(err => console.log(err));
    return fetch_results;
}

export async function fetch_activities(username, setArbitre, setEvents) {
    await fetch("http://91.121.143.104:7070/athletes/" + username + ".json").then(response => response.json()).then(data => {
        setArbitre(data["arbitre"])
        setEvents(data["activities"])
        return;
    }).catch(err => console.log(err));
    return;
}

function updateMatchArray(curMatch, matchArray, setMatchArray) {
    for (var i in matchArray) {
        if (curMatch.uniqueId == matchArray[i].uniqueId) {
            matchArray[i] = curMatch;
        }
    }
    setMatchArray([...matchArray]);
}


function crement_score_team(teamnumber, curMatch, matchArray, setMatchArray, incrementorDecrement, count = 1) { // 0 to increment, 1 to decrement
    let scoreteam1 = Number(curMatch.score.split(":")[0]);
    let scoreteam2 = Number(curMatch.score.split(":")[1]);
    if (teamnumber == 1) {
        if (incrementorDecrement == 0) {

            scoreteam1 += count;
        }
        else if (scoreteam1 > 0) {
            scoreteam1 -= count;
        }
    }
    else {
        if (incrementorDecrement == 0) {

            scoreteam2 += count;
        }
        else if (scoreteam2 > 0) {
            scoreteam2 -= count;
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
            <View style={{ flex: 1, alignItems: 'center', flexDirection: "row" , width : 150}}>
            <View style={{ flex: 1 }}><Text style={styles.score}>{r.team1 == "" ? "" : r.score}</Text></View>
                {(r.team1 != "" && r.team2 != "" && autho) ?
                    <View style={{ flex: 1 }}><Pressable onPress={() => { setInitScore(r.score); setCurrMatchZoom(r); setMatchZoom(true) }}>
                        <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/editlogo.png')} />
                    </Pressable></View> : <View />
                }
            </View>
            <View><Text style={r.over == 1 ? styles.lose : (r.over == 0 ? (r.team2.includes(username) ? styles.teamUserIsIn : styles.teamnormal) : styles.teamnormal)}>{r.team2}</Text></View>

        </View>)

}
function modalZoomMatch(username, sport, curMatchZoom, setCurrMatchZoom, match_array, set_match_array, matchZoom, setMatchZoom, status, type, initScore, props) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={matchZoom}
            supportedOrientations={['portrait', 'landscape']}
        >
            <View style={styles.matchZoomView}>
                <Pressable style={styles.closeButton} onPress={() => { curMatchZoom.score = initScore; updateMatchArray(curMatchZoom, match_array, set_match_array); setMatchZoom(false) }}><Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/close-button.png')} /></Pressable>
                <View style={{ flexDirection: "column", flex: 1, justifyContent: "space-evenly" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: 200, justifyContent: "center" }}><Text style={{ textAlignVertical: "center" }}>{curMatchZoom.team1}</Text></View>
                        <View style={{ marginLeft: 30, justifyContent: "center" }}>
                            <Pressable onPress={() => { crement_score_team(1, curMatchZoom, match_array, set_match_array, 0, 10) }}><Image resizeMode="cover" resizeMethod="resize" source={require('./assets/doubleplus.png')} /></Pressable>
                            <Pressable onPress={() => { crement_score_team(1, curMatchZoom, match_array, set_match_array, 0) }}><Image resizeMode="cover" resizeMethod="resize" source={require('./assets/simpleplus.png')} /></Pressable>
                            <Text style={{ textAlign: "center" }}>{curMatchZoom.score == undefined ? "0" : curMatchZoom.score.split(":")[0]}</Text>
                            <Pressable onPress={() => { crement_score_team(1, curMatchZoom, match_array, set_match_array, 1) }}><Image resizeMode="cover" resizeMethod="resize" style={{ transform: [{ rotate: '180deg' }] }} source={require('./assets/simpleplus.png')} /></Pressable>
                            <Pressable onPress={() => { crement_score_team(1, curMatchZoom, match_array, set_match_array, 1, 10) }}><Image resizeMode="cover" resizeMethod="resize" style={{ transform: [{ rotate: '180deg' }] }} source={require('./assets/doubleplus.png')} /></Pressable>
                        </View>
                    </View>
                    <View><Text style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}>VS</Text></View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: 200, justifyContent: "center" }}><Text style={{ textAlignVertical: "center" }}>{curMatchZoom.team2}</Text></View>
                        <View style={{ marginLeft: 30, justifyContent: "center" }}>
                            <Pressable onPress={() => { crement_score_team(2, curMatchZoom, match_array, set_match_array, 0, 10) }}><Image resizeMode="cover" resizeMethod="resize" source={require('./assets/doubleplus.png')} /></Pressable>
                            <Pressable onPress={() => { crement_score_team(2, curMatchZoom, match_array, set_match_array, 0) }}><Image resizeMode="cover" resizeMethod="resize" source={require('./assets/simpleplus.png')} /></Pressable>
                            <Text style={{ textAlign: "center" }}>{curMatchZoom.score == undefined ? "0" : curMatchZoom.score.split(":")[1]}</Text>
                            <Pressable onPress={() => { crement_score_team(2, curMatchZoom, match_array, set_match_array, 1) }}><Image resizeMode="cover" resizeMethod="resize" style={{ transform: [{ rotate: '180deg' }] }} source={require('./assets/simpleplus.png')} /></Pressable>
                            <Pressable onPress={() => { crement_score_team(2, curMatchZoom, match_array, set_match_array, 1, 10) }}><Image resizeMode="cover" resizeMethod="resize" style={{ transform: [{ rotate: '180deg' }] }} source={require('./assets/doubleplus.png')} /></Pressable>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Pressable style={{ alignSelf: "center" }} onPress={() => {
                            props.setloading(true);
                            setCurrMatchZoom(determine_winner(curMatchZoom));
                            updateMatchArray(curMatchZoom, match_array, set_match_array);
                            pushmatch(username, sport, curMatchZoom, type, curMatchZoom.uniqueId);
                            setMatchZoom(false);
                            // fetch_matches(false, status, username, null, null, null, sport, props.setmatches, props.setGroups, props.setlevel, props.setmatchesgroup, null, null, null, null).then(r => props.setloading(false))

                        }}>
                            <View>{over_text(match_array, match_array.indexOf(curMatchZoom))}</View>
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
        <View style={styles.bracket}>
            {modalZoomMatch(username, sport, curMatchZoom, setCurrMatchZoom, match_array, set_match_array, matchZoom, setMatchZoom, props.status, type, initScore, props)}
            <View style={styles.line}>
                <View style={styles.bracket}>
                    {match_array.map((r, index) => matchDetail(r, autho, setInitScore, setCurrMatchZoom, setMatchZoom, type, username, index))}

                </View>
                <View style={styles.bracket}>
                    {match_array.map((r, index) => {
                        if (index % 2) {
                            return (draw_svg());
                        }
                    })
                    }
                </View>
            </View>
        </View>
    );

}
function draw_svg() {
    return (
        <View style={{ flex: 1, marginTop: 30, marginBottom: 30, minWidth: 100 }}>
            <Svg height="100%" width="100%" viewBox="0 0 100 1000">
                <Polyline
                    points="0,250 50,250 50,750 0,750 50,750 50,500 100,500"
                    fill="none"
                    stroke="black"
                    strokeWidth="5"
                />
            </Svg>
        </View>
    )
}
function pushmatch(username, sport, match, type, uniqueId) {

    // 5 second timeout:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // // push to server
    fetch("http://91.121.143.104:7070/pushmatch", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "sport": sport, "username": username, "type": type, "match": match, uniqueId: uniqueId }) }).then(r => {
        if (r.status == 200) {
            Alert.alert("Saved", "Saved to server!", ["Ok"])
        }
        else {
            alert("Wrong login or password!");
        }

    }).catch((err) => { alert("Issue with server!") });
}
function determine_winner(curMatch) {

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
            {modalZoomMatch(username, sport, curMatchZoom, setCurrMatchZoom, match, setMatch, matchZoom, setMatchZoom, props.status, type, initScore, props)}
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
            <Image style={{ borderRadius: 5, borderWidth: 2, borderColor: "black", width: 60, height: 67, alignSelf: "center" }} source={require('./assets/goback.png')} />
        )
    }
    return (
        <Image style={{ borderRadius: 5, borderWidth: 2, borderColor: "black", width: 60, height: 67 }} source={require('./assets/finish.png')} />

    )

}

