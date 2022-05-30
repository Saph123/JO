import styles from "./style";
import * as React from 'react';
import { View, ScrollView, ActivityIndicator, Text, Modal, RefreshControl } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
import { Trace } from "./trace.js";
import { modalChat, fetchChat } from './utils.js';
import { ChatContext, ArbitreContext } from "./App.js";

export function SportDetailsScreen({ route }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const [loadingmain, setloading] = React.useState(true);
    const [status, setArbitreRule] = React.useState({ arbitre: "error", status: "error" });
    const [regle, setRegle] = React.useState(false);
    const [chatText, setChatText] = React.useState("");
    const [localText, setLocalText] = React.useState("");
    const chatcontext = React.useContext(ChatContext);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        console.log("hahahahaha");
        setRefreshing(false);
        // wait(2000).then(() => setRefreshing(false));
    }, []);
    React.useEffect(() => {
        chatcontext.setChatName(route.params.sportname);
        var chatInterval = setInterval(() => fetchChat(route.params.sportname, setChatText, chatcontext.setNewMessage), 3000);
        setloading(false);

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

                    <Trace status={status} username={username} sport={route.params.sportname} setArbitreRule={setArbitreRule} traceload={setloading} />
                </ScrollView>
            </View>
        </View>

    )
};