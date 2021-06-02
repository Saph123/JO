// import styles from "./style";
import * as React from 'react';
import { Button, View, Dimensions, ActivityIndicator, TextInput, Text, Image, Modal, Alert } from 'react-native';
import { NavigationContainer, useNavigation, useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Table, Row } from 'react-native-table-component';
import ventriglisse_matches_json from './assets/ventriglisse_match.json';
import matches_status from './assets/Beerpong_status.json';
import beerpong_autho from './assets/Beerpong_autho.json';
import PinchZoomView from 'react-native-pinch-zoom-view';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import CountDown from 'react-native-countdown-component';
import {Planning, getNextEventseconds} from "./planning.js";
import {Trace, GetState, fetch_status} from "./trace.js";
// import Orientation from 'react-native-orientation';

let username = "max";
let offline = true;
const styles = require("./style.js");
let toggle = 0;
const ArbitreContext = React.createContext(false);
function HomeScreen({ route, navigation }) {
    const [sound, setSound] = React.useState();
    const [loading, setLoading] = React.useState(1);
    const [soundStatus, setSoundStatus] = React.useState();
    const [secondsleft, setSecondsleft] = React.useState(1000);
    React.useEffect(() => {
        var dateJO = new Date('2021-08-26T20:00:00');
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

        <ScrollView>
            <View>
            <CountDown
            style={{color:"black"}} 
            digitStyle={{backgroundColor:"#FF8484"}}
        until={secondsleft}
        onFinish={() => alert('finished')}
        onPress={() => alert('hello')}
        size={20}
      />
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection:"row" }}>
        <View style={{ flex: 1}}>
        <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/run.png')} />
            </TouchableOpacity>
        <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/dodgeball.png')} />
            </TouchableOpacity>
        <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/pizza.png')} />
            </TouchableOpacity>
        <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/tong.png')} />
            </TouchableOpacity>
        <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/babyfoot.png')} />
            </TouchableOpacity>
        <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="center" resizeMethod="auto" source={require('./assets/sports/flechette.png')} />
            </TouchableOpacity>

        </View>
        <View style={{ flex: 1 }}>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/pingpong.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/orientation.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/beerpong.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/volley.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/waterpolo.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/polishhorseshoe.png')} />
            </TouchableOpacity>

        </View>
        <View style={{ flex: 1 }}>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/natationsynchro.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/spikeball.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/100mricard.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/100mricard.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/petanque.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.homebuttons}
                onPress={() => { navigation.navigate('BeerpongDetails') }}
            >
                <Image style={styles.sportimage} resizeMode="contain" resizeMethod="auto" source={require('./assets/sports/petanque.png')} />
            </TouchableOpacity>

        </View>

        </View>

        <View>
        <TouchableOpacity style={{ alignSelf:"center"}}onPressIn={() => { playSound(sound, soundStatus, setSound, setSoundStatus, "cluedo") }}>
                <Image style={{borderRadius:10, borderWidth:1, borderColor:"black"}} source={require('./assets/cluedo.png')} />
                </TouchableOpacity>
            <TouchableOpacity style={styles.loginbutton}
                onPress={() => { navigation.navigate('Login') }}
            >
                <Text style={styles.texthomebutton}>Login</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>

    );
}


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
        <View>
        <PinchZoomView style={{ position: 'absolute', backgroundColor: "lightgrey", top: 0, left: 0, width: window_width, height: window_height}} toggle={toggle} maxScale={1} minScale={0.5} >
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

            <Trace local_toggle={local_toggle} toggle={toggle} setToggle={setToggle} sport={"Beerpong"} setWidth={(w) => setWidth(w)} setHeight={(h) => setHeight(h)} autho={authorized} />
        </PinchZoomView>
        </View>


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
};

export default App;

