import * as React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { getValueFor } from './utils.js';

import { HomeScreen } from "./HomeScreen.js";
import { PlanningScreen } from "./PlanningScreen.js";
import { SummaryScreen } from "./SummaryScreen.js";
import { ClickerScreen } from "./ClickerScreen.js";
import { UsernameScreen } from "./UsernameScreen.js";
import { LastYearsResultsScreen } from "./LastYearsResultsScreen.js";
import { SportDetailsScreen } from "./SportDetailsScreen.js";
import { VanRommelScreen } from "./VanRommelScreen.js";
import { pushNotifScreen } from "./PushNotifScreen.js";
import { LoginScreen } from "./LoginScreen.js";

export let username = "";
export const ArbitreContext = React.createContext(false);
export const ChatContext = React.createContext(false);
export const SportContext = React.createContext(false);
export let version = 4
export let initialLineNumber = {
    "Trail": 0,
    "Dodgeball": 0,
    "Pizza": 0,
    "Tong": 0,
    "Babyfoot": 0,
    "Flechette": 0,
    "PingPong": 0,
    "Orientation": 0,
    "Beerpong": 0,
    "Volley": 0,
    "Waterpolo": 0,
    "Larmina": 0,
    "Natation": 0,
    "SpikeBall": 0,
    "Ventriglisse": 0,
    "100mRicard": 0,
    "Petanque": 0,
    "Molky": 0,
    "Clicker": 0,
    "Home": 0
};
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const Stack = createStackNavigator();
function App() {
    const [arbitre, setArbitre] = React.useState(false);
    const [chat, setChat] = React.useState(false);
    const [chatName, setChatName] = React.useState("");
    const [soundstatus, setSound] = React.useState();
    const [newMessage, setNewMessage] = React.useState(false);

    const [load, setLoad] = React.useState(true);

    const [currentSport, setCurrentSport] = React.useState("Sportname");
    async function playmegaphone() {
        if (soundstatus == undefined) {


            Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

            const { sound } = await Audio.Sound.createAsync(
                require('./assets/guylabedav.mp3')
            );
            setSound(sound);
            await sound.playAsync();

        }
        if (soundstatus != undefined) {
            var soundlocal = await soundstatus.getStatusAsync();

            if (soundlocal.isPlaying == true) {
                await soundstatus.stopAsync();

            }
            else {
                await soundstatus.stopAsync();
                await soundstatus.playAsync();
            }
        }

    }

    React.useEffect(() => {

        getValueFor("username").then(r => username = r);
        for (sport in initialLineNumber) {
        }
        getValueFor("initialLineNumber").then(r => { if (r != "") { initialLineNumber = JSON.parse(r) }; });
        setLoad(false);




    }, []);
    if (load) {
        return (
            <View></View>
        )
    }
    return (
        <NavigationContainer>
            <ArbitreContext.Provider value={arbitre}>
                <ChatContext.Provider value={{ chat: chat, setChat: setChat, chatName:chatName, setChatName:setChatName, setNewMessage: setNewMessage }}>
                    <SportContext.Provider value={{ setCurrentSport: setCurrentSport }}>
                        <Stack.Navigator screenOptions={{
                            headerStyle: {
                                backgroundColor: '#000',
                                height: 100
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }} initialRouteName="HomeScreen">
                            <Stack.Screen options={({ navigation }) => ({
                                title: "Home", headerRight: () => (
                                    <View style={{ flexDirection: "row", margin: 10 }}>
                                        <Pressable onPress={() => { setChat(true) }}>
                                            <Image style={{ borderRadius: 15, width: 30, height: 30, backgroundColor: "white", marginRight: 110, marginTop: 25, alignSelf:"center" }} source={newMessage ? require('./assets/chatnewmessage.png') : require('./assets/chat.png')} />
                                        </Pressable>
                                        <TouchableOpacity style={{ alignContent: "center", textAlignVertical: "center" }} onPress={() => { navigation.navigate('UsernameScreen') }}>
                                            <Text style={{ color: "white", marginTop: username == "Pierrick" ? 0 : 30, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={playmegaphone}>
                                            <Image style={{ borderRadius: 40, width: 20, height: 20, margin: 30 }} source={require('./assets/megaphone.png')} />
                                        </TouchableOpacity>
                                    </View>)
                            })} name="HomeScreen" component={HomeScreen} />

                            <Stack.Screen options={{
                                title: "Login", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}><Text style={{ color: "white", marginRight: 20, alignSelf: "center" }}>{username}</Text>
                                </View>
                            }} initialParams={{ pushtoken: "", username:username }} name="LoginScreen" component={LoginScreen} />

                            <Stack.Screen options={({ navigation }) => ({
                                title: "Planning", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}>
                                    <View><TouchableOpacity style={{ alignContent: "center", textAlignVertical: "center" }} onPress={() => { navigation.navigate('UsernameScreen') }}>
                                        <Text style={{ color: "white", margin: 10, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text>
                                    </TouchableOpacity></View></View>
                            })} initialParams={{ setCurrentSport: setCurrentSport }} name="PlanningScreen" component={PlanningScreen} />
                            <Stack.Screen options={({ navigation }) => ({
                                title: currentSport, headerRight: () =>
                                    <View style={{ flexDirection: "row", margin: 10 }}>
                                        <View><TouchableOpacity style={{ alignContent: "center", textAlignVertical: "center" }} onPress={() => { navigation.navigate('UsernameScreen') }}>
                                            <Text style={{ color: "white", margin: 10, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text>
                                        </TouchableOpacity></View>
                                        <Pressable onPress={() => { setChat(true)}}>
                                            <Image style={{ borderRadius: 15, width: 30, height: 30, backgroundColor: "white", marginRight: 10 }} source={newMessage ? require('./assets/chatnewmessage.png') : require('./assets/chat.png')} />
                                        </Pressable>
                                        <TouchableOpacity onPress={() => { setArbitre(true) }} onPressOut={() => setTimeout(() => { setArbitre(false) }, 3000)}>
                                            <Image style={{ borderRadius: 15, width: 30, height: 30 }} source={require('./assets/sifflet.png')} />
                                        </TouchableOpacity>
                                    </View>
                            })} initialParams={{ sportname: currentSport, username:username }} name="SportDetails" component={SportDetailsScreen} />
                            <Stack.Screen options={() => ({
                                title: "Tableau des médailles", headerRight: () => <View>
                                    <Pressable onPress={() => { setChat(true)}}>
                                        <Image style={{ borderRadius: 15, width: 30, height: 30, backgroundColor: "white", marginRight: 20 }} source={newMessage ? require('./assets/chatnewmessage.png') : require('./assets/chat.png')} />
                                    </Pressable>
                                </View>
                            })} name="SummaryScreen" component={SummaryScreen} />
                            <Stack.Screen options={() => ({
                                title: username
                            })} initialParams={{ setCurrentSport: setCurrentSport }} name="UsernameScreen" component={UsernameScreen} />
                            <Stack.Screen options={() => ({
                                title: username
                            })} initialParams={{ setCurrentSport: setCurrentSport }} name="2021" component={LastYearsResultsScreen} />

                            <Stack.Screen options={() => ({
                                title: "Notif tool"
                            })} initialParams={{ username: username }} name="pushNotifScreen" component={pushNotifScreen} />

                            <Stack.Screen options={({ navigation }) => ({
                                title: "Clicker!", headerRight: () => <View>
                                    <Pressable onPress={() => { setChat(true)}}>
                                        <Image style={{ borderRadius: 15, width: 30, height: 30, backgroundColor: "white", marginRight: 20 }} source={newMessage ? require('./assets/chatnewmessage.png') : require('./assets/chat.png')} />
                                    </Pressable>
                                </View>
                            })} initialParams={{ username: username }} name="ClickerScreen" component={ClickerScreen} />
                            <Stack.Screen options={() => ({
                                title: "Van Rommel"
                            })} name="VanRommel" component={VanRommelScreen} />

                        </Stack.Navigator>
                    </SportContext.Provider>
                </ChatContext.Provider>
            </ArbitreContext.Provider>
        </NavigationContainer>
    );
};

export default App;

