import styles from "./style.js"
import * as React from 'react';
import { View, TextInput, Text, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { askPushNotif, getOnlinePersons, getValueFor } from "./utils.js";

export function PushNotifScreen() {
    const [title, setTitle] = React.useState("Title (doit etre court)");
    const [username, setUsername] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [body, setBody] = React.useState("Body");
    const [to, setTo] = React.useState("all ou username (e.g. Ugo)");
    const [online, setOnline] = React.useState([])
    const navigation = useNavigation();
    React.useEffect(() => {
        getValueFor("username").then(r => { setUsername(r) });
        var life_interval = setInterval(() => {
            getOnlinePersons().then(data => {
                setOnline(data)
            })
        }, 1000);
        setLoading(false)
        return () => {
            clearInterval(life_interval);
        }
    }, []);
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <View>

            <TextInput onFocus={() => setTitle("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setTitle(text); }} value={title}></TextInput>
            <TextInput onFocus={() => setBody("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setBody(text); }} value={body}></TextInput>
            <TextInput onFocus={() => setTo("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setTo(text); }} value={to}></TextInput>
            <Pressable style={styles.logoutbutton} onPress={() => { askPushNotif(username, title, body, to); navigation.reset({ routes: [{ name: "HomeScreen" }] }) }} ><Text style={{ textAlign: "center" }}> Push!</Text></Pressable>
            <Text style={{textAlign: "center", fontWeight: "bold"}}>Online:</Text>
            {online.map(r => {
                {
                    return(<Text key={r.name} style={{textAlign: "center"}}>{r.name}</Text>)
                }
            })}
        </View >
    )
}