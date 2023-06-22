import styles from "./style.js";
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { View, ScrollView, ActivityIndicator, Text, Modal, RefreshControl, Pressable, Image, KeyboardAvoidingView } from 'react-native';
import { Trace } from "./trace.js";
import { modalChat, fetchChat, fetch_matches, lutImg, fetch_sport_results, vibrateLight } from './utils.js';
import { ChatContext, ArbitreContext } from "./global.js";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export function SportDetailsScreen({ route }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const [loadingmain, setloading] = React.useState(true);
    const [status, setStatus] = React.useState({ states: ["error", "error"], status: "error", arbitre: "error", sportname: "error", winner: "error" });
    const [regle, setRegle] = React.useState(false);
    const [chatText, setChatText] = React.useState("");
    const [firstTime, setFirstTime] = React.useState(true);
    const [localText, setLocalText] = React.useState("");
    const [matches, setmatches] = React.useState([]);
    const [levels, setlevels] = React.useState([]);
    const [liste, setListe] = React.useState([]);
    const [final, setFinal] = React.useState([]);
    const [realListe, setRealListe] = React.useState([]);
    const [voteListe, setVoteListe] = React.useState([]);
    const [betListe, setBetListe] = React.useState([]);
    const [results, setResults] = React.useState({ "1": {}, "2": {}, "3": {} });
    const [modifListe, setModifListe] = React.useState({"Teams": [], "Others": []});
    const [seriesLevel, setSeriesLevel] = React.useState([0]);
    const [groups, setGroups] = React.useState([]);
    const [groupmatches, setmatchesgroup] = React.useState([]);
    const [autho, setAutho] = React.useState(false);
    const [authoVote, setAuthoVote] = React.useState(false);
    const navigation = useNavigation();
    const all_teams = {};
    all_teams.matches = matches;
    all_teams.levels = levels;
    all_teams.liste = liste;
    all_teams.final = final;
    all_teams.realListe = realListe;
    all_teams.voteListe = voteListe;
    all_teams.betListe = betListe;
    all_teams.modifListe = modifListe;
    all_teams.seriesLevel = seriesLevel;
    all_teams.groups = groups;
    all_teams.groupmatches = groupmatches;
    all_teams.autho = autho;
    all_teams.authoVote = authoVote;
    all_teams.setmatches = setmatches;
    all_teams.setlevels = setlevels;
    all_teams.setListe = setListe;
    all_teams.setFinal = setFinal;
    all_teams.setVoteListe = setVoteListe;
    all_teams.setRealListe = setRealListe;
    all_teams.setModifListe = setModifListe;
    all_teams.setBetListe = setBetListe;
    all_teams.setSeriesLevel = setSeriesLevel;
    all_teams.setGroups = setGroups;
    all_teams.setmatchesgroup = setmatchesgroup;
    all_teams.setAuthoVote = setAuthoVote;
    all_teams.status = status;
    all_teams.setStatus = setStatus;
    all_teams.setloading = setloading;

    const chatcontext = React.useContext(ChatContext);
    const onRefresh = React.useCallback(() => {
        let prev_status = status;
        setRefreshing(true);
        setloading(true);
        fetch_sport_results(route.params.sportname, setResults);
        fetch_matches(route.params.username, setAutho, setStatus, route.params.sportname, setmatches, setGroups, setlevels, setmatchesgroup, setListe, setFinal, setRealListe, setSeriesLevel, setModifListe, setBetListe, route.params.setLock, setAuthoVote, setVoteListe).then(r => {
            if (prev_status.status != "error") {
                console.error(prev_status.status);
                setStatus(prev_status);
            }
            setloading(false);
        });

        setRefreshing(false);
    }, []);

    React.useEffect(() => {
        chatcontext.setChatName(route.params.sportname);
        var chatInterval = setInterval(() => fetchChat(route.params.sportname, setChatText, chatcontext.setNewMessage), 3000);
        if (firstTime) {

            fetch_sport_results(route.params.sportname, setResults);
            fetch_matches(route.params.username, setAutho, setStatus, route.params.sportname, setmatches, setGroups, setlevels, setmatchesgroup, setListe, setFinal, setRealListe, setSeriesLevel, setModifListe, setBetListe, route.params.setLock, setAuthoVote, setVoteListe).then(r => {
                setloading(false);
                setFirstTime(false);
            }).catch(err => { console.log(err); navigation.navigate('HomeScreen') });
        }
        return () => {
            chatcontext.setChatName("");
            clearInterval(chatInterval);
        }
    }, []);

    if (loadingmain) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <View style={{ flex: 1, flexDirection: "column", height: 50, backgroundColor: "#C9CBCD" }}>
            <View style={{ height: 50, flexDirection: "row" }} >
                {status.states.map(r =>
                    <Pressable key={r} onPress={() => {
                        vibrateLight();
                        setloading(true);
                        setStatus((current) => {
                            current.status = r;
                            return { ...current }
                        });
                        setloading(false)
                    }} style={r == status.status ?
                        { flex: 1, backgroundColor: "black", borderColor: "white", borderWidth: 5, alignItems: "center", borderBottomStartRadius: 15, borderBottomEndRadius: 15 } :
                        { flex: 1, backgroundColor: "black", borderColor: "grey", borderWidth: 5, alignItems: "center", borderBottomStartRadius: 15, borderBottomEndRadius: 15 }}><View>
                            <Image style={styles.tabimage} resizeMode="contain" resizeMethod="auto" source={lutImg(r)} /></View></Pressable>)}
            </View>
            <View style={{ flex: 10 }}>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
                    <ChatContext.Consumer>
                        {value => modalChat(value, chatText, setChatText, localText, setLocalText, route.params.sportname, route.params.username)}

                    </ChatContext.Consumer>
                    <ArbitreContext.Consumer>
                        {value => {
                            return (
                                <View style={styles.centeredView}>
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={value || regle}
                                    >
                                        <View style={styles.modalView}>
                                            <ScrollView onScroll={() => setRegle(true)} onScrollEndDrag={() => setTimeout(() => setRegle(false), 2000)} >
                                                <View style={styles.centeredView}>
                                                    <Text style={styles.modalText}>Arbitres:</Text>
                                                    {status['arbitre'] != "error" ? status['arbitre'].map(r => <Text key={r} style={styles.modalText} >{r}</Text>) : <View></View>}
                                                    <Text style={styles.modalText}>Règles:</Text>
                                                    <Text style={styles.modalText}>{status['rules']}</Text>
                                                </View>
                                            </ScrollView>

                                        </View>
                                    </Modal>
                                </View>)
                        }

                        }
                    </ArbitreContext.Consumer>
                    <Trace status={status} username={route.params.username} sport={route.params.sportname} all_teams={all_teams} results={results} setStatus={setStatus} setLoading={setloading} onRefresh={onRefresh} />
                </ScrollView>
            </View>
        </View>

    )
};