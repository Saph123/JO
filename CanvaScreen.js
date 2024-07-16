import * as React from 'react';
import { View, Pressable, ActivityIndicator, Text, Image } from 'react-native';
// import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { modalChat, fetchChat, vibrateLight } from "./utils.js"
import { paletteColors, ChatContext } from "./global";

let globRefresh = 0;
function refreshBase(setref, setRef2) {
    globRefresh += 1;
    if (globRefresh % 4 == 0) {
        globRefresh = 0;
    }
    switch (globRefresh) {
        case 1:
            setRef2(1);
            break;
        case 2:
            setref(0);
            break;
        case 3:
            setref(1);
            break;
        case 0:
            setRef2(0);
            break;

    }
}

export function CanvaScreen({ route }) {
    const chatcontext = React.useContext(ChatContext);
    const [chatText, setChatText] = React.useState("");
    const [localText, setLocalText] = React.useState("");
    const [userId, setUserId] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selection, setSelection] = React.useState([0, "black"]);
    const [coordX, setCoordX] = React.useState(0);
    const [coordY, setCoordY] = React.useState(0);
    const [refresh, setRefresh] = React.useState(0);
    const [refresh2, setRefresh2] = React.useState(1);
    const [lineNb, setLineNb] = React.useState(200);
    const [colNb, setColNb] = React.useState(200);
    const [patch, setPatch] = React.useState([]);
    const [livepatch, setLivePatch] = React.useState([]);

    React.useEffect(() => {
        chatcontext.setChatName("Canva");
        if (chatcontext.chatName == "Canva") {
            var chatInterval = setInterval(() => fetchChat("Canva", setChatText, chatcontext.setNewMessage), 3000);
        }
        fetchSize(setLineNb, setColNb, lineNb, colNb);
        var refreshInterval = setInterval(() => refreshBase(setRefresh, setRefresh2), 3000);
        var liveInterval = setInterval(() => fetchLive(setLivePatch), 1000);
        setLoading(false);
        return () => {
            clearInterval(refreshInterval);
            clearInterval(chatInterval);
            clearInterval(liveInterval);
            lines_number = 0;
        }
    }, [chatcontext.chatName, lineNb, colNb]);

    if (loading) {
        return (<ActivityIndicator style={{ alignSelf: "center" }} size="large" color="#000000" />)

    }
    return (
        <View key={"haok"}
            onStartShouldSetResponder={() => { return false }}
            renderToHardwareTextureAndroid={true}
            style={{
                flex: 1
            }}>
            <ChatContext.Consumer>
                {value => modalChat(value, chatText, setChatText, localText, setLocalText, "Canva", route.params.username)}

            </ChatContext.Consumer>

            {/* <ReactNativeZoomableView
                renderToHardwareTextureAndroid={true}

                key={'zoom'}
                maxZoom={100}
                minZoom={0.01}
                zoomStep={0.5}
                initialZoom={0.1}
                bindToBorders={false}

            >
                <Pressable style={{ width: colNb * 10, height: lineNb * 10 }} key={'mainframe' + lineNb} onPress={(e) => {vibrateLight(); setCoordX(Math.floor(e.nativeEvent.locationX / 10) * 10); setCoordY(Math.floor(e.nativeEvent.locationY / 10) * 10); fetchUsername(Math.floor(e.nativeEvent.locationX / 10) * 10, Math.floor(e.nativeEvent.locationY / 10) * 10, setUserId) }}>
                    <Canva lineNb={lineNb} colNb={colNb} refresh={refresh}></Canva>
                    <Canva lineNb={lineNb} colNb={colNb} refresh={refresh2}></Canva>
                    {selection[0] == -1 ? <View key={"kekalnd"}></View> : <View pointerEvents="none" key={"container"}>
                    </View>}
                    {patch.map((r, index) => {
                        if (r != undefined) {

                            return (<View pointerEvents="none" key={r.x + r.y + r.color + new Date() + index}
                            style={{ zIndex: 2000, width: 10, height: 10, position: "absolute", backgroundColor: r.color, top: r.y, left: r.x, borderColor: r.color, borderWidth: 1, shadowOpacity: 0 }}>
                            </View>)
                        }
                    })}
                    {livepatch.map((r, index) => {
                        if (r != undefined) {

                            return (<View pointerEvents="none" key={r.x + r.y + r.color + new Date() + index}
                            style={{ zIndex: 2000, width: 10, height: 10, position: "absolute", backgroundColor: r.color, top: r.y, left: r.x, borderColor: r.color, borderWidth: 1, shadowOpacity: 0 }}>
                            </View>)
                        }
                    })}
                        <View pointerEvents="none" key={"carreselect"} style={{ elevation: 1999, zIndex: 1999, width: 10, height: 10, position: "absolute", backgroundColor: "white", top: coordY, left: coordX, borderColor: "black", borderWidth: 1, opacity: 0.5 }}></View>

                </Pressable>
            </ReactNativeZoomableView > */}
            <View pointerEvents="none" style={{ width: "100%", height: 30 }}>
                <Text pointerEvents="none" style={{ textAlign: "center", color: "black", height: "100%", width: "100%", elevation: 2000, zIndex: 2000, fontSize: 20, flex: 1, margin: 0 }} key={"textname"}>{"(" + (Math.floor(coordX / 10)) + "," + Math.floor(coordY / 10) + ")" + (userId == "Whisky" ? "" : userId)}</Text>
            </View>
            <View key={"kekos"} style={{ flexDirection: "row", height:180 }}>

                {paletteColors.map((r, index) => {
                    if (index % 3 == 0) {
                        // console.log(paletteColors[index + 2])
                        return (
                            <View key={"m:" + index} style={{ flexDirection: "column", flex:1 }}>
                                <Pressable key={r} style={{ borderColor: "black", borderWidth: 1, flex:1, backgroundColor: r }} onPress={() => colorset(r, route.params.username, coordX, coordY, setPatch, patch)} />
                                {paletteColors[index + 1] != undefined ? <Pressable key={paletteColors[index + 1]} style={{ borderColor: "black", borderWidth: 1, flex:1, backgroundColor: paletteColors[index + 1] }} onPress={() => colorset(paletteColors[index + 1], route.params.username, coordX, coordY, setPatch, patch, lineNb, colNb, setLineNb, setColNb)} /> : <View></View>}
                                {paletteColors[index + 2] != undefined ? <Pressable key={paletteColors[index + 2]} style={{ borderColor: "black", borderWidth: 1, flex:1, backgroundColor: paletteColors[index + 2] }} onPress={() => colorset(paletteColors[index + 2], route.params.username, coordX, coordY, setPatch, patch, lineNb, colNb, setLineNb, setColNb)} /> : <View></View>}
                            </View>
                        )
                    }
                })}

            </View>
        </View>
    )
}
let lines_number = 200;
let cols_number= 400;
let livepatch = [];
function fetchUsername(x, y, setUserId) {
    let localid = Math.floor(y / 10) * cols_number + Math.floor(x / 10);
    fetch("https://jo.pierrickperso.ddnsfree.com/canvausername/" + localid).then(r => {
        if (r.status == 200) {
            return r.text();
        }
    }
    ).then(data => {
        setUserId(data)
    })

}
function fetchLive(setPatch) {
    fetch("https://jo.pierrickperso.ddnsfree.com/canvalive").then(r => {
        if (r.status == 200) {
            return r.json();
        }

    }
    ).then(data => {
        // livepatch = []
        if (data.live.length > 0)
        {

        for(let i = 0; i  < data.live.length; i++){
            let localid = Math.floor(y / 10) * lines_number + Math.floor(x / 10);
            let x = data.live[i].id % cols_number
            let y = data.live[i].id / cols_number
            x = x * 10
            y = Math.floor(y) * 10
            livepatch.push({ color: data.live[i].color, x: x, y: y })
        }

            setPatch([...livepatch]);
            setTimeout(() => { livepatch.splice(0, data.live.length);setPatch([...livepatch]) }, 10000); // we remove anyway to avoid lagz
        }
    })

}
async function fetchSize(setLineNb, setColNb, lineNb, colNb) {
    await fetch("https://jo.pierrickperso.ddnsfree.com/canvasizedev").then(r => {
        if (r.status == 200) {
            return r.json();
        }
    }
    ).then(data => {
        if (data.lines != undefined) {

            if (data.lines != lineNb) {
                setLineNb(data.lines);
            }
            if (data.cols != colNb) {
                setColNb(data.cols);
            }
            lines_number = data.lines;
            cols_number = data.cols;
        }
    })

}
let globalpatch = [];
function colorset(localColor, username, x, y, setPatch, patch, lineNb, colNb, setLineNb, setColNb) {
    vibrateLight();
    // globalpatch = [];
    let localid = Math.floor(y / 10) * cols_number + Math.floor(x / 10);
    if (localColor == "#8B4513") {
        localColor = "brown";
    }


    if (localColor == "brown") {

        globalpatch.push({ color: "#8B4513", x: x, y: y })
    }
    else {
        globalpatch.push({ color: localColor, x: x, y: y })

    }

    setPatch([...globalpatch]);
    setTimeout(() => { globalpatch.shift(); setPatch([...globalpatch]) }, 2000); // we remove anyway to avoid lagz
    fetch("https://jo.pierrickperso.ddnsfree.com/canvasetcolor", { method: "POST", body: JSON.stringify({ "id": localid, "color": localColor, "username": username, "lines":lines_number, "cols": cols_number }) }).then(r => {

        if (r.status != 200) {
            fetchSize(setLineNb, setColNb, lineNb, colNb);
        }
    })
}

const Canva = React.memo((props) => {
    const refresh = props.refresh;
    const lineNb = props.lineNb;
    const colNb = props.colNb;
    let date = new Date();
    return (
        <Image pointerEvents="none" source={{ cache: 'reload', uri: "https://jo.pierrickperso.ddnsfree.com/canvadev?" + (date) }} style={{ opacity: refresh, position: "absolute", top: 0, left: 0, width: colNb * 10, height: lineNb * 10, borderColor: "black", borderWidth: 1 }}></Image>
    )
})