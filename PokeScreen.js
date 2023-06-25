import styles from "./style";
import * as React from 'react';
import * as Notifications from 'expo-notifications';
import { View, Text, Pressable, AppState } from 'react-native';
import { getPokeInfo, personView, sendPoke } from "./utils";
import { ActivityIndicator } from "react-native";

export function PokeScreen({ route }) {
    const [loading, setLoading] = React.useState(true);
    const [canSend, setCanSend] = React.useState(true)
    const [score, setScore] = React.useState(0)
    const notificationListener = React.useRef();

    React.useEffect(() => {
        getPokeInfo(route.params.username, route.params.other_user).then(info => {
            setCanSend(info["can_send"])
            setScore(info["score"])
        })
        setLoading(false)

        let timer = setInterval(() => {
            getPokeInfo(route.params.username, route.params.other_user).then(info => {
                setCanSend(info["can_send"])
                setScore(info["score"])
            })
            
        }, 100);

        return () => {
            clearInterval(timer)
        }


    }, []);
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            {personView(route.params.other_user)}
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Nombre de poke échangés: {score}</Text>
            <Pressable style={styles.killbutton} onPress={() => {
                if (canSend) {
                    sendPoke(route.params.username, route.params.other_user);
                    setCanSend(false);
                    setScore(score + 1)
                }
            }}>

                <Text style={{ textAlign: "center", fontWeight: "bold" }}>{canSend ? "Envoyer un poke" : "En attente de poke de sa part..."}</Text>
            </Pressable>
        </View>

    )

}