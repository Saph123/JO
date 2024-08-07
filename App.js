import * as React from 'react';
import { View, Text, Image, Pressable, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { getValueFor, lock_unlock, vibrateLight, fetchPlanning } from './utils.js';

import { HomeScreen } from "./HomeScreen.js";
import { SummaryScreen } from "./SummaryScreen.js";
import { LastYearsResultsScreen } from "./LastYearsResultsScreen.js";
import { SportDetailsScreen } from "./SportDetailsScreen.js";
import { CanvaScreen } from "./CanvaScreen.js";
import { ProfilScreen} from './ProfilScreen.js';
import { PushNotifScreen } from "./PushNotifScreen.js";
import { LoginScreen } from "./LoginScreen.js";
import { ShifumiScreen } from "./ShifumiScreen.js";
import { KillerScreen } from "./Killer.js";
import { RangementScreen } from './RangementScreen.js';
import { Planning } from "./planning.js";
import { SportContext, ArbitreContext, ChatContext, calcInitLines, adminlist } from "./global.js"
LogBox.ignoreAllLogs();
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
    const [username, setUsername] = React.useState("");
    const [planning, setPlanning] = React.useState(new Planning());
    const [chat, setChat] = React.useState(false);
    const [chatName, setChatName] = React.useState("");
    const [soundstatus, setSound] = React.useState();
    const [newMessage, setNewMessage] = React.useState(false);
    const [lock, setLock] = React.useState(false);
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
        getValueFor("username").then(r => {
            setUsername(r)
        });
        var planningFetched = false;
            fetchPlanning().then(response => {
                setPlanning(new Planning(response));
                setLoad(false) ;
                planningFetched=true;
            }).catch(r => console.log(r));
        calcInitLines();
        // fetching planning
    }, [username]);
    if (load) {
        return (
            <View style={{flex:1, selfAlign:'center', justifyItems:'center'}}><Text> Bug loading??</Text></View>
        )
    }
    return (
        <NavigationContainer>
            <ArbitreContext.Provider value={arbitre}>
                <ChatContext.Provider value={{ chat: chat, setChat: setChat, chatName: chatName, setChatName: setChatName, setNewMessage: setNewMessage }}>
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
                                            <Image style={{ borderRadius: 15, width: 30, height: 30, backgroundColor: "white", marginRight: 110, marginTop: 25, alignSelf: "center" }} source={newMessage ? require('./assets/chatnewmessage.png') : require('./assets/chat.png')} />
                                        </Pressable>
                                        <TouchableOpacity style={{ alignContent: "center", textAlignVertical: "center" }} onPress={() => { navigation.navigate('LoginScreen') }}>
                                            <Text style={{ color: "white", marginTop: username == "Pierrick" ? 0 : 30, alignSelf: "center", textAlignVertical: "center" }}>{username}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={playmegaphone}>
                                            <Image style={{ borderRadius: 40, width: 20, height: 20, margin: 30 }} source={require('./assets/megaphone.png')} />
                                        </TouchableOpacity>
                                    </View>)
                            })} initialParams={{ username: username, planning:planning, refresh: "" }} name="HomeScreen" component={HomeScreen} />

                            <Stack.Screen options={{
                                title: "Login", headerRight: () => <View style={{ flexDirection: "row", margin: 10 }}><Text style={{ color: "white", marginRight: 20, alignSelf: "center" }}>{username}</Text>
                                </View>
                            }} initialParams={{ pushtoken: "", planning:planning, username: username, setUsername: setUsername }} name="LoginScreen" component={LoginScreen} />

                            <Stack.Screen options={({ navigation }) => ({
                                title: currentSport, headerRight: () =>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ flex: 1, marginRight: 15 }}>
                                            <Pressable onPress={() => { vibrateLight();setChat(true) }}>
                                                <Image style={{ borderRadius: 15, width: 30, height: 30, backgroundColor: "white", }} source={newMessage ? require('./assets/chatnewmessage.png') : require('./assets/chat.png')} />
                                            </Pressable>
                                        </View>
                                        {adminlist.includes(username) ?<View style={{ flex: 1, marginRight: 15 }}>
                                            <Pressable onPress={() => { lock_unlock(lock, setLock, currentSport) }}>
                                                <Image style={{ borderRadius: 15, width: 30, height: 30, backgroundColor: "white" }} resizeMethod="auto" resizeMode='cover' source={lock ? require('./assets/lock.png') : require('./assets/unlock.png')} />
                                            </Pressable>
                                        </View> : <View></View>}

                                        <View style={{ flex: 1, marginRight: 15 }}>
                                            <TouchableOpacity onPress={() => { setArbitre(true) }} onPressOut={() => setTimeout(() => { setArbitre(false) }, 3000)}>
                                                <Image style={{ borderRadius: 15, width: 30, height: 30 }} source={require('./assets/sifflet.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                            })} initialParams={{ sportname: currentSport, username: username, setLock:setLock }} name="SportDetails" component={SportDetailsScreen} />
                            <Stack.Screen options={() => ({
                                title: "Tableau des médailles", headerRight: () => <View>
                                    <Pressable onPress={() => { vibrateLight();setChat(true) }}>
                                        <Image style={{ borderRadius: 15, width: 30, height: 30, backgroundColor: "white", marginRight: 20 }} source={newMessage ? require('./assets/chatnewmessage.png') : require('./assets/chat.png')} />
                                    </Pressable>
                                </View>
                            })} name="SummaryScreen" component={SummaryScreen} />
                            <Stack.Screen options={() => ({
                                title: username
                            })} initialParams={{ username: username, setCurrentSport: setCurrentSport }} name="2023" component={LastYearsResultsScreen} />

                            <Stack.Screen options={() => ({
                                title: "Notif tool"
                            })} initialParams={{ username: username }} name="pushNotifScreen" component={PushNotifScreen} />

                            <Stack.Screen options={() => ({
                                title: "ShiFuMi"
                            })} initialParams={{ username: username }} name="ShifumiScreen" component={ShifumiScreen} />
                            <Stack.Screen options={() => ({
                                title: "Killer"
                            })} initialParams={{ username: username }} name="KillerScreen" component={KillerScreen} />
                            <Stack.Screen options={() => ({
                                title: "Profil"
                            })} initialParams={{ username: username}} name="Profil" component={ProfilScreen} />
                            <Stack.Screen options={() => ({
                                title: "Rangement"
                            })} initialParams={{ username: username}} name="Rangement" component={RangementScreen} />

                            <Stack.Screen options={() => ({
                                title: "Canva", headerRight: () => <View>
                                <Pressable onPress={() => { vibrateLight();setChat(true) }}>
                                    <Image style={{ borderRadius: 15, width: 30, height: 30, backgroundColor: "white", marginRight: 20 }} source={newMessage ? require('./assets/chatnewmessage.png') : require('./assets/chat.png')} />
                                </Pressable>
                            </View>
                            })} name="CanvaScreen" initialParams={{ username: username }} component={CanvaScreen} />


                        </Stack.Navigator>
                    </SportContext.Provider>
                </ChatContext.Provider>
            </ArbitreContext.Provider>
        </NavigationContainer >
    );
};

export default App;

