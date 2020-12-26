import * as React from 'react';
import { Button, View, FlatList, Dimensions, ActivityIndicator, StyleSheet, TextInput, Text } from 'react-native';
import { NavigationContainer, useNavigation, useNavigationParam } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render } from 'react-dom';
import { Svg, Rect, Circle, Path, Line, Polyline } from 'react-native-svg';
import { setStatusBarHidden } from 'expo-status-bar';
import matches_json from './assets/Beerpong_matches.json';
import { ScrollView } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation';
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
let arraymatch = [];
function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <View style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
            }}
            />
            <Text>Home Screen</Text>
            <Button style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}
                title="Beerpong"
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            />

            <View style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
            }}
            />
            <Button style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}
                title="LancerdeTong"
                onPress={() => navigation.navigate('LancerdeTongDetails')}
            />
            <View style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
            }}
            />
            <Button style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}
                title="Waterpolo"
                onPress={() => navigation.navigate('WaterpoloDetails')}
            />
            <View
                style={{
                    borderLeftWidth: 1,
                    borderLeftColor: 'black',
                }}
            />
            <View style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
            }}
            />
            <Button style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}
                title="centmetreRicard"
                onPress={() => { navigation.navigate('centmetreRicardDetails') }}
            />
            <View style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
            }}
            />
            <Button style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}
                title="Trail"
                onPress={() => fetch_matches("Beerpong")} />
        </View>
    );


}
async function fetch_matches(sportname, setfunc, setlevel) {

    // let matches = await fetch("http://localhost:7070/teams/" + sportname + "_matches.json").then(response => response.json()).then(data => { return data });
    let matches = matches_json;
    let level = [];
    let local_array_match = [[]];
    for (let j = 0; j < await matches['levels']; j++) {
        level.push(j);
        local_array_match.push([]); // need to be initiliazed or doesnt work ffs...
    }

    for (const prop in await matches) {
        for (const match_iter in matches[prop]) {
            local_array_match[matches[prop][match_iter]["level"]].push(new Match(sportname, matches[prop][match_iter]["team1"], matches[prop][match_iter]["team2"], matches[prop][match_iter]["match"], matches[prop][match_iter]["score"], matches[prop][match_iter]["over"], matches[prop][match_iter]["level"]));
        }
    }
    setlevel(level)
    setfunc(local_array_match);
}

function get_arraymatch(sport) {
    let currentSportTeams = []
    for (const sports of arraymatch) {
        if (sports.sportname == sport)
            currentSportTeams.push(sports);
    };


    return (currentSportTeams)
}

// function tick() {
//     const element = (
//       <div>
//         <h1>Hello, world!</h1>
//         <h2>It is {new Date().toLocaleTimeString()}.</h2>
//       </div>
//     );
//     render(
//       element,
//       document.getElementById('root')
//     );
//   }

//   setInterval(tick, 1000);

