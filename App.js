import * as React from 'react';
import { Button, View, FlatList, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation, useNavigationParam } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render } from 'react-dom';
import { Svg, Rect, Circle, Path, Line, Text, Polyline } from 'react-native-svg';
import { TextInput } from 'react-native-gesture-handler';
import { setStatusBarHidden } from 'expo-status-bar';
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

    let matches = await fetch("http://localhost:7070/teams/" + sportname + "_matches.json").then(response => response.json()).then(data => { return data });
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
    const height = Dimensions.get("window").height/2;
console.log("0,0 0,"+width/2+" 300,"+width/2)
    // let local_match = React.useState("");
    return (


        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
            <Trace style={{position:'absolute',top: 0, left: 0, height:{height}}} sport={"Beerpong"} />
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Button style={{ width: "100", height: "50", alignItems: "center" }} color='red' title="back to menu" onPress={() => navigation.navigate('Home')} />
            </View>
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
    const [score, setScore] = React.useState([]);
    const match_array = [];
    // console.log(matches.then(r => console.log("yourmom")));
    const array_score = [];
    for (var i = 0; i < matches.length; i++) {

        if (matches[i]['level'] == level) {

            match_array.push(matches[i]);
            array_score.push(matches[i].score);
        }
    }
    
    React.useEffect(() => {
        setScore(array_score);
    }, [])


    return (
        <View style={styles.line}>
            {match_array.map((r, index) => {
                return (<View style={r.over == 0 ? styles.match : styles.matchover}>
                    <Text style={r.over ==2 ? styles.lose : styles.teamnormal}>{r.team1}</Text><Text style={r.over == 1? styles.lose:styles.teamnormal}>{r.team2}</Text><TextInput style={styles.score} onChangeText={text => { console.logarray_score[0] = text; setScore(array_score) }} value={text}/></View>)
            })}
            {/* <Svg style={styles.svg}>
            <Polyline 
               points={"0,50 30,50 30,200 30,50 300,50"}
               fill="none"
               stroke="black"
               strokeWidth="3"
               /> 
             </Svg> */}
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
        fetch_matches("Beerpong", setmatches, setlevels).then(r => setloading(false));
        // setloading(false);
    }, []);
    // const array_level

    if (loading) {
        return (<ActivityIndicator />);
    }
    return (
        <View onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
            setWidth(width);
          }} style={{ flexDirection: 'column', alignItems: "center", justifyContent: "space-between" }}>
            {levels.slice(0).reverse().map(r => <View onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
            setHeight(height);
          }}  style={{ flexDirection: 'row', alignItems: "stretch", justifyContent: "space-evenly" }}><Matchcomp matches={matches[r]} level={r} sport={sport}></Matchcomp></View>)}
            <Svg style={styles.svg}>
                <Polyline style={{position:"absolute"}}
                    points={width/2+","+(height-30)+" "+width/2+","+(height + (height-30)/2)+" "+(width/2 -30)+","+(height + (height-30)/2)+" "+(width/2 +30)+","+(height + (height-30)/2)}
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                />
                <Polyline style={{position:"absolute"}}
                    points={(width/4+30)+","+(height + (height-30)/2)+" "+width/4+","+(height + (height-30)/2)+" "+width/4+","+(2*height + (height-30)/2)+" "+(width/4 -30)+","+(2*height + (height-30)/2)+" "+(width/4 +30)+","+(2*height + (height-30)/2)}
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                />
                <Polyline style={{position:"absolute"}}
                    points={(3*width/4-30)+","+(height + (height-30)/2)+" "+3*width/4+","+(height + (height-30)/2)+" "+3*width/4+","+(2*height + (height-30)/2)+" "+(3*width/4 -30)+","+(2*height + (height-30)/2)+" "+(3*width/4 +30)+","+(2*height + (height-30)/2)}
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                />
            </Svg>
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
    match: {
        flexDirection: 'column',
        justifyContent: "space-between",
        backgroundColor: "#2A9D8F",
        borderWidth: 1,
        alignItems: "stretch",
        marginLeft: "30px",
        marginRight: "30px",
        fontFamily: "cochin",
        textShadowColor: '#2A9D8F',
        textShadowOffset: { width: 5, height: 5 },
        textShadowRadius: 10,
        minWidth: "100px",
        maxWidth: "200px"
    },
    textmatch: {
        textAlign: "center",
        fontSize: "12px",
        maxWidth: "200px"
    },
    teamnormal: {
        textAlign: "center",
        fontSize: "16px",
        maxWidth: "200px",
    },
    lose: {
        textAlign: "center",
        fontSize: "12px",
        maxWidth: "200px",
        // backgroundColor:"grey",
        color:"grey",
        textDecorationLine:"line-through",
        fontSize:"16px"
    },

    matchover: {
        flexDirection: 'column',
        alignItems: "center",

        justifyContent: "space-between",
        backgroundColor: "#D62628",
        borderWidth: 1,
        marginLeft: "30px",
        marginRight: "30px",
        fontFamily: "cochin",
        textShadowColor: '#D62628',
        textShadowOffset: { width: 5, height: 5 },
        textShadowRadius: 10,
        minWidth: "100px",
        maxWidth: "200px"
    },
    middle: {
        flex: 0.3,
        backgroundColor: "beige",
        borderWidth: 5,
    },
    line: {
        flexDirection: "row",
        marginBottom: "30px",
        alignSelf: "center",
        alignItems: "center",
        alignContent: "center",
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
        textAlign: "justify"
    },
    score: {
        // alignSelf: "flex-end",
        textAlign: "center",
        borderColor:"black",
        borderWidth:1
    },
    svg: {
        position:"absolute",
        top:0,
        left:0,
        width:"100%",
        height:"100%"
    },
});
export default App;

