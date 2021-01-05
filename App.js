import * as React from 'react';
import { Button, View, Dimensions, ActivityIndicator, StyleSheet, TextInput, Text, Image, Modal } from 'react-native';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Table, Row } from 'react-native-table-component';
import { Svg, Polyline } from 'react-native-svg';
import beerpong_matches_json from './assets/Beerpong_matches.json';
import ventriglisse_matches_json from './assets/ventriglisse_match.json';
import matches_status from './assets/beerpong_status.json';
import matches_group from './assets/Beerpong_poules.json';
import beerpong_autho from './assets/Beerpong_autho.json';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import PinchZoomView from 'react-native-pinch-zoom-view';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation';
import { add } from 'react-native-reanimated';
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
let offline = true;
const ArbitreContext = React.createContext(false);
function HomeScreen({ route, navigation }) {
    if (username == "") {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                <View style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
                />
                <Text>Home Screen</Text>
                <Button style={styles.homebuttons} color="green" width={200}
                    title="Login!"
                    onPress={() => { navigation.navigate('Login') }}
                />
            </View>
        )
    }
    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
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
            <View style={{
                margin: 30,
            }}
            />
            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('Login') }}
            >
                <Text style={styles.texthomebutton}>Login</Text>
            </TouchableOpacity>
        </View>

    );
}
async function fetch_matches(sportname, setmatches, setgroups, setlevel, setPlayoff, setmatchesgroup) {

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
        matches = await fetch("http://109.24.229.111:7070/teams/" + sportname + "_matches.json").then(response => response.json()).then(data => { return data });
    }
    let level = [];
    let local_array_match = [[]];
    if (matches_status["status"] == "poules") // group phasis:
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
        setlevel(level)
        setmatches(local_array_match);
    }
}



function Login({ navigation }) {
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height / 2;
    const [userName, setuserName] = React.useState(null);
    const [password, setpassword] = React.useState(null);
    // console.log("0,0 0," + width / 2 + " 300," + width / 2)
    // let local_match = React.useState("");
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

                    fetch("http://109.24.229.111:7070/login", { method: "POST", body: JSON.stringify({ "username": userName, "password": password }) }).then(r => {
                        if (r.status == 200) {
                            username = userName; navigation.navigate('Home', { refresh: "refresh" })
                        }
                        else {
                            alert("Wrong login or password!")
                        }
                    })}>
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
};
function BeerpongDetailsScreen({ navigation }) {
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;
    const [window_width, setWidth] = React.useState(5000);
    const [window_height, setHeigth] = React.useState(5000);
    const [authorized, setauthorized] = React.useState(false);
    // console.log("0,0 0," + width / 2 + " 300," + width / 2)
    // let local_match = React.useState("");
    React.useEffect(() => {

        for (var authouser in beerpong_autho.autho) {
            if (beerpong_autho.autho[authouser] == username) {
                setauthorized(true);
            }
            setWidth(width);
            setHeigth(height);
        }
    }, []);
    return (
        <PinchZoomView style={{ position:'absolute', top:0,left:0, width: window_width * 5, height: window_width * 2, backgroundColor:"lightgrey",margin:0 }} maxScale={1} minScale={0.5} >
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

            {/* <ReactNativeZoomableView
   maxZoom={1.5}
   minZoom={0.5}
   zoomStep={0.5}
   initialZoom={1}
   bindToBorders={true}
   onZoomAfter={(event, gestureState, zoomableViewEventObject) => {
    console.log('');
    console.log('');
    console.log('-------------');
    console.log('Event: ', event);
    console.log('GestureState: ', gestureState);
    console.log('ZoomableEventObject: ', zoomableViewEventObject);
    console.log('');
    console.log(`Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`);
  }}
   style={{
      padding: 10,
      backgroundColor: 'red',
   }}
> */}
            {/* <ScrollView horizontal={true}> */}
            {/* <ScrollView> */}
            {/* <View styles={{}}> */}
            <Trace sport={"Beerpong"} autho={authorized} />
            {/* </View> */}

            {/* </ScrollView> */}
            {/* </ScrollView> */}
            {/* </ReactNativeZoomableView> */}
            {/* </ScrollView> */}
        </PinchZoomView>


    )
};

function LancerdeTongDetailsScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={{ flex: 6, color: 'red' }}>LancerdeTong!</Text>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                <Button color='red' title={hugeText} onPress={() => navigation.navigate('Home')} />
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
    console.log(matches)
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
                        <Text style={{ fontSize: 24, fontWeight: "bold" }}>{"vs"}</Text><Text style={r.over == 1 ? styles.lose : styles.teamnormal}>{r.team2}</Text><TextInput style={styles.score} value={score[index]} onChangeText={(text) => { array_score[index] = text; setScore(array_score) }} /><Button color='blue' title="hahahaha" onPress={() => alert("yo")} /></View>)
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
function determine_winner(match, index, setfun, score) {
    // TODO : add push function to json through raspi
    let tmp_array = JSON.parse(JSON.stringify(match));
    if (tmp_array[index].over != 0) {
        tmp_array[index].over = 0;
        setfun(tmp_array);
        return;
    }
    let scores = score[index].split(":");
    if (scores.length == 2) {
        console.log(scores[0], scores[1]);
        if (parseInt(scores[0]) > parseInt(scores[1])) {
            tmp_array[index].over = 1;
        }
        else if (parseInt(scores[0]) < parseInt(scores[1])) {
            tmp_array[index].over = 2;
        }
        else {
            alert("Either a tie, or not parsable. Score should be x:x")
        }
    }
    setfun(tmp_array);
    // return match;
}
const Matchpoule = (props) => {
    const matches = props.matches;
    const level = props.level;
    const autho = props.autho;
    const sport = props.sport;
    const [local_load, setLoading] = React.useState(true)
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
    if (autho) {
        return (
            <View style={styles.column}>
                {match.map((r, index) => {
                    return (<View style={r.over == 0 ? styles.matchpoule : styles.matchpouleover}>
                        <Text style={r.over == 2 ? styles.lose : styles.teamnormal}>{r.team1}</Text>
                        <Text>{"vs"}</Text><Text style={r.over == 1 ? styles.lose : styles.teamnormal}>{r.team2}</Text>
                        <View style={{ flexDirection: "row" }}>{manage_score_over(match, index, score, setScore)}</View>
                        <TouchableOpacity onPress={() => determine_winner(match, index, setMatch, score)}><Text>{over_text(match, index)}</Text></TouchableOpacity>
                    </View>)
                })}
            </View>
        );
    }
    return (
        <View style={styles.column}>
            {match_array.map((r, index) => {
                return (<View style={r.over == 0 ? styles.matchpoule : styles.matchpouleover}>
                    <Text style={r.over == 2 ? styles.lose : styles.teamnormal}>{r.team1}</Text>
                    <Text>{"vs"}</Text><Text style={r.over == 1 ? styles.lose : styles.teamnormal}>{r.team2}</Text><Text style={styles.score}>{score[index]}</Text></View>)
            })}
        </View>
    );


}
const Trace = (props) => {
    const sport = props.sport;
    const autho = props.autho
    const [loading, setloading] = React.useState(true);
    const [matches, setmatches] = React.useState([]);
    const [levels, setlevels] = React.useState([]);
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [playoff, setPlayoff] = React.useState(0);
    const [groups, setGroups] = React.useState([]);
    const [groupmatches, setmatchesgroup] = React.useState([]);
    // const width = Dimensions.get("window").width;
    // const height = Dimensions.get("window").height;
    // const widdth = window/equipe.length
    React.useEffect(() => {
        fetch_matches("Beerpong", setmatches, setGroups, setlevels, setPlayoff, setmatchesgroup).then(r => {
            setloading(false)
        });

        // setloading(false);
    }, []);
    // const array_level

    if (loading) {
        return (<ActivityIndicator />);
    }
    if (playoff) {
        return (
            <View test={console.log(levels)} onLayout={(event) => {
                var { x, y, width, height } = event.nativeEvent.layout;
                setWidth(width);
            }} style={{ flexDirection: 'column', alignItems: "center", justifyContent: "space-between"}}>
                <Svg style={styles.svg}>
                    {levels.slice(1).reverse().map((r, index) => matches[r].map((m, index2) =>
                        <Polyline style={{ position: "absolute" }}
                            points={(index2 * 2 + 1) * width / (matches[r].length * 2) + "," + ((index * height) + (height - 30)) + " " + (index2 * 2 + 1) * width / (matches[r].length * 2) + "," + ((index * height) + (height + (height - 30) / 2)) + " " + ((index2 * 4 + 1) * width / ((matches[r].length) * 4)) + "," + ((index * height) + (height + (height - 30) / 2)) + " " + ((index2 * 4 + 3) * width / ((matches[r].length) * 4)) + "," + ((index * height) + (height + (height - 30) / 2))}
                            fill="none"
                            stroke="black"
                            strokeWidth="3"
                        />))}
                </Svg>
                {levels.slice(0).reverse().map(r =>

                    <View test={console.log(r)} onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout;
                        setHeight(height);
                    }} style={{ flexDirection: 'row', alignItems: "stretch", justifyContent: "space-evenly" }}><Matchcomp loading={loading} matches={matches[r]} level={r} sport={sport} autho={autho}></Matchcomp></View>)}

            </View>
        );
    }
    return (


        <View style={{ flexDirection: "row" }}>
            {groups.map((r, index) =>
                <View style={styles.tablecontainer}>
                    <Text style={{ textAlign: "center" }}>{r.name}</Text>
                    <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                        <Row data={["Team", "P", "W", "L"]} widthArr={[150, 30, 30, 30]} style={{ width: "100%", height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ margin: 6 }}></Row>
                        {r.teams.map(q =>
                            <Row data={[q.name, q.played, q.wins, q.loses]} widthArr={[150, 30, 30, 30]} textStyle={{ margin: 6 }}></Row>)}
                    </Table>
                    <View style={{ flexDirection: "column" }}>
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


const Stack = createStackNavigator();
function App() {
    const [arbitre, setArbitre] = React.useState(false);
    return (
        <NavigationContainer>
            <ArbitreContext.Provider value={arbitre}>
                <Stack.Navigator screenOptions={{
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    // headerLeft:()=><Text style={{color:"white", textAlign:"center"}}>{username}</Text>,
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} initialRouteName="Home">
                    <Stack.Screen options={{ title: "Home", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}><Text style={{ color: "white", marginRight: 20, alignSelf: "center" }}>{username}</Text></View> }} name="Home" component={HomeScreen} />
                    <Stack.Screen options={{ title: "Login", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}><Text style={{ color: "white", marginRight: 20, alignSelf: "center" }}>{username}</Text></View> }} name="Login" component={Login} />
                    <Stack.Screen options={{ title: "Beerpong", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}><Text style={{ color: "white", marginRight: 20, alignSelf: "center" }}>{username}</Text><TouchableOpacity onPressIn={() => { setArbitre(true) }} onPressOut={() => setTimeout(() => { setArbitre(false) }, 1000)}><Image style={{ borderRadius: 15, width: 30, height: 30 }} source={require('./assets/sifflet.png')} /></TouchableOpacity></View> }} name="BeerpongDetails" component={BeerpongDetailsScreen} />
                    <Stack.Screen options={{ headerRight: () => <TouchableOpacity onPressIn={() => arbitre = true}><Image style={{ borderRadius: 15, width: 20, height: 20 }} source={require('./assets/sifflet.png')} /></TouchableOpacity> }} name="LancerdeTongDetails" component={LancerdeTongDetailsScreen} />
                    <Stack.Screen options={{ headerRight: () => <TouchableOpacity onPressIn={() => arbitre = true}><Image style={{ borderRadius: 15, width: 20, height: 20 }} source={require('./assets/sifflet.png')} /></TouchableOpacity> }} name="centmetreRicardDetails" component={centmetreRicardDetailsScreen} />
                    <Stack.Screen options={{ headerRight: () => <TouchableOpacity onPressIn={() => arbitre = true}><Image style={{ borderRadius: 15, width: 20, height: 20 }} source={require('./assets/sifflet.png')} /></TouchableOpacity> }} name="WaterpoloDetails" component={WaterpoloDetailsScreen} />
                    <Stack.Screen options={{ headerRight: () => <TouchableOpacity onPressIn={() => arbitre = true}><Image style={{ borderRadius: 15, width: 20, height: 20 }} source={require('./assets/sifflet.png')} /></TouchableOpacity> }} name="TrailDetails" component={TrailDetailsScreen} />
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
        width: 100,
        borderRadius: 15
    },
    match: {
        flexDirection: 'column',
        justifyContent: "space-between",
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
        alignItems: "center",
        margin: 30,
        width: 100,
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
    },
    column: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        margin: 50
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

        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        margin: 8,
        color: "red"
    },
    texthomebutton: {
        fontWeight: "bold",
        fontSize: 12,
    }
});
export default App;

