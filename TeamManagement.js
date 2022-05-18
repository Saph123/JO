import styles from "./style.js"
import * as React from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { eventView } from "./utils.js";
import { SportContext } from "./App";

export function teamMgmtScreen() {
    const navigation = useNavigation();
    return (
        <ScrollView>
            <SportContext.Consumer>
                {value =>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            {eventView([], [], "Trail", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Dodgeball", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Pizza", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Tong", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Babyfoot", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Flechette", navigation, value.setCurrentSport, "SportMgmtScreen")}
                        </View>
                        <View style={{ flex: 1 }}>
                            {eventView([], [], "PingPong", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Orientation", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Beerpong", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Volley", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Waterpolo", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Larmina", navigation, value.setCurrentSport, "SportMgmtScreen")}
                        </View>
                        <View style={{ flex: 1 }}>
                            {eventView([], [], "Natation", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "SpikeBall", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Ventriglisse", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "100mRicard", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Petanque", navigation, value.setCurrentSport, "SportMgmtScreen")}
                            {eventView([], [], "Molky", navigation, value.setCurrentSport, "SportMgmtScreen")}
                        </View>

                    </View>
                }
            </SportContext.Consumer>
        </ScrollView>
    )
}