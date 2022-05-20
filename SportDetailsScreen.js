import styles from "./style";
import * as React from 'react';
import { View, Dimensions, ActivityIndicator, Text, Modal } from 'react-native';
// import PinchZoomView from 'react-native-pinch-zoom-view';
import { ScrollView } from 'react-native-gesture-handler';
import { Trace } from "./trace.js";
import { modalChat, fetchChat } from './utils.js';
import { ChatContext, ArbitreContext } from "./App.js";


export function SportDetailsScreen({ route }) {

    const [window_width, setWidth] = React.useState(Dimensions.get("window").width);
    const [window_height, setHeight] = React.useState(Dimensions.get("window").height);
    const [loadingmain, setloading] = React.useState(true);
    const [status, setArbitreRule] = React.useState({ arbitre: "error", status: "error" });
    const [regle, setRegle] = React.useState(false);
    const [toupdate, setToUpdate] = React.useState(false);
    const [chatText, setChatText] = React.useState("");
    const [localText, setLocalText] = React.useState("");
    const chatcontext = React.useContext(ChatContext);
    React.useEffect(() => {
        var chatInterval = setInterval(() => fetchChat(route.params.sportname, setChatText, chatcontext.setNewMessage), 3000);
        setloading(false);

        return () => {
            clearInterval(chatInterval);
        }
    }, [chatcontext]);

    if (loadingmain) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <ScrollView style={{flex:1}}>
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

            <Trace status={status} username={username} sport={route.params.sportname} width={window_width} height={window_height} setHeight={setHeight} setWidth={setWidth} setArbitreRule={setArbitreRule} traceload={setloading} pinchReset={setToUpdate} />
        </ScrollView>

    )
};