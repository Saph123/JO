import * as React from 'react';
import { Button, View, Dimensions, ActivityIndicator, StyleSheet, TextInput, Text, Image, Modal, Alert } from 'react-native';
import { NavigationContainer, useNavigation, useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Table, Row } from 'react-native-table-component';
import { Svg, Polyline } from 'react-native-svg';
import beerpong_matches_json from './assets/Beerpong_matches.json';
import ventriglisse_matches_json from './assets/ventriglisse_match.json';
import matches_status from './assets/Beerpong_status.json';
import matches_group from './assets/Beerpong_poules.json';
import beerpong_autho from './assets/Beerpong_autho.json';
import PinchZoomView from 'react-native-pinch-zoom-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import CountDown from 'react-native-countdown-component';
// import Orientation from 'react-native-orientation';
class Match {
    constructor(sport, team1, team2, uniqueId, score, over, level) {
        // this.numberOfPlayer = Number(numberOfPlayer)
        this.team1 = team1
        this.team2 = team2
        this.sport = sport
        this.uniqueId = uniqueId
        this.score = score
        this.over = over
        this.level = level
    }
}
class Group {
    constructor(sport, name, teams, uniqueId, over) {
        this.name = name;
        this.teams = teams;
        this.sport = sport;
        this.uniqueId = uniqueId;
        this.over = over
    }
}
let username = "max";
let offline = false;
let displayed_state = "";
let toggle = 0;
const ArbitreContext = React.createContext(false);
function HomeScreen({ route, navigation }) {
    const [sound, setSound] = React.useState();
    const [loading, setLoading] = React.useState(1);
    const [soundStatus, setSoundStatus] = React.useState();
    const [secondsleft, setSecondsleft] = React.useState(1000);
    React.useEffect(() => {
        var dateJO = new Date('2021-08-26T20:00:00');
        console.log(Math.trunc((dateJO - Date.now())/1000));
        setSecondsleft(Math.trunc((dateJO - Date.now())/1000));
        setLoading(0);
    }, []);
    if(loading)
    {
        return(<ActivityIndicator size="large" color="#000000" />)

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

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
      <CountDown
        until={secondsleft}
        onFinish={() => alert('finished')}
        onPress={() => alert('hello')}
        size={20}
      />
            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Text style={styles.texthomebutton}>Beerpong</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homebuttons}
                onPress={() => navigation.navigate('LancerdeTongDetails')}
            >

                <Text style={styles.texthomebutton}>LancerdeTong</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homebuttons}
                onPress={() => navigation.navigate('WaterpoloDetails')}
            >
                <Text style={styles.texthomebutton}>Waterpolo</Text>
            </TouchableOpacity>
            <View
                style={{
                    borderLeftWidth: 1,
                    borderLeftColor: 'black',
                }}
            />
            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('centmetreRicardDetails') }}
            >
                <Text style={styles.texthomebutton}>100mRicard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homebuttons}
                onPress={() => fetch_matches("Beerpong")} >
                <Text style={styles.texthomebutton}>Trail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}>
                <Text style={styles.texthomebutton}>Ventriglisse</Text>
            </TouchableOpacity>
            <TouchableOpacity onPressIn={() => { playSound(sound, soundStatus, setSound, setSoundStatus, "cluedo") }}>
                <Image source={require('./assets/cluedo.png')} />
                </TouchableOpacity>
            <View style={{
                margin: 30,
            }}
            />
            <TouchableOpacity style={styles.loginbutton}
                onPress={() => { navigation.navigate('Login') }}
            >
                <Text style={styles.texthomebutton}>Login</Text>
            </TouchableOpacity>
        </View>

    );
}
async function fetch_status(sportname, setStatus){
    
    let fetch_status = {}
    if (offline) {
        if (sportname == "Beerpong") {
            setStatus(matches_status);
            displayed_state = matches_status['status'];
        }
    }
    else {
         fetch_status = await fetch("http://109.24.229.111:7070/teams/" + sportname + "_status.json").then(response => response.json()).then(data => {
            setStatus(data);
            displayed_state = data['status'];
            return data;
            });
            return fetch_status;
    }
}
async function fetch_matches(sportname, setmatches, setgroups, setlevel, setPlayoff, setmatchesgroup, setWidth, setHeight) {

    let matches = {};
    if (offline) {
        if (sportname == "Beerpong") {
            matches = beerpong_matches_json;
        }
        else {
            matches = ventriglisse_matches_json;

        }

    }
    else {
        matches = await fetch("http://109.24.229.111:7070/teams/" + sportname + "_matches.json").then(response => response.json()).then(data =>  {return data });
    }
    let level = [];
    let local_array_match = [[]];
    if (displayed_state == "poules") // group phasis:
    {
        setPlayoff(0);
        let groups = matches_group;
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
                local_array_groupmatch.push(new Match(sportname, local_match.team1, local_match.team2, local_match.match, local_match.score, local_match.over, local_match.level));
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
        setPlayoff(1);
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
function toggle_status(status, setStatus, navigation){

    for (var i = 0; i < status.states.length; i++) {
        if(status.states[i] == displayed_state)
        {
            if(i+1 < status.states.length)
            {
                displayed_state = status.states[i+1];
            }
            else
            {
                displayed_state = status.states[0];
            }
            status.status = displayed_state;
            toggle = 1;
            setStatus(status);
            navigation.navigate(navigation.dangerouslyGetState().routes[navigation.dangerouslyGetState().index].name, { refresh: "fdp" });
            break; 
        }
    }
}
function GetState(sportname, status, setStatus, navigation) {
    
    const [loaded, setloaded] = React.useState(0);


    React.useEffect(() => {
        if (offline) {
            if (sportname == "Beerpong") {
                setStatus(matches_status);
                displayed_state = matches_status['status'];
            }
        }
        else {
        const fetch_status = async () => {await fetch("http://109.24.229.111:7070/teams/" + sportname + "_status.json").then(response => response.json()).then(data => {
            setStatus(data);
            displayed_state = data['status'];
            setloaded(1);
            });}
        fetch_status();
        }
    }, []);

    if(loaded == 0)
    {
        return <View><ActivityIndicator color="000000" /></View>;
    }
    else{
        return <View><TouchableOpacity onPressIn={() => {toggle_status(status, setStatus, navigation);}}><Text style={{ marginTop:10, marginRight:30, color: "white" }}>{status["status"]}</Text></TouchableOpacity></View>;
    }
};

function Login({ navigation }) {
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height / 2;
    const [userName, setuserName] = React.useState(null);
    const [password, setpassword] = React.useState(null);
    const controller = new AbortController()

    // 5 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    // let local_match = React.useState("");
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

                        fetch("http://109.24.229.111:7070/login", { signal: controller.signal, method: "POST", body: JSON.stringify({ "username": userName, "password": password }) }).then(r => {
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

                        fetch("http://109.24.229.111:7070/register", { method: "POST", body: JSON.stringify({ "username": userName, "password": password }) }).then(r => {
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

function BeerpongDetailsScreen({ navigation }) {
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;
    
    const [window_width, setWidth] = React.useState(width);
    const [window_height, setHeight] = React.useState(height);
    const [authorized, setauthorized] = React.useState(false);
    const [loadingmain, setloading] = React.useState(true);
    const [local_toggle, setToggle] = React.useState(0);
    if(local_toggle != toggle)
    {
    setToggle(toggle);
    }
    React.useEffect(() => {
        for (var authouser in beerpong_autho.autho) {
            if (beerpong_autho.autho[authouser] == username) {
                setauthorized(true);
            }
        }
        setloading(false);
    }, []);
    if(loadingmain)
    {
        return(<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <PinchZoomView style={{ position: 'absolute', backgroundColor: "lightgrey", top: 0, left: 0, width: window_width, height: window_height }} toggle={toggle} maxScale={1} minScale={0.5} >
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
                                        {matches_status.arbitre.map(r => <Text style={styles.modalText} >{r}</Text>)}
                                    </View>

                                </View>
                            </Modal>
                        </View>)
                }

                }
            </ArbitreContext.Consumer>

            <Trace local_toggle={local_toggle} sport={"Beerpong"} setWidth={(w) => setWidth(w)} setHeight={(h) => setHeight(h)} autho={authorized} />
        </PinchZoomView>


    )
};

function LancerdeTongDetailsScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={{ flex: 6, color: 'red' }}>LancerdeTong!</Text>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                <Button color='red' title={"osef"} onPress={() => navigation.navigate('Home')} />
            </View>
        </View>
    );
}
function centmetreRicardDetailsScreen({ navigation }) {
    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        </View>
    );
}
function pushscore(score) {
    alert(score);
}


const Matchcomp = (props) => {
    const matches = props.matches;
    const level = props.level;
    const autho = props.autho;
    const sport = props.sport;
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
function manage_score_over(match, index, score, setScore) {
    if (match[index].over == 0) {
        return (
            <View style={{ flexDirection: "row" }}>
                <TextInput style={styles.score} value={score[index]} onChangeText={(text) => { let tmp_array_score = JSON.parse(JSON.stringify(score)); tmp_array_score[index] = text; setScore(tmp_array_score) }} />
                <TouchableOpacity onPress={() => { pushscore(score[index]) }} ><Image style={{ borderRadius: 5, borderWidth: 2, borderColor: "black", width: 20, height: 20, alignSelf: "center" }} source={require('./assets/validatelogo.png')} /></TouchableOpacity>
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
function determine_winner(match, index, setfun, score, setFetching) {
    // TODO : add push function to json through raspi
    let tmp_array = JSON.parse(JSON.stringify(match));
    let topush = false;
    const controller = new AbortController();
    if (tmp_array[index].over != 0) {
        tmp_array[index].over = 0;
        setfun(tmp_array);
        // TODO: push to raspi
        return;
    }
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
    if(topush)
    {
        // 5 second timeout:
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // push to raspi
        fetch("http://109.24.229.111:7070/pushmatch", { signal: controller.signal, method: "POST", body: JSON.stringify({ "username": username, tmp_array }) }).then(r => {
            if (r.status == 200) {
                username = userName; navigation.navigate('Home', { refresh: "refresh" });
                setFetching(false);
                setfun(tmp_array);
                return;
                            }
                            else {
                                alert("Wrong login or password!");
                                setFetching(false);
                                return;
                            }
                            
                        }).catch((err) => { alert(err,"Issue with server!");setFetching(false); return })
    }
}
const Matchpoule = (props) => {
    const matches = props.matches;
    const level = props.level;
    const autho = props.autho;
    const sport = props.sport;
    const [local_load, setLoading] = React.useState(true)
    const [local_fetch, setFetching] = React.useState(false)
    const [score, setScore] = React.useState([]);
    const [match, setMatch] = React.useState([])
    let match_array = [];
    let array_score = [];
    for (var i = 0; i < matches.length; i++) {
        if (matches[i]['level'] == level) {

            match_array.push(matches[i]);
            array_score.push(matches[i].score);
        }
    }
    React.useEffect(() => {
        setLoading(false);
        setScore(array_score);
        setMatch(match_array);
    }, []);
    if (local_load) {
        return (<View></View>);
    }
    if(local_fetch){
        
            return(<View><ActivityIndicator  size="large" color="#000000" style={styles.fetching}/></View>)
    }
    if (autho && !local_fetch) {
        return (
            <View style={styles.column}>
                {match.map((r, index) => {
                    return (<View style={r.over == 0 ? styles.matchpoule : styles.matchpouleover}>
                        <Text style={r.over == 2 ? styles.lose : styles.teamnormal}>{r.team1}</Text>
                        <Text>{"vs"}</Text><Text style={r.over == 1 ? styles.lose : styles.teamnormal}>{r.team2}</Text>
                        <View style={{ flexDirection: "row" }}>{manage_score_over(match, index, score, setScore)}</View>
                        <TouchableOpacity onPress={() => {setFetching(true);console.log(local_fetch);determine_winner(match, index, setMatch, score, setFetching)}}><Text>{over_text(match, index)}</Text></TouchableOpacity>
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
const Trace = (props) => {
    const sport = props.sport;
    const autho = props.autho;
    const local_toggle = props.local_toggle;
    const navigation = useNavigation();
    const [loading, setloading] = React.useState(true);
    const [matches, setmatches] = React.useState([]);
    const [levels, setlevels] = React.useState([]);
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [playoff, setPlayoff] = React.useState(0);
    const [groups, setGroups] = React.useState([]);
    const [groupmatches, setmatchesgroup] = React.useState([]);

    React.useEffect(() => {
        fetch_matches("Beerpong", setmatches, setGroups, setlevels, setPlayoff, setmatchesgroup, props.setWidth, props.setHeight).then(r => {
            setloading(false)
        }).catch(err => alert("Erreur pendant le chargement des matchs, reessayez."));


    }, []);
    if(local_toggle && toggle == 1)
    {
        toggle = 0;
        setloading(true);
        fetch_matches("Beerpong", setmatches, setGroups, setlevels, setPlayoff, setmatchesgroup, props.setWidth, props.setHeight).then(r => {
                    setloading(false);
                }).catch(err => alert("Erreur pendant le chargement des matchs, reessayez."));
    }

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
                        <Matchcomp loading={loading} matches={matches[r]} level={r} sport={sport} autho={autho}></Matchcomp>
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
                        <Row data={["Team", "P", "W", "L"]} widthArr={[150, 30, 30, 30]} style={{ width: "100%", height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ margin: 6 }}></Row>
                        {r.teams.map(q =>
                            <Row data={[q.name, q.played, q.wins, q.loses]} widthArr={[150, 30, 30, 30]} textStyle={{ margin: 6 }}></Row>)}
                    </Table>
                    <View style={{ flexDirection: "column", justifyContent: "space-around" }}>
                        <Matchpoule loading={loading} matches={groupmatches[index]} level={0} sport={sport} autho={autho}></Matchpoule>
                    </View>
                </View>)}
        </View>
    )

}
function WaterpoloDetailsScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={{ flex: 6, color: 'red' }}>WaterpoloDetailsScreen!</Text>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                <Button color='red' title="Home" onPress={() => navigation.navigate('Home')} />
            </View>
        </View>
    );
}
function TrailDetailsScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={{ flex: 6, color: 'red' }}>TrailDetailsScreen!</Text>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                <Button color='red' title="Home" onPress={() => navigation.navigate('Home')} />
            </View>
        </View>
    );
}

function UsernameScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={{ flex: 6, color: 'red' }}>TrailDetailsScreen!</Text>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                <Button color='red' title="Home" onPress={() => navigation.navigate('Home')} />
            </View>
        </View>
    );
}

async function playSound(sound_main, sound_status, set_sound, setstatus, sound_name) {
    if (sound_main == undefined) {
        if(sound_name == "megaphone"){
            const { sound: playbackObject } = await Audio.Sound.createAsync(
                require('./assets/guylabedav.mp3')
            );
                set_sound(playbackObject);
            }
            else if(sound_name == "cluedo")
            {
                const { sound: playbackObject } = await Audio.Sound.createAsync(
                    require('./assets/cluedo.mp3')
                    );
                    set_sound(playbackObject);
        }
    }
    var playback = await sound_main;
    if (sound_main != undefined) {

        var test = await sound_main.getStatusAsync();
        if (test.isPlaying == true) {
            await sound_main.stopAsync();

        }
        else {
            await sound_main.stopAsync();
            await sound_main.playAsync();
        }

    }
}

const Stack = createStackNavigator();
function App() {
    const [arbitre, setArbitre] = React.useState(false);
    const [sound, setSound] = React.useState();
    const [status, setstatus] = React.useState();

    const [soundStatus, setSoundStatus] = React.useState();
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
                    <Stack.Screen options={({ navigation }) => ({ title: "Home", headerRight: () => (<View style={{ flexDirection: "row", margin: 10 }}><TouchableOpacity onPressIn={() => { playSound(sound, soundStatus, setSound, setSoundStatus, "megaphone") }}><Image style={{ borderRadius: 40, width: 20, height: 20, margin: 30 }} source={require('./assets/megaphone.png')} /></TouchableOpacity><TouchableOpacity style={{ alignContent: "center" }} onPressIn={() => { navigation.navigate('UsernameScreen') }}><Text style={{ color: "white", margin: 10, alignSelf: "center" }}>{username}</Text></TouchableOpacity></View>) })} name="Home" component={HomeScreen} />
                    <Stack.Screen options={{ title: "Login", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}><Text style={{ color: "white", marginRight: 20, alignSelf: "center" }}>{username}</Text></View> }} name="Login" component={Login} />
                    <Stack.Screen options={({ navigation }) => ({ title: "Beerpong", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}>{GetState("Beerpong", status, setstatus, navigation)}<View><Text style={{ color: "white", margin: 10, alignSelf: "center" }}>{username}</Text></View><TouchableOpacity onPressIn={() => { setArbitre(true) }} onPressOut={() => setTimeout(() => { setArbitre(false) }, 1000)}><Image style={{ borderRadius: 15, width: 30, height: 30 }} source={require('./assets/sifflet.png')} /></TouchableOpacity></View> })} name="BeerpongDetails" component={BeerpongDetailsScreen} />
                    <Stack.Screen options={{ headerRight: () => <TouchableOpacity onPressIn={() => arbitre = true}><Image style={{ borderRadius: 15, width: 20, height: 20 }} source={require('./assets/sifflet.png')} /></TouchableOpacity> }} name="LancerdeTongDetails" component={LancerdeTongDetailsScreen} />
                    <Stack.Screen options={{ headerRight: () => <TouchableOpacity onPressIn={() => arbitre = true}><Image style={{ borderRadius: 15, width: 20, height: 20 }} source={require('./assets/sifflet.png')} /></TouchableOpacity> }} name="centmetreRicardDetails" component={centmetreRicardDetailsScreen} />
                    <Stack.Screen options={{ headerRight: () => <TouchableOpacity onPressIn={() => arbitre = true}><Image style={{ borderRadius: 15, width: 20, height: 20 }} source={require('./assets/sifflet.png')} /></TouchableOpacity> }} name="WaterpoloDetails" component={WaterpoloDetailsScreen} />
                    <Stack.Screen options={{ headerRight: () => <TouchableOpacity onPressIn={() => arbitre = true}><Image style={{ borderRadius: 15, width: 20, height: 20 }} source={require('./assets/sifflet.png')} /></TouchableOpacity> }} name="TrailDetails" component={TrailDetailsScreen} />
                    <Stack.Screen options={{ headerRight: () => <TouchableOpacity onPressIn={() => arbitre = true}><Image style={{ borderRadius: 15, width: 20, height: 20 }} source={require('./assets/sifflet.png')} /></TouchableOpacity> }} name="UsernameScreen" component={UsernameScreen} />
                </Stack.Navigator>
            </ArbitreContext.Provider>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 20,
        margin: 10,
    },
    tablecontainer: {
        flex: 1,
        alignSelf: "flex-start",
        margin: 30,
        width: 242,
        backgroundColor: "#EFF8FF"
    },
    matchover: {
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#D62628",
        borderWidth: 1,
        marginLeft: 30,
        marginRight: 30,
        width: 100,
    },
    matchpouleover: {
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#D62628",
        borderWidth: 1,
        margin: 30,
        flex: 1,
        // width: 100,
        // height: 100,
        borderRadius: 15
    },
    match: {
        flexDirection: 'column',
        justifyContent: "space-evenly",
        backgroundColor: "#A8DADC",
        borderWidth: 1,
        alignItems: "center",
        marginLeft: 30,
        marginRight: 30,
        width: 100,
    },
    matchpoule: {
        flexDirection: 'column',
        justifyContent: "space-between",
        backgroundColor: "#A8DADC",
        borderWidth: 1,
        flex: 1,
        alignItems: "center",
        margin: 30,
        // width: 100,
        // height:100,
        borderRadius: 15
    },
    textmatch: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: "calibri",
        width: "100%"
    },
    teamnormal: {
        textAlign: "center",
        width: "100%",
        fontSize: 16,
    },
    lose: {
        textAlign: "center",
        width: "100%",
        color: "grey",
        textDecorationLine: "line-through",
        // fontSize: 16
    },
    fetching: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: "100%",
        height:"100%",
        alignItems: 'center',
        justifyContent: 'center'
      },

    middle: {
        flex: 0.3,
        backgroundColor: "beige",
        borderWidth: 5,
    },
    line: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 30,
        marginRight: 0,
        marginLeft: 0
    },
    column: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        margin: 30
    },
    bottom: {
        flex: 0.3,
        backgroundColor: "pink",
        borderWidth: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    bottom: {
        fontFamily: "cochin",
        // textAlign: "justify"
    },
    score: {
        textAlign: "center",
        borderColor: "black",
        borderWidth: 1,
        // maxWidth:50
    },
    svg: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        // zIndex:0
    },
    centeredView: {
        flex: 0.5,
        maxWidth: 200,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        maxWidth: 200,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignSelf: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    homebuttons: {
        // flex: 1,
        backgroundColor: "lightblue",
        width: 100,
        textAlign: "center",
        fontSize: 16,
        height: 50,

        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 8,
    },
    loginbutton: {
        // flex: 1,
        backgroundColor: "lightgreen",
        width: 100,
        textAlign: "center",
        fontSize: 16,
        height: 50,

        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 8,
    },
    logoutbutton: {
        // flex: 1,
        backgroundColor: "lightcoral",
        width: 100,
        textAlign: "center",
        fontSize: 16,
        height: 50,

        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 8,
    },
    texthomebutton: {
        fontWeight: "bold",
        fontSize: 12,
        justifyContent: "center",
        alignSelf: "center"
    }
});
export default App;

