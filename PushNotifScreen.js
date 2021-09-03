import styles from "./style.js"
import * as React from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { askPushNotif } from "./utils.js";

export function pushNotifScreen() {
    const [title, setTitle] = React.useState("Title (doit etre court)");
    const [body, setBody] = React.useState("Body");
    const [to, setTo] = React.useState("all ou username (e.g. Ugo)");
    const navigation = useNavigation();
    return (
        <View>
            <TextInput onFocus={() => setTitle("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setTitle(text); }} value={title}></TextInput>
            <TextInput onFocus={() => setBody("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setBody(text); }} value={body}></TextInput>
            <TextInput onFocus={() => setTo("")} style={{ textAlign: "center", borderRadius: 15, borderWidth: 1, height: 20, minWidth: 100, margin: 30 }} onChangeText={text => { setTo(text); }} value={to}></TextInput>
            <Pressable style={styles.logoutbutton} onPress={() => { askPushNotif(username, title, body, to); navigation.reset({ routes: [{ name: "HomeScreen" }] }) }} ><Text style={{ textAlign: "center" }}> Push!</Text></Pressable>
        </View>
    )
}