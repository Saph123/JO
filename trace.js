import styles from "./style";
import { View, ActivityIndicator, ScrollView, TextInput, Text, Image, Modal, Pressable, Alert, Dimensions, ImageBackground } from 'react-native';
import * as React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Svg, Polyline } from 'react-native-svg';
import { Table, Row } from 'react-native-table-component';
import 'react-native-url-polyfill/auto';
import { version, adminlist } from "./global"
import { updateTeams, pushbets, pushvote, toggleLockBets } from "./utils";


const MedailleView = (props) => {
    const rank = props.rank;
    const r = props.r;
    const maxMedals = props.maxMedals
    const locked = props.locked;
    return (
        locked ? <View style={[r.rank == rank ? styles.medailleopaque : styles.medailleabsent, , { backgroundColor: props.color == 1 ? "#A1BFF3" : "#CCE5FF", tintColor: props.color == 1 ? "#A1BFF3" : "#CCE5FF" }]}>
            <Image resizeMode="cover" resizeMethod="resize" source={props.metal} /></View> :
            <View style={[r.rank == rank ? styles.medailleopaque : r.rank == -1 ? styles.medailleabsent : styles.medailletransparent, { backgroundColor: props.color == 1 ? "#A1BFF3" : "#CCE5FF", tintColor: props.color == 1 ? "#A1BFF3" : "#CCE5FF" }]}>
                <TouchableOpacity
                    onPress={() => {
                        if (r.rank == -1) {
                            return;
                        }
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
                        else {
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
                    <Image resizeMode="cover" resizeMethod="resize" source={props.metal} style={{ backgroundColor: props.color == 1 ? "#A1BFF3" : "#CCE5FF" }} />
                </TouchableOpacity>
            </View>
    )

}
export const Trace = (props) => {
    const sport = props.sport;
    const username = props.username;
    const status = props.all_teams.status.status;
    const [loading, setloading] = React.useState(true);
    const [year, setYear] = React.useState(2025);
    const [arbitres, setArbitre] = React.useState([])
    const [appended, setAppended] = React.useState(false)

    React.useEffect(() => {
        setloading(false)
        if (!appended) {
            let tmp_arbitres = []
            if (props.status["arbitre"] != "error") {
                for (index in props.status["arbitre"]) {
                    tmp_arbitres.push({ name: props.status["arbitre"][index] })
                }
                tmp_arbitres.push({ name: "" })
            }
            setArbitre(tmp_arbitres)
            setAppended(true)
        }


    }, [status]);
    if (loading) {
        return (

            <View><ActivityIndicator size="large" color="black" /></View>);
    }
    if (status == "playoff") {
        return (

            <ScrollView horizontal={true}>

                {props.all_teams.levels.slice(0).map(r =>
                    <View key={r}
                        style={{ flexDirection: 'row', alignItems: "stretch", justifyContent: "space-between" }}>
                        <Matchcomp status={props.all_teams.status} sportname={sport} setGroups={props.all_teams.setGroups} setmatches={props.all_teams.setmatches} setlevel={props.all_teams.setlevels} setmatchesgroup={props.all_teams.setmatchesgroup} setloading={props.all_teams.setloading} username={username} loading={loading} matches={props.all_teams.matches} level={r} sport={sport} autho={props.all_teams.autho} onRefresh={props.onRefresh}></Matchcomp>
                    </View>)}
            </ScrollView>
        );
    }
    if (status == "poules") {
        return (
            <ScrollView horizontal={true}>
                {props.all_teams.groups.map((r, index) =>
                    <View key={r.name} style={styles.tablecontainer}>
                        <View style={{ flex: 3 }}>
                            <Text style={{ textAlign: "center" }}>{r.name}</Text>
                            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                <Row data={["Team", "P", "W", "L", "Points", "Diff"]} widthArr={[180, 35, 35, 35, 60, 50]} style={{ width: "100%", height: 40, backgroundColor: '#f1f8ff', fontSize: 16 }}></Row>
                                {r.teams.sort((a, b) => a.points > b.points ? 1 : (a.points == b.points ? (a.diff > b.diff ? 1 : -1) : -1)).reverse().map(q =>
                                    <Row key={q.name} data={[q.name, q.played, q.wins, q.loses, q.points, q.diff]} widthArr={[180, 35, 35, 35, 60, 50]} textStyle={{ fontSize: 16, fontWeight: (inTeam(username, q.name) ? "bold" : "normal") }}></Row>)}
                            </Table>
                        </View>
                        <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-around" }}>
                            <Matchpoule status={props.all_teams.status} key={index} sportname={sport} setGroups={props.all_teams.setGroups} setmatches={props.all_teams.setmatches} setlevel={props.all_teams.setlevels} setmatchesgroup={props.all_teams.setmatchesgroup} username={username} setloading={props.all_teams.setloading} loading={loading} poule={r.name} matches={props.all_teams.groupmatches[index]} level={0} sport={sport} autho={props.all_teams.autho} onRefresh={props.onRefresh}></Matchpoule>
                        </View>
                    </View>)}
            </ScrollView>
        )

    }
    if (status == "modif") {
        return (
            <ScrollView>
                <ScrollView horizontal={true} directionalLockEnabled={false}>
                    <View style={{ flexDirection: "row", marginTop: 22 }}>
                        <View>
                            <Text style={[styles.showPlayers, { height: 60, minWidth: 20 }]}>Équipe/Athlète</Text>
                            {props.all_teams.modifListe["Teams"].map(r =>
                                <TextInput key={r.username} onChangeText={(text) => { r.username = text; }} style={[styles.showPlayers, { minWidth: 20, borderRadius: 5 }]}>{r.username}</TextInput>
                            )
                            }
                        </View>
                        <View>
                            <Text style={[styles.showPlayers, { height: 60, minWidth: 20 }]}>Arbitres</Text>
                            {
                                arbitres != "error" ?
                                    arbitres.map(r =>
                                        <TextInput key={r.name} onChangeText={(text) => { r.name = text }} style={[styles.showPlayers, { minWidth: 20, borderRadius: 5 }]}>{r.name}</TextInput>
                                    )
                                    : <View></View>
                            }
                        </View>
                        <View style={{ minWidth: 60, height: 60, backgroundColor: "lightgrey", justifyContent: "center" }}>
                            <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => { // Function to save only the results!
                                updateTeams(sport, props.all_teams.modifListe["Teams"], arbitres);
                            }
                            }>
                                <Image resizeMode="cover" resizeMethod="resize" style={{ alignSelf: "center" }} source={require('./assets/save.png')}></Image>
                            </Pressable>
                        </View>
                        <View>
                            <Text style={[styles.showPlayers, { height: 60, minWidth: 20 }]}>Non inscrits</Text>
                            {props.all_teams.modifListe["Others"].map(r =>
                                <Text key={r.username} style={[styles.showPlayers, { minWidth: 20 }]}>{r.username}</Text>
                            )
                            }
                        </View>
                    </View>
                </ScrollView>
            </ScrollView>
        )
    }
    if (status == "paris" || status == "paris_locked") {
        const dimensions = Dimensions.get('window');
        const imageHeight = dimensions.height * 0.8;
        const imageWidth = dimensions.width;
        return (
            <ImageBackground style={{ width: imageWidth, minHeight: imageHeight }} source={require('./assets/poker2.jpg')}>
                <View style={{ flex: 2, flexDirection: "column", justifyContent: "space-around" }}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ textAlign: "center", textAlignVertical: "center", fontSize: 25 }} >Sélectionnez votre favori!</Text>
                    </View>
                    {adminlist.includes(username) ?
                        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1 }, styles.betScore]} onPress={() => { toggleLockBets(sport); props.onRefresh() }}>
                            <Image style={{ borderRadius: 15, width: 30, height: 30, backgroundColor: "white" }} resizeMethod="auto" resizeMode='cover' source={status == "paris_locked" ? require('./assets/lock.png') : require("./assets/unlock.png")} />
                        </Pressable> : <View></View>}

                    {props.all_teams.betListe.map(r =>
                        <View key={r.username} style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", }}>
                            <View style={[styles.bet, { alignSelf: "center" }]}>
                                <Text key={r.username} onChangeText={(text) => { r.username = text; }}>{r.username}</Text>
                            </View>

                            <Pressable style={({ pressed }) => [{ opacity: status == "paris_locked" ? r.rank == 0 ? 0 : 1 : pressed ? 0.2 : 1 }, r.rank == 1 ? styles.betScoreIsIn : styles.betScore, { flexDirection: "row" }]} onPress={() => {
                                if (status == "paris") {

                                    var new_liste = props.all_teams.betListe;
                                    if (r.rank == 1) {
                                        for (var index = 0; index < new_liste.length; index++) {
                                            if (new_liste[index].username == r.username) {
                                                new_liste[index].rank = 0;
                                                new_liste[index].score -= 1;
                                            }
                                        }
                                        pushbets(username, sport, "");
                                    }
                                    else {
                                        for (var index = 0; index < new_liste.length; index++) {
                                            if (new_liste[index].rank == 1) {
                                                new_liste[index].score -= 1;
                                                new_liste[index].rank = 0;
                                            }
                                            if (new_liste[index].username == r.username) {
                                                new_liste[index].rank = 1;
                                                new_liste[index].score += 1;
                                            }
                                        }
                                        pushbets(username, sport, r.username);
                                    }
                                    props.all_teams.setBetListe([...new_liste]);
                                }
                            }}>
                                <Text key={r.username}>{r.score} </Text>
                                <Image source={require('./assets/youpin.png')} />
                            </Pressable>
                        </View>
                    )
                    }
                </View>
            </ImageBackground>
        )
    }
    if (status == "results") {
        const dimensions = Dimensions.get('window');
        const imageHeight = dimensions.height * .75;
        const imageWidth = dimensions.width;
        return (
            <ImageBackground style={{ width: imageWidth, height: imageHeight }} source={require('./assets/podium3.png')}>
                <View style={{ flex: 2 }}>
                    <View style={{ flexDirection: "row", alignSelf: "center", width: "100%", marginTop: 22 }}>
                        <Pressable style={({ pressed }) => [{ opacity: (year - 1) in props.results["1"] ? pressed ? 0.2 : 1 : 0 }]} onPress={() => { if ((year - 1) in props.results["1"]) setYear(year - 1) }}>
                            <Image source={require('./assets/arrow_left.png')} />
                        </Pressable>
                        <View style={{ flex: 1 }}>
                            <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/calendar2.png')} />
                            <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 30, marginTop: "-40%" }}>{year}</Text>
                        </View>
                        <Pressable style={({ pressed }) => [{ opacity: (year + 1) in props.results["1"] ? pressed ? 0.2 : 1 : 0 }]} onPress={() => { if ((year + 1) in props.results["1"]) setYear(year + 1) }}>
                            <Image source={require('./assets/arrow_right.png')} />
                        </Pressable>
                    </View>
                </View>
                <View style={{ flex: 10, flexDirection: "row", alignSelf: "center", width: "100%" }}>
                    <View style={{ flex: 1, flexDirection: "row", marginTop: "5%", justifyContent: "center" }}>
                        {year in props.results["2"] ? props.results["2"][year].map(r => result_view(r)) : <Text></Text>}
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", marginTop: "-5%", justifyContent: "center" }}>
                        {year in props.results["1"] ? props.results["1"][year].map(r => result_view(r)) : <Text></Text>}
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", marginTop: "7%", justifyContent: "center" }}>
                        {year in props.results["3"] ? props.results["3"][year].map(r => result_view(r)) : <Text></Text>}
                    </View>
                </View>
            </ImageBackground>
        )
    }
    else { // Other (list like trail etc.)
        let currentListe = status == "vote" ? props.all_teams.voteListe : status == "seeding" ? props.all_teams.seedingListe : props.all_teams.realListe
        let level = status == "seeding" ? props.all_teams.seedingLevel : props.all_teams.seriesLevel;
        let series_name = status == "seeding" ? ["Seeding"] : props.all_teams.seriesName
        if ((!props.all_teams.autho && (status == "final" || status == "seeding" || status == "series")) || (!props.all_teams.authoVote && status == "votes")) {
            return (
                <ScrollView styles={{ height: "100%" }} directionalLockEnabled={false}>
                    {level.map(cur_level =>
                        <View key={cur_level} style={{ flex: 1, flexDirection: "column" }}>
                            <Text style={[styles.showPlayers, { height: 25, backgroundColor: "#A1BFF3", fontSize: 18, marginTop: 22, borderRadius: 5, marginRight: 20 }]}>{series_name[cur_level - 1]}</Text>

                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <View>
                                    <Text style={[styles.showPlayers, { height: 60, backgroundColor: "#A1BFF3", fontSize: 18, fontStyle: "italic" }]}>Athlete</Text>
                                    {currentListe.map((r, index) => {
                                        if (cur_level == r.level) {
                                            return (
                                                <View key={index}>
                                                    <Text style={[inTeam(username, r.username) ? styles.showPlayersIsIn : styles.showPlayers, { backgroundColor: index % 2 ? "#A1BFF3" : "#CCE5FF" }]}>{r.username}</Text>
                                                </View>
                                            )
                                        }
                                    }
                                    )
                                    }
                                </View>
                                <View>
                                    <Text style={[styles.inputScore, { height: 60, backgroundColor: "#A1BFF3", fontSize: 18, fontStyle: "italic" }]}>Score / Temps</Text>
                                    {currentListe.map((r, index) => {
                                        if (cur_level == r.level) {
                                            return (
                                                    <Text key={index} style={[styles.inputScore, { backgroundColor: index % 2 ? "#A1BFF3" : "#CCE5FF" }]}>{r.score}</Text>
                                            )
                                        }
                                    }
                                    )
                                    }
                                </View>
                                <View>
                                    <View style={{ width: 20, height: 60, backgroundColor: "lightgrey" }}></View>
                                    {currentListe.map((r, index) => {
                                        if (cur_level == r.level) {
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
                                    }
                                    )}
                                </View>
                            </View>
                        </View>)}
                </ScrollView>

            )
        }
        else { // authorized so referee!
            return (
                <ScrollView styles={{ height: "100%" }} directionalLockEnabled={false}>
                    {level.map(cur_level =>
                        <View key={cur_level} style={{ flex: 1, flexDirection: "column" }}>
                            <Text style={[styles.showPlayers, { height: 25, backgroundColor: "#A1BFF3", fontSize: 18, marginTop: 22, borderRadius: 5, marginRight: 20 }]}>{series_name[cur_level - 1]}</Text>
                            <View style={{ flexDirection: "row", marginRight: 10 }}>
                                <View>
                                    <Text style={[styles.showPlayers, { height: 60, backgroundColor: "#A1BFF3", fontSize: 18, fontStyle: "italic" }]}>Athlete</Text>
                                    {currentListe.map((r, index) => {
                                        if (cur_level == r.level) {
                                            return (
                                                <View key={index}>
                                                    <Text style={[inTeam(username, r.username) ? styles.showPlayersIsIn : styles.showPlayers, { backgroundColor: index % 2 ? "#A1BFF3" : "#CCE5FF" }]}>{r.username}</Text>
                                                </View>
                                            )
                                        }
                                    }
                                    )
                                    }
                                </View>
                                <View>
                                    <Text style={[styles.inputScore, { height: 60, backgroundColor: "#A1BFF3", fontSize: 18, fontStyle: "italic" }]}>Score / Temps</Text>
                                    {currentListe.map((r, index) => {
                                        if (cur_level == r.level) {
                                            return (
                                                status == "votes" ?
                                                    <Text key={index} style={[styles.inputScore, { backgroundColor: index % 2 ? "#A1BFF3" : "#CCE5FF" }]}>{r.score}</Text> :
                                                    <TextInput key={index} onChangeText={(text) => { r.score = text; }} style={[styles.inputScore, { backgroundColor: index % 2 ? "#A1BFF3" : "#CCE5FF" }]}>{r.score}</TextInput>
                                            )
                                        }
                                    }
                                    )
                                    }
                                </View>
                                <View>
                                    <View style={{ width: 60, height: 60, backgroundColor: "#A1BFF3", justifyContent: "center", borderRadius: 10 }}>
                                        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => { // Function to save only the results!
                                            props.all_teams.setListe([...currentListe]);
                                            if (status == "votes") {
                                                for (let index = 0; index < currentListe.length; index++) {
                                                    if (currentListe[index].rank == 1) {
                                                        pushvote(username, currentListe[index].username, sport);
                                                        props.onRefresh();
                                                    }
                                                }
                                            }
                                            else {
                                                pushmatch(username, sport, currentListe, status == "seeding" ? "seeding" : "liste", series_name[cur_level - 1]);
                                                props.onRefresh();
                                            }
                                        }
                                        }>
                                            <Image resizeMode="cover" resizeMethod="resize" style={{ alignSelf: "center" }} source={require('./assets/save.png')}></Image>
                                        </Pressable>

                                    </View>
                                    {currentListe.map((r, index) => {
                                        if (cur_level == r.level) {
                                            if (status == "votes")
                                                return (
                                                    <View key={index} style={{ flexDirection: "row" }} >
                                                        <MedailleView maxMedals={1} r={r} liste={currentListe} setRealListe={props.all_teams.setRealListe} setloading={props.all_teams.setloading} metal={require('./assets/or.png')} rank={1} locked={false}></MedailleView>
                                                    </View>
                                                )

                                            return (
                                                <View key={index} style={{ flexDirection: "row" }} >
                                                    <MedailleView maxMedals={2} color={index % 2} r={r} liste={currentListe} setRealListe={props.all_teams.setRealListe} setloading={props.all_teams.setloading} metal={require('./assets/bronze.png')} rank={3} locked={false}></MedailleView>
                                                    <MedailleView maxMedals={2} color={index % 2} r={r} liste={currentListe} setRealListe={props.all_teams.setRealListe} setloading={props.all_teams.setloading} metal={require('./assets/argent.png')} rank={2} locked={false}></MedailleView>
                                                    <MedailleView maxMedals={2} color={index % 2} r={r} liste={currentListe} setRealListe={props.all_teams.setRealListe} setloading={props.all_teams.setloading} metal={require('./assets/or.png')} rank={1} locked={false}></MedailleView>
                                                </View>
                                            )
                                        }
                                    }
                                    )}
                                </View>
                            </View>
                        </View>)}
                </ScrollView>
            )


        }

    }


}

