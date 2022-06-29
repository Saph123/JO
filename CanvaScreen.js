import styles from "./style";
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Modal, Pressable, ActivityIndicator, Text, Dimensions } from 'react-native';
import { VerticalLineCanva, HorizontalLineCanva } from "./global";
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
export function CanvaScreen({ route }) {
    const keys = new Array(VerticalLineCanva * HorizontalLineCanva);
    const [arrayVert, setArrayVert] = React.useState([]);
    const [arrayHorizontal, setArrayHorizontal] = React.useState([]);
    const [palette, setPalette] = React.useState(true);
    const [id, setId] = React.useState(-1);
    const [color, setColor] = React.useState([]);
    const [userId, setUserId] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    const [coolDown, setCoolDown] = React.useState(0);
    const navigation = useNavigation();

    React.useEffect(() => {
        var canvaInterval = setInterval(() => fetchCanva(setLoading, setColor, setUserId, route.params.username, setCoolDown, color), 1000);
        let tmpVert = [];
        let tmpHorizontal = [];
        let tmpcolor = [];
        for (let i = 0; i < VerticalLineCanva; i++) {
            tmpVert.push(0);

        }
        for (let i = 0; i < HorizontalLineCanva; i++) {
            tmpHorizontal.push(0);
        }
        setArrayVert(tmpVert);
        setArrayHorizontal(tmpHorizontal);
        return () => {
            clearInterval(canvaInterval);
        }
    }, []);
    const dimensions = Dimensions.get('window');
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)

    }
    return (
        <ReactNativeZoomableView
            maxZoom={2}
            minZoom={0.5}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={true}
            style={{
                zIndex: 2000,
                width: "100%",
                height: "100%",
                backgroundColor: 'white',
            }}
        >
            <View style={{ flex: 1, width: "100%", height: "100%" }}>

                {id == -1 ? <View></View> : <View style={{ position: "absolute", top: 30, left: (id % HorizontalLineCanva) < 5 ? dimensions.width - 40 : 0, zIndex: 1000 }}>
                    <Pressable style={{ zIndex: 1000, width: 40, height: 40, flex: 1, opacity: coolDown == 0 ? 1 : 0.1 }} onPress={() => colorset(color, setColor, id, setId, "black", route.params.username, setCoolDown, coolDown)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "black" }}></View></Pressable>
                    <Pressable style={{ zIndex: 1000, width: 40, height: 40, flex: 1, opacity: coolDown == 0 ? 1 : 0.1 }} onPress={() => colorset(color, setColor, id, setId, "red", route.params.username, setCoolDown, coolDown)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "red" }}></View></Pressable>
                    <Pressable style={{ zIndex: 1000, width: 40, height: 40, flex: 1, opacity: coolDown == 0 ? 1 : 0.1 }} onPress={() => colorset(color, setColor, id, setId, "yellow", route.params.username, setCoolDown, coolDown)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "yellow" }}></View></Pressable>
                    <Pressable style={{ zIndex: 1000, width: 40, height: 40, flex: 1, opacity: coolDown == 0 ? 1 : 0.1 }} onPress={() => colorset(color, setColor, id, setId, "blue", route.params.username, setCoolDown, coolDown)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "blue" }}></View></Pressable>
                    <Pressable style={{ zIndex: 1000, width: 40, height: 40, flex: 1, opacity: coolDown == 0 ? 1 : 0.1 }} onPress={() => colorset(color, setColor, id, setId, "green", route.params.username, setCoolDown, coolDown)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "green" }}></View></Pressable>
                    <Pressable style={{ zIndex: 1000, width: 40, height: 40, flex: 1, opacity: coolDown == 0 ? 1 : 0.1 }} onPress={() => colorset(color, setColor, id, setId, "cyan", route.params.username, setCoolDown, coolDown)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "cyan" }}></View></Pressable>
                    <Pressable style={{ zIndex: 1000, width: 40, height: 40, flex: 1, opacity: coolDown == 0 ? 1 : 0.1 }} onPress={() => colorset(color, setColor, id, setId, "brown", route.params.username, setCoolDown, coolDown)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "brown" }}></View></Pressable>
                    <Pressable style={{ zIndex: 1000, width: 40, height: 40, flex: 1, opacity: coolDown == 0 ? 1 : 0.1 }} onPress={() => colorset(color, setColor, id, setId, "white", route.params.username, setCoolDown, coolDown)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "white" }}></View></Pressable>
                    <Pressable style={{ zIndex: 1000, width: 40, height: 40, flex: 1, opacity: coolDown == 0 ? 1 : 0.1 }} onPress={() => colorset(color, setColor, id, setId, "pink", route.params.username, setCoolDown, coolDown)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "pink" }}></View></Pressable>
                    {coolDown == 0 ? <View></View> : <View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "white", borderRadius: 20, alignContent: "center", justifyContent: "center" }}><Text style={{ textAlign: "center", textAlignVertical: "center" }}>{coolDown}</Text></View>}
                    <View style={{ position: "absolute", zIndex: 1000, top: y < 180 ? y - 60 : y - 160, left: (id % HorizontalLineCanva) < 5 ? -dimensions.width + 40 + x : x - 40, width: 100 }}><Text>{userId[id] == "Whisky" ? "":userId[id]}</Text></View>
                </View>}

                {arrayVert.map((r, indexVert) => {
                    return (<View key={keys[indexVert]} style={{ flex: 1, flexDirection: "row", zIndex: 10, elevation: 10 }}>

                        {arrayHorizontal.map((z, indexHorizontal) => {

                            return (<Pressable  style={{ flex: 1, flexDirection: "column", borderColor: "black", borderWidth: id == (indexVert * HorizontalLineCanva + indexHorizontal) ? 1 : -1, backgroundColor: color[indexVert * HorizontalLineCanva + indexHorizontal] }} key={keys[VerticalLineCanva * (indexVert + 1) + indexHorizontal]} onPress={(e) => { setId(indexVert * HorizontalLineCanva + indexHorizontal); setX(e.nativeEvent.pageX); setY(e.nativeEvent.pageY); setPalette(true) }}>
                            </Pressable>)
                        }
                        )}
                    </View>)
                })
                }
            </View></ReactNativeZoomableView>

    )
}

function fetchCanva(setloading, setColor, setUserId, username, setCoolDown, color) {
    fetch("https://applijo.freeddns.org/canva/" + username).then(r => {
        if (r.status == 200) {

            return r.json();
        }
    }


    ).then(data => {
        let cooldown = data[0];
        let canva = data[1];
        let tmpcolor = [];
        let tmpname = [];
        let nochange = true;
        for (let i = 0; i < canva.length; i++) {
            if(color[i] != canva[i].color){
                nochange = false;
            }
            tmpcolor.push(canva[i].color)
            tmpname.push(canva[i].name)
        }
        if(!nochange){
            setColor(tmpcolor);
            setUserId(tmpname);
        }
        setloading(false);

        setCoolDown(Math.round(cooldown));
    }
    ).catch(err => console.error("err", err))
}
function colorset(color, setColor, id, setId, localColor, username, setCoolDown, coolDown) {
    if (coolDown != 0) {
        return;
    }
    let tmpColors = color;
    tmpColors[id] = localColor;
    fetch("https://applijo.freeddns.org/canvasetcolor", { method: "POST", body: JSON.stringify({ "id": id, "color": localColor, "username": username }) }).then(r => {

        if (r.status == 200) {

            setColor(tmpColors);
            setCoolDown(false);
        }
    })
    setId(-1);
}