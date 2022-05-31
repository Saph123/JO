import styles from "./style";
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { View, ScrollView, ActivityIndicator, Text, Modal, RefreshControl } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
import { Trace } from "./trace.js";
import { modalChat, fetchChat, fetch_matches } from './utils.js';
import { ChatContext, ArbitreContext, username } from "./App.js";

export function SportDetailsScreen({ route }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const [loadingmain, setloading] = React.useState(true);
    const [statusArbitre, setArbitreRule] = React.useState({ arbitre: "error", statusArbitre: "error" });
    const [regle, setRegle] = React.useState(false);
    const [chatText, setChatText] = React.useState("");
    const [localText, setLocalText] = React.useState("");
    const [matches, setmatches] = React.useState([]);
    const [levels, setlevels] = React.useState([]);
    const [liste, setListe] = React.useState([]);
    const [final, setFinal] = React.useState([])
    const [realListe, setRealListe] = React.useState([])
    const [seriesLevel, setSeriesLevel] = React.useState([0])
    const [groups, setGroups] = React.useState([]);
    const [groupmatches, setmatchesgroup] = React.useState([]);
    const [autho, setAutho] = React.useState(false);
    const navigation = useNavigation();
    const all_teams = {};
    all_teams.matches = matches;
    all_teams.levels = levels;
    all_teams.liste = liste;
    all_teams.final = final;
    all_teams.realListe = realListe;
    all_teams.seriesLevel = seriesLevel;
    all_teams.groups = groups;
    all_teams.groupmatches = groupmatches;
    all_teams.autho = autho;
    all_teams.setmatches = setmatches;
    all_teams.setlevels = setlevels;
    all_teams.setListe = setListe;
    all_teams.setFinal = setFinal;
    all_teams.setRealListe = setRealListe;
    all_teams.setSeriesLevel = setSeriesLevel;
    all_teams.setGroups = setGroups;
    all_teams.setmatchesgroup = setmatchesgroup;
    all_teams.setAutho = setAutho;
    all_teams.status = statusArbitre;

    const chatcontext = React.useContext(ChatContext);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setloading(true);
        console.log("rfresh");
        fetch_matches(true, null, route.params.username, setAutho, setArbitreRule, setArbitreRule, route.params.sportname, setmatches, setGroups, setlevels, setmatchesgroup, setListe, setFinal, setRealListe, setSeriesLevel).then(r => {
        
            setloading(false);
        });
        setRefreshing(false);
    }, []);
    React.useEffect(() => {
        chatcontext.setChatName(route.params.sportname);
        var chatInterval = setInterval(() => fetchChat(route.params.sportname, setChatText, chatcontext.setNewMessage), 3000);
        fetch_matches(true, null, route.params.username, setAutho, setArbitreRule, setArbitreRule, route.params.sportname, setmatches, setGroups, setlevels, setmatchesgroup, setListe, setFinal, setRealListe, setSeriesLevel).then(r => {
            console.log("icid",groups);
            setloading(false)
        }).catch(err => { console.log(err); navigation.navigate('HomeScreen') });

        return () => {
            chatcontext.setChatName("");
            clearInterval(chatInterval);
        }
    }, [chatcontext.chatName]);

    if (loadingmain) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <Text style={{ flex: 1, textAlign: "center", backgroundColor: "black", color: "white", borderColor: "white", borderWidth: 1 }}>kek</Text>
                <Text style={{ flex: 1, textAlign: "center", backgroundColor: "black", color: "white", borderColor: "white", borderWidth: 1 }}>kek2</Text>
            </View>
            <View style={{ flex: 10 }}>
                <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
                    <ChatContext.Consumer>
                        {value => modalChat(value, chatText, setChatText, localText, setLocalText, route.params.sportname)}

                    </ChatContext.Consumer>
                    <ArbitreContext.Consumer>
                        {value => {
                            return (
                                <View style={styles.centeredView}>
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={value || regle}
                                        supportedOrientations={['portrait', 'landscape']}
                                    >
                                        <View style={styles.modalView}>
                                            <ScrollView onScroll={() => setRegle(true)} onScrollEndDrag={() => setTimeout(() => setRegle(false), 2000)} >
                                                <View style={styles.centeredView}>
                                                    <Text style={styles.modalText}>Arbitres:</Text>
                                                    {statusArbitre['arbitre'] != "error" ? statusArbitre['arbitre'].map(r => <Text key={r} style={styles.modalText} >{r}</Text>) : <View></View>}
                                                    <Text style={styles.modalText}>Règles:</Text>
                                                    <Text style={styles.modalText}>{statusArbitre['rules']}</Text>
                                                </View>
                                            </ScrollView>

                                        </View>
                                    </Modal>
                                </View>)
                        }

                        }
                    </ArbitreContext.Consumer>

                    <Trace statusArbitre={statusArbitre} groups={groups} username={username} sport={route.params.sportname} all_teams={all_teams} />
                </ScrollView>
            </View>
        </View>

    )
};