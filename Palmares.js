import styles from "./style";
import * as React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { getPalmares, lutImg } from "./utils";
import { ActivityIndicator } from "react-native";
import { SportContext } from "./global.js"
import { ScrollView } from "react-native-gesture-handler";

export function Palmares({ route, navigation }) {
    const [loading, setLoading] = React.useState(true);
    const [palmares, setPalmares] = React.useState([]);
    React.useEffect(() => {
        getPalmares(route.params.username, setPalmares)
        setLoading(false)
    }, []);
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    //console.log(palmares)
    return (
        <View style={{ flex: 15 }}>
            <View style={{ borderBottomWidth: 2, borderColor: "black" }}>
                <Text style={{ alignSelf: "center", fontSize: 30 }}>{route.params.username}</Text>
            </View>
            <ScrollView>

                <SportContext.Consumer>
                    {value =>
                        <View key={value} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                            <View style={{ flex: 1 }}>
                                {
                                    Object.keys(palmares).map((sport) => {
                                        console.log(palmares[sport])
                                        return (
                                            <View key={sport} style={{ flex: 1, margin: -1, flexDirection: "row", borderColor: "black", borderWidth: 2, borderTopWidth: 0, justifyContent: "flex-start", maxHeight: 80 }}>
                                                <View style={{ flex: 1, justifyContent: "center" }}>
                                                    <Pressable style={[styles.homebuttons]}>
                                                        <Image style={[styles.sportimage, { tintColor: "black" }]} resizeMode="contain" resizeMethod="auto" source={lutImg(sport)} />
                                                    </Pressable>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignSelf: "center" }}><Text>{sport}</Text></View>
                                            </View>)
                                    }
                                    )
                                }
                            </View>
                            <View style={{ flex: 1 }}>
                                <View key={value} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: "column" }}>

                                    {
                                        Object.keys(palmares).map((sport) => {
                                            console.log(palmares[sport])
                                            return (
                                                <View key={sport} style={{ flex: 1, borderWidth: 2, marginBottom: -1, borderTopWidth: 0, width: "100%" }}>
                                                    <ScrollView horizontal={true}>
                                                        <View key={value} style={{ flex: 1, alignItems: 'center', flexDirection: "row" }}>
                                                            {
                                                                Object.keys(palmares[sport]).map((year) => {
                                                                    return (
                                                                        <View key={sport + year} style={{ flexDirection: "column", marginHorizontal: 10 }}>
                                                                            <View style={{ flex: 1, justifyContent: "center" }}>
                                                                                <Text style={{ fontWeight: "bold" }}>{year}</Text>
                                                                                <Image style={{ alignSelf: "center" }} resizeMode="cover" resizeMethod="resize" source={
                                                                                    palmares[sport][year] == 3 ? require('./assets/bronze.png') : palmares[sport][year] == 2 ? require('./assets/argent.png') : require('./assets/or.png')} />

                                                                            </View>
                                                                        </View>
                                                                    )
                                                                })
                                                            }
                                                        </View>
                                                    </ScrollView>
                                                </View>

                                            )
                                        }
                                        )
                                    }

                                </View>
                            </View>
                        </View>
                    }
                </SportContext.Consumer>
            </ScrollView>
        </View>

    )

}