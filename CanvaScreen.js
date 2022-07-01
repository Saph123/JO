import styles from "./style";
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Modal, Pressable, ActivityIndicator, Text, Dimensions } from 'react-native';
import { VerticalLineCanva, HorizontalLineCanva } from "./global";
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { JSHash, JSHmac, CONSTANTS } from "react-native-hash";
import { paletteColors } from "./global";
let globalid = -1;
export function CanvaScreen({ route }) {
    const keys = new Array(VerticalLineCanva * HorizontalLineCanva);
    const [color, setColor] = React.useState([]);

    const [userId, setUserId] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selection, setSelection] = React.useState([-1, "black"]);
    const navigation = useNavigation();
    let arrayVert = new Array();
    let arrayHorizontal = new Array();
    for (let i = 0; i < HorizontalLineCanva; i++) {
        arrayVert.push(0);
        arrayHorizontal.push(0);
    }
    React.useEffect(() => {
        previoushash = "0";
        setLoading(true);
        var canvaInterval = setInterval(() => fetchCanva(setLoading, setColor, setUserId, route.params.username, true), 1000);

        return () => {
            clearInterval(canvaInterval);
        }
    }, []);

    const dimensions = Dimensions.get('window');
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)

    }
    return (
        <View key={"haok"}
            renderToHardwareTextureAndroid={true}
            shouldRasterizeIOS={true}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 1000,
                height: 1080,
            }}>
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
                shouldRasterizeIOS={true}
                key={'zoom'}
                maxZoom={100}
                minZoom={0.1}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={false}

            >
                <View renderToHardwareTextureAndroid={true} shouldRasterizeIOS={true} key={'mainframe'} style={{ width: 1000, height: 1000 }}>
                    {selection[0] == -1 ? <View key={"kekalnd"}></View> : <View key={"container"}>
                        <View key={"carreselect"} style={{ zIndex: 2000, width: 10, height: 10, position: "absolute", backgroundColor: selection[1], top: Math.floor(selection[0] / HorizontalLineCanva) * 10, left: selection[0] % HorizontalLineCanva * 10, borderColor: "black", borderWidth: 1 }}></View>
                        <View key={"name"} style={{ position: "absolute", zIndex: 2000, top: selection[0] / HorizontalLineCanva * 10 - 2, left: selection[0] % HorizontalLineCanva * 10 + 40, width: 100, height: 50 }}>
                            <Text style={{ textAlign: "left" }} key={"textname"}>{userId[selection[0]] == "Whisky" ? "" : userId[selection[0]]}</Text>
                        </View>
                    </View>}
                    {arrayVert.map((r, indexVert) => {

                        return (
                            arrayHorizontal.map((z, indexHorizontal) => {
                                return (<Pixel setSelection={setSelection} indexVert={indexVert} indexHorizontal={indexHorizontal} backColor={color[indexVert * HorizontalLineCanva + indexHorizontal]}></Pixel>)
                            }))
                    })
                    }
                </View>
            </ReactNativeZoomableView >
        </View>
    )
}
let previoushash = "0";
let locaload = true;
let globalcolor = new Array(HorizontalLineCanva * VerticalLineCanva);
function fetchCanva(setloading, setColor, setUserId, username, load) {
    fetch("https://applijo.freeddns.org/canva").then(r => {
        if (r.status == 200) {

            return r.json();
        }
    }


    ).then(data => {
        let canva = data[1];
        let tmpcolor = [];
        let tmpname = [];
        let nochange = true;

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

        if (load) {
            setloading(false);
        }
    }
    ).catch(err => console.error(err))
}
function colorset(color, setColor, localColor, username, localid, setSelection) {

    let tmpColors = [...color];
    tmpColors[localid] = localColor;
    fetch("https://applijo.freeddns.org/canvasetcolor", { method: "POST", body: JSON.stringify({ "id": localid, "color": localColor, "username": username }) }).then(r => {

        if (r.status == 200) {

            setColor([...tmpColors]);
            setSelection([globalid, localColor])
        }
        globalid = -1;
    })
    // setId(-1);
}

const Pixel = React.memo((props) => {
    const indexVert = props.indexVert;
    const indexHorizontal = props.indexHorizontal;
    const backColor = props.backColor;
    const setSelection = props.setSelection;
    return (

        <Pressable style={{ zindex: 1200, position: 'absolute', top: indexVert * 10, left: indexHorizontal * 10, width: 10, height: 10, backgroundColor: backColor }} key={(indexVert * HorizontalLineCanva + indexHorizontal)} onPress={() => { globalid = (indexVert * HorizontalLineCanva + indexHorizontal); setSelection([globalid, backColor]) }}>
        </Pressable>
    )
})