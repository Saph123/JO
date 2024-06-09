import styles from "./style";
import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { getPalmares, eventView } from "./utils";
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
            <Text style={{ alignSelf: "center", fontSize: 30 }}>{route.params.username}</Text>
            <ScrollView>

                <SportContext.Consumer>
                    {value =>
                        <View key={value} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                            <View style={{ flex: 1 }}>
                                {
                                    Object.keys(palmares).map((sport) => {
                                        console.log(palmares[sport])
                                        return (
                                            eventView([], [], sport, navigation, value.setCurrentSport, "SportDetails", new Date("9999-12-31T23:59:99+02:00"), true)
                                        )
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
                                                <View style={{ flex: 1 }}>
                                                    <ScrollView>
                                                        <View key={value} style={{ flex: 1, alignItems: 'center', flexDirection: "row" }}>
                                                            {
                                                                Object.keys(palmares[sport]).map((year) => {
                                                                    return (
                                                                        <View style={{ flexDirection: "column", marginHorizontal: 10 }}>
                                                                            <View style={{ flex: 1}}>
                                                                                <Text>{year}</Text>
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