function BeerpongDetailsScreen({ navigation }) {
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height / 2;
    console.log("0,0 0," + width / 2 + " 300," + width / 2)
    // let local_match = React.useState("");
    return (
<View style={{flex:1}}>
        <ScrollView>
            <View >
                <Trace style={{ position: 'absolute', top: 0, left: 0, height: { height } }} sport={"Beerpong"} />
            </View>
        </ScrollView>
        </View>
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
let obj;
function centmetreRicardDetailsScreen({ navigation }) {
    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        </View>
    );
}



const Matchcomp = (props) => {
    const matches = props.matches;
    const level = props.level;
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
    return (
        <View style={styles.line}>
            {match_array.map((r, index) => {
                return (<View style={r.over == 0 ? styles.match : styles.matchover}>
                    <Text style={r.over == 2 ? styles.lose : styles.teamnormal}>{r.team1}</Text>
                    <Text>{"vs"}</Text><Text style={r.over == 1 ? styles.lose : styles.teamnormal}>{r.team2}</Text><TextInput style={styles.score} value={score[index]} onChangeText={(text) => { array_score[index] = text; setScore(array_score) }} /></View>)
            })}
        </View>
    );

}
const Trace = (props) => {
    const sport = props;
    const [loading, setloading] = React.useState(true);
    const [matches, setmatches] = React.useState([]);
    const [levels, setlevels] = React.useState([]);
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    // const width = Dimensions.get("window").width;
    // const height = Dimensions.get("window").height;
    // console.log(height);
    // console.log(width);
    // const widdth = window/equipe.length
    React.useEffect(() => {
        fetch_matches("Beerpong", setmatches, setlevels).then(r => {
            setloading(false)
        });

        // setloading(false);
    }, []);
    // const array_level

    if (loading) {
        return (<ActivityIndicator />);
    }
    return (
        <View onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            setWidth(width);
        }} style={{ flexDirection: 'column', alignItems: "center", justifyContent: "space-between" }}>
            {levels.slice(0).reverse().map((r, index) => {matches[r].map((m,index) => 
            <Svg style={styles.svg}>
                <Polyline test={console.log(index)} style={{ position: "absolute" }}
                    points={width /2 + "," + (height - 30) + " " + width / 2 + "," + (height + (height - 30) / 2) + " " + (width/2) + "," + (height + (height - 30) / 2) + " " + (width-200) + "," + (height + (height - 30) / 2)}
                    fill="none"
                    stroke="black"
                    strokeWidth="5"
                />
                {/* <Polyline style={{ position: "absolute" }}
                    points={(width / 4 + 30) + "," + (height + (height - 30) / 2) + " " + width / 4 + "," + (height + (height - 30) / 2) + " " + width / 4 + "," + (2 * height + (height - 30) / 2) + " " + (100) + "," + (2 * height + (height - 30) / 2) + " " + (300) + "," + (2 * height + (height - 30) / 2)}
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                />
                <Polyline style={{ position: "absolute" }}
                    points={(3 * width / 4 - 30) + "," + (height + (height - 30) / 2) + " " + 3 * width / 4 + "," + (height + (height - 30) / 2) + " " + 3 * width / 4 + "," + (2 * height + (height - 30) / 2) + " " + (width-300) + "," + (2 * height + (height - 30) / 2) + " " + (width-100) + "," + (2 * height + (height - 30) / 2)}
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                /> */}
            </Svg>)})}
            {levels.slice(0).reverse().map(r => 
            
            <View onLayout={(event) => {
                var { x, y, width, height } = event.nativeEvent.layout;
                setHeight(height);
            }} style={{ flexDirection: 'row', alignItems: "stretch", justifyContent: "space-evenly" }}><Matchcomp loading={loading} matches={matches[r]} level={r} sport={sport}></Matchcomp></View>)}

        </View>
    );
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
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="BeerpongDetails" component={BeerpongDetailsScreen} />
                <Stack.Screen name="LancerdeTongDetails" component={LancerdeTongDetailsScreen} />
                <Stack.Screen name="centmetreRicardDetails" component={centmetreRicardDetailsScreen} />
                <Stack.Screen name="WaterpoloDetails" component={WaterpoloDetailsScreen} />
                <Stack.Screen name="TrailDetails" component={TrailDetailsScreen} />
            </Stack.Navigator>
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
    
    matchover: {
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#D62628",
        borderWidth: 1,
        marginLeft: 30,
        marginRight: 30,
        width: 100,
        // maxWidth: 200,
        // height:500
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
        // width:"100%"
        // maxWidth: 200
    },
    textmatch: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: "calibri",
        // maxWidth: 200,
        width: "100%"
    },
    teamnormal: {
        textAlign: "center",
        width: "100%",
        fontFamily: "Roboto",
        fontSize: 16,
        // maxWidth: 200,
    },
    lose: {
        textAlign: "center",
        width: "100%",
        // backgroundColor:"grey",
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
        flex:1,
        flexDirection: "row",
        justifyContent:"space-around",
        marginBottom: 30,
        // alignSelf: "center",
        // alignItems: "center",
        // alignContent: "center",
        // backgroundColor: "grey",
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
        // alignSelf: "flex-end",
        textAlign: "center",
        borderColor: "black",
        borderWidth: 1
    },
    svg: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        // zIndex:0
    },
});
export default App;

