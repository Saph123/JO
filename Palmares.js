import styles from "./style";
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { getPokeInfo, personView, sendPoke } from "./utils";
import { ActivityIndicator } from "react-native";

export function Palmares({ route }) {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(false)
    }, []);
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <View>
            <Text>{route.params.username}</Text>
        </View>

    )

}