export function result_view(results) {
    return (
        <View key={results} style={styles.podium}>
            <Text style={{ textAlign: "center" }}>{results}</Text>
        </View>)
}

export async function fetch_global_bets_results() {
    let fetch_results = {}

    fetch_results = await fetch("https://jo.pierrickperso.ddnsfree.com/results/global_bets.json").then(response => response.json()).then(data => {
        return data;
    }).catch(err => console.log(err));
    return fetch_results;
}

export async function fetch_global_results() {
    let fetch_results = {}

    fetch_results = await fetch("https://jo.pierrickperso.ddnsfree.com/results/global.json").then(response => response.json()).then(data => {
        return data;
    }).catch(err => console.log(err));
    return fetch_results;
}

export async function fetch_activities(username, setArbitre, setEvents) {
    await fetch("https://jo.pierrickperso.ddnsfree.com/athletes/" + username + ".json").then(response => response.json()).then(data => {
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
        if (scoreteam1 < 0) {
            scoreteam1 = 0;
        }
    }
    else {
        if (incrementorDecrement == 0) {

            scoreteam2 += count;
        }
        else if (scoreteam2 > 0) {
            scoreteam2 -= count;
        }
        if (scoreteam2 < 0) {
            scoreteam2 = 0;
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
function inTeam(username, team) {
    let re = new RegExp('\\b' + username + "\\b");
    if (re.exec(team) != null) {
        return true;
    }
    else {
        return false;
    }
}
function matchDetail(r, autho, setInitScore, setCurrMatchZoom, setMatchZoom, type, username, index) {
    return (

        <View key={index} style={r.over == 0 ? (type == "playoff" ? styles.match : styles.matchpoule) : (type == "playoff" ? styles.matchover : styles.matchpouleover)}>
            <Text style={r.over == 2 ? styles.lose : (r.over == 0 ? (inTeam(username, r.team1) ? styles.teamUserIsIn : styles.teamnormal) : styles.teamnormal)}>{r.team1}</Text>
            <View style={{ flex: 1, alignItems: 'center', flexDirection: "row", width: 150 }}>
                <View style={{ flex: 1 }}><Text style={styles.score}>{r.team1 == "" ? "" : r.score}</Text></View>
                {(r.team1 != "" && r.team2 != "" && autho) ?
                    <View style={{ flex: 1 }}><Pressable onPress={() => { setInitScore(r.score); setCurrMatchZoom(r); setMatchZoom(true) }}>
                        <Image resizeMode="cover" resizeMethod="resize" source={require('./assets/editlogo.png')} />
                    </Pressable></View> : <View />
                }
            </View>
            <View><Text style={r.over == 1 ? styles.lose : (r.over == 0 ? (inTeam(username, r.team2) ? styles.teamUserIsIn : styles.teamnormal) : styles.teamnormal)}>{r.team2}</Text></View>

        </View>)

}
function modalZoomMatch(username, sport, curMatchZoom, setCurrMatchZoom, match_array, set_match_array, matchZoom, setMatchZoom, status, type, initScore, props) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={matchZoom}
        >
            <View style={styles.matchZoomView}>
                <Pressable style={styles.closeButton} onPress={() => { curMatchZoom.score = initScore; updateMatchArray(curMatchZoom, match_array, set_match_array); setMatchZoom(false) }}><Image style={{ alignSelf: "center", marginVertical: 4 }} resizeMode="cover" resizeMethod="resize" source={require('./assets/remove.png')} /></Pressable>
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
                            props.onRefresh();
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
                            return (draw_svg(index));
                        }
                    })
                    }
                </View>
            </View>
        </View>
    );

}
function draw_svg(index) {
    return (
        <View key={index} style={{ flex: 1, marginTop: 30, marginBottom: 30, minWidth: 100 }}>
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
    console.log(match)
    // // push to server
    fetch("https://jo.pierrickperso.ddnsfree.com/pushmatch", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "sport": sport, "username": username, "type": type, "match": match, uniqueId: uniqueId }) }).then(r => {
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

