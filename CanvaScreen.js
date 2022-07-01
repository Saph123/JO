import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Modal, Pressable, ActivityIndicator, Text, Dimensions } from 'react-native';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { modalChat, fetchChat } from "./utils.js"
import { paletteColors, ChatContext, carreSize } from "./global";
import { getTimestamp } from 'react-native-reanimated/lib/reanimated2/core.js';
let globalid = -1;
export function CanvaScreen({ route }) {
    const [color, setColor] = React.useState([]);
    const chatcontext = React.useContext(ChatContext);
    const [chatText, setChatText] = React.useState("");
    const [localText, setLocalText] = React.useState("");
    const [userId, setUserId] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selection, setSelection] = React.useState([-1, "black"]);
    const [arrayVert, setArrayVert] = React.useState([]);
    const [arrayHorizontal, setArrayHorizontal] = React.useState([]);
    React.useLayoutEffect(() => {
        chatcontext.setChatName("Canva");
        if (chatcontext.chatName == "Canva") {
            var chatInterval = setInterval(() => fetchChat("Canva", setChatText, chatcontext.setNewMessage), 3000);
        }

        var canvaInterval = setInterval(() => fetchCanva(setLoading, setColor, setUserId, setArrayHorizontal, setArrayVert), 1000);
        return () => {
            clearInterval(canvaInterval);
            clearInterval(chatInterval);
            lastreq = 0;
            globalcolor = [];
            previouslines = 0;
            previouscol = 0;
        }
    }, [chatcontext.chatName]);

    if (loading) {
        return (<ActivityIndicator style={{ alignSelf: "center" }} size="large" color="#000000" />)

    }
    return (
        <View key={"haok"}
            renderToHardwareTextureAndroid={true}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 1000,
                height: 1080
            }}>
            <ChatContext.Consumer>
                {value => modalChat(value, chatText, setChatText, localText, setLocalText, "Canva", route.params.username)}

            </ChatContext.Consumer>
            <View key={"kekos"} style={{ width: paletteColors.length / 2, height: 80, flexDirection: "row" }}>

                {paletteColors.map((r, index) => {
                    if (index % 2 == 0) {

                        return (
                            <View key={"m:" + index} style={{ flexDirection: "column", width: 40, height: 80 }}>
                                <Pressable key={r} style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: r }} onPress={() => colorset(color, setColor, r, route.params.username, globalid, setSelection)} />
                                <Pressable key={paletteColors[index + 1]} style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: paletteColors[index + 1] }} onPress={() => colorset(color, setColor, paletteColors[index + 1], route.params.username, globalid, setSelection)} />
                            </View>
                        )
                    }
                })}
            </View>
            <ReactNativeZoomableView
                renderToHardwareTextureAndroid={true}

                key={'zoom'}
                maxZoom={100}
                minZoom={0.5}
                zoomStep={0.5}
                initialZoom={10}
                bindToBorders={false}

            >
                <View key={'mainframe'} style={{ width: carreSize * arrayHorizontal.length, height: carreSize * arrayVert.length }}>
                    {arrayVert.map((r, indexVert) => {
                        return (
                            arrayHorizontal.map((z, indexHorizontal) => {
                                return (<Pixel setSelection={setSelection} indexVert={indexVert} indexHorizontal={indexHorizontal} arrayHorizontal={arrayHorizontal} backColor={color[indexVert * arrayHorizontal.length + indexHorizontal]}></Pixel>)
                            }))
                    })
                    }
                    {selection[0] == -1 ? <View key={"kekalnd"}></View> : <View onMoveShouldSetResponder={false} onStartShouldSetResponder={false} key={"container"}>
                        <View key={"carreselect"} style={{ eleveation: 2000, zIndex: 2000, width: carreSize, height: carreSize, position: "absolute", backgroundColor: selection[1], top: Math.floor(selection[0] / arrayHorizontal.length) * carreSize, left: selection[0] % arrayHorizontal.length * carreSize, borderColor: selection[1] == "black" ? "white" : "black", borderWidth: 1 }}></View>
                        <View key={"name"} style={{ position: "absolute", elevation: 2000, zIndex: 2000, top: Math.floor(selection[0] / arrayHorizontal.length) * carreSize - carreSize, left: (selection[0] % arrayHorizontal.length < (arrayVert.length - carreSize)) ? selection[0] % arrayHorizontal.length * carreSize + 40 : selection[0] % arrayHorizontal.length * carreSize - 40, width: 100, height: 50 }}>
                            <Text style={{ textAlign: "left", color: "black", elevation: 2000, zIndex: 2000 }} key={"textname"}>{userId[selection[0]] == "Whisky" ? "" : userId[selection[0]]}</Text>
                        </View>
                    </View>}
                </View>
            </ReactNativeZoomableView >
        </View>
    )
}
let lastreq = 0;
let globalcolor = [];
let previouslines = 0;
let previouscol = 0;
function fetchCanva(setloading, setColor, setUserId, setHorizontal, setVert) {
    if (new Date() - lastreq > 500) {
        fetch("https://applijo.freeddns.org/canva").then(r => {
            if (r.status == 200) {
                lastreq = new Date()
                return r.json();
            }
        }


        ).then(data => {

            if (data.lines_nb != previouslines) {
                setloading(true);
                previouslines = data.lines_nb;
                let tmp = []
                for (let i = 0; i < previouslines; i++) {
                    tmp.push(0)
                }
                setVert([...tmp]);

            }
            let canva = data.canva;
            if (previouscol != canva.length / data.lines_nb) {
                previouscol = canva.length / data.lines_nb;
                let tmp = []
                for (let i = 0; i < previouscol; i++) {
                    tmp.push(0)
                }
                setHorizontal([...tmp]);
            }
            let tmpcolor = [];
            let tmpname = [];

            let toupdate = false;
            for (let i = 0; i < canva.length; i++) {

                if (canva[i].color != globalcolor[i]) {
                    toupdate = true;
                }
                tmpcolor.push(canva[i].color);
                tmpname.push(canva[i].name);
            }
            if (toupdate) {
                globalcolor = tmpcolor;
                setUserId([...tmpname]);
                setColor([...tmpcolor])
            }
            setloading(false);
        }
        ).catch(err => console.error(err));
    }
}
function colorset(color, setColor, localColor, username, localid, setSelection) {

    let tmpColors = [...color];
    tmpColors[localid] = localColor;
    fetch("https://applijo.freeddns.org/canvasetcolor", { method: "POST", body: JSON.stringify({ "id": localid, "color": localColor, "username": username }) }).then(r => {

        if (r.status == 200) {

            setColor([...tmpColors]);
            setSelection([globalid, localColor])
        }
    })
}

const Pixel = React.memo((props) => {
    const indexVert = props.indexVert;
    const indexHorizontal = props.indexHorizontal;
    const backColor = props.backColor;
    const setSelection = props.setSelection;
    const arrayHorizontal = props.arrayHorizontal;
    return (

        <Pressable style={{ zindex: 1200, position: 'absolute', top: indexVert * carreSize, left: indexHorizontal * carreSize, width: carreSize, height: carreSize, backgroundColor: backColor }} key={(indexVert * arrayHorizontal.length + indexHorizontal)} onPress={() => { globalid = (indexVert * arrayHorizontal.length + indexHorizontal); setSelection([globalid, backColor]) }}>
        </Pressable>
    )
})