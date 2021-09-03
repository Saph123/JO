import styles from "./style";
import * as React from 'react';
import { View, TextInput, Text, Image, Linking } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { getValueFor, save, videoHandler, pushtoken } from './utils';
import { version } from "./App"

export function LoginScreen({ route, navigation }) {
    const [userName, setuserName] = React.useState("username");
    const [password, setpassword] = React.useState("password");
    const [videoVisible, setVideoVisible] = React.useState(false);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const controller = new AbortController()
    // 5 second timeout:
    React.useEffect(() => {
        getValueFor("username").then(r => setuserName(r));
        getValueFor("password").then(r => setpassword(r));
    }, []);
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    if (username == "") {
        return (
            <ScrollView style={{ flexDirection: "column", flex: 1 }}>
                {videoHandler(setVideoVisible, videoVisible, video, require('./assets/scep.mp4'), false)}
                <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>
                    <View style={{ flexDirection: "row", margin: 15 }}>
                        <TextInput autoCompleteType="username" style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100 }} onChangeText={text => { setuserName(text) }} value={userName}></TextInput>
                    </View>
                    <View style={{ flexDirection: "row", margin: 15 }}>
                        <TextInput onFocus={() => setpassword("")} autoCompleteType="password" secureTextEntry={true} style={{ textAlign: "center", borderWidth: 1, borderRadius: 15, height: 20, minWidth: 100 }} onChangeText={text => setpassword(text)} value={password}></TextInput>
                    </View>
                    <View style={{ margin: 30, flexDirection: "row" }}>

                        <TouchableOpacity style={{ width: 60, height: 30, borderRadius: 15, backgroundColor: "#ff8484", justifyContent: "center" }} title="Log in" onPress={() =>

                            fetch("http://91.121.143.104:7070/login", { signal: controller.signal, method: "POST", body: JSON.stringify({ "version": version, "username": userName, "password": password }) }).then(r => {
                                if (r.status == 200) {
                                    username = userName;
                                    pushtoken(route.params.pushtoken, userName);
                                    save("username", userName);
                                    save("password", password);
                                    navigation.navigate('HomeScreen', { refresh: "refresh" });
                                    return;
                                }
                                else {
                                    alert("Wrong login or password!");
                                    return;
                                }
                            }).catch((err) => { alert(err, "Issue with server!"); return })}>
                            <Text style={{ textAlign: "center", textAlignVertical: "center" }}>Login</Text>
                        </TouchableOpacity>
                    </View>

                </View >
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}>Brought to you by </Text></View>
                    <View style={{ alignItems: "center" }}><TouchableOpacity onPress={() => { setVideoVisible(true) }}>
                        <Image style={styles.logosah} source={require('./assets/logoSCEP.png')} />
                    </TouchableOpacity></View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Sponsors </Text></View>
                    {/* <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    </View> */}
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Image style={styles.logosah} source={require('./assets/sah.png')} />
                        <TouchableOpacity style={styles.logosah}
                            onPress={() => { { username = "" }; navigation.navigate('VanRommel', { refresh: "refresh" }) }}
                        >
                            <Image style={styles.logosah} source={require('./assets/vanrommel.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.biere-amsterdam.com/la-gamme/maximator/#')}>
                            <Image style={styles.logomaximator} source={require('./assets/maximator.png')} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>

                        <Image style={styles.logoalstom} source={require('./assets/alstom.png')} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <Image style={styles.logogaec} source={require('./assets/gaec.png')} />
                    </View>
                </View>
            </ScrollView >
        )
    }
    return (
        <ScrollView>
            {videoHandler(setVideoVisible, videoVisible, video, require('./assets/scep.mp4'), false)}
            <View style={{ flexDirection: "column", flex: 1, }}>
                <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>

                    <Text style={styles.texthomebutton}>Currently logged in as {username}</Text>
                    <TouchableOpacity style={styles.logoutbutton}
                        onPress={() => { { username = "" }; navigation.navigate('HomeScreen', { refresh: "refresh" }) }}
                    >
                        <Text style={styles.texthomebutton}>Log out!</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}>Brought to you by </Text></View>
                    <View style={{ alignItems: "center" }}><TouchableOpacity onPress={() => { setVideoVisible(true) }}>
                        <Image style={styles.logosah} source={require('./assets/logoSCEP.png')} />
                    </TouchableOpacity></View>
                    <View style={{ alignItems: "center" }}><Text style={styles.medailleText}> Sponsors </Text></View>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Image style={styles.logosah} source={require('./assets/sah.png')} />
                        <TouchableOpacity style={styles.logosah}
                            onPress={() => { { username = "" }; navigation.navigate('VanRommel', { refresh: "refresh" }) }}
                        >
                            <Image style={styles.logosah} source={require('./assets/vanrommel.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.biere-amsterdam.com/la-gamme/maximator/#')}>
                            <Image style={styles.logomaximator} source={require('./assets/maximator.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <Image style={styles.logoalstom} source={require('./assets/alstom.png')} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <Image style={styles.logogaec} source={require('./assets/gaec.png')} />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
};