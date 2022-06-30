import styles from "./style";
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Modal, Pressable, ActivityIndicator, Text, Dimensions } from 'react-native';
import { VerticalLineCanva, HorizontalLineCanva } from "./global";
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { JSHash, JSHmac, CONSTANTS } from "react-native-hash";
import { paletteColors } from "./global";
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
    const navigation = useNavigation();

    React.useEffect(() => {
        fetchCanva(loading, setLoading, setColor, setUserId, route.params.username, true);
        var canvaInterval = setInterval(() => fetchCanva(loading, setLoading, setColor, setUserId, route.params.username, false), 1000);
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
            globalcolor = new Array(VerticalLineCanva * HorizontalLineCanva);
            clearInterval(canvaInterval);
        }
    }, []);
    const dimensions = Dimensions.get('window');
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)

    }
    return (
        <View 
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1000,
            height: 1000,
        }}>
        <ReactNativeZoomableView
        
        key={'zoom'}
            maxZoom={100}
            minZoom={0.1}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={false}

        >
            <View key={'mainframe'} style={{ width: 1000, height: 1000 }}>

                {id == -1 ? <View key={"kekalnd"}></View> : <View key={"morray"} style={{ position: "absolute", top: y, left: x - 40, zIndex: 1000 }}> {paletteColors.map( r => {
                    return(
                        <Pressable key={r}  style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: r }} onPress={() => colorset(color, setColor, id, setId, r, route.params.username)}/>
                    )
                })}

                    <View key={"name"} style={{ position: "absolute", zIndex: 1000, top: y, left: x, width:100, height:50 }}><Text style={{textAlign:"left"}}  key={"textname"}>{userId[id] == "Whisky" ? "" : userId[id]}</Text></View>
                </View>}
                
                    {/* <Pressable key={"ke"} style={{ zIndex: 1000, width: 40, height: 40}} onPress={() => colorset(color, setColor, id, setId, "red", route.params.username)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "red" }}></View></Pressable>
                    <Pressable key={"kk"} style={{ zIndex: 1000, width: 40, height: 40}} onPress={() => colorset(color, setColor, id, setId, "yellow", route.params.username)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "yellow" }}></View></Pressable>
                    <Pressable key={"ka"} style={{ zIndex: 1000, width: 40, height: 40}} onPress={() => colorset(color, setColor, id, setId, "blue", route.params.username)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "blue" }}></View></Pressable>
                    <Pressable key={"kb"} style={{ zIndex: 1000, width: 40, height: 40}} onPress={() => colorset(color, setColor, id, setId, "green", route.params.username)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "green" }}></View></Pressable>
                    <Pressable key={"kc"} style={{ zIndex: 1000, width: 40, height: 40}} onPress={() => colorset(color, setColor, id, setId, "cyan", route.params.username)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "cyan" }}></View></Pressable>
                    <Pressable key={"kd"} style={{ zIndex: 1000, width: 40, height: 40}} onPress={() => colorset(color, setColor, id, setId, "brown", route.params.username)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "brown" }}></View></Pressable>
                    <Pressable key={"kf"} style={{ zIndex: 1000, width: 40, height: 40}} onPress={() => colorset(color, setColor, id, setId, "white", route.params.username)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "white" }}></View></Pressable>
                    <Pressable key={"kgr"} style={{ zIndex: 1000, width: 40, height: 40}} onPress={() => colorset(color, setColor, id, setId, "pink", route.params.username)}><View style={{ borderColor: "black", borderWidth: 1, width: 40, height: 40, backgroundColor: "pink" }}></View></Pressable> */}
                {arrayVert.map((r, indexVert) => {

                    return (

                        arrayHorizontal.map((z, indexHorizontal) => {

                            return (<Pressable style={{ zindex: 1200, position: 'absolute', top: indexVert*10, left: indexHorizontal*10, width: 10, height: 10, borderColor: "black", borderWidth: id == (indexVert * HorizontalLineCanva + indexHorizontal) ? 1 : 0, backgroundColor: color[indexVert * HorizontalLineCanva + indexHorizontal] }} key={"(" + indexVert + ", "+ indexHorizontal} onPress={(e) => { setId(indexVert * HorizontalLineCanva + indexHorizontal); setX(indexHorizontal * 10); setY(indexVert * 10); setPalette(true) }}>
                            </Pressable>)
                        }))
                })
                }



            </View>
        </ReactNativeZoomableView>
        </View>

    )
}
let globalcolor = new Array(HorizontalLineCanva * VerticalLineCanva);
let previoushash = "0";
let locaload = true;
function fetchCanva(loading, setloading, setColor, setUserId, username, load) {
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
        JSHash(canva.color, CONSTANTS.HashAlgorithms.sha256)
            .then(hash => {
                if (previoushash != hash || load) {
                    console.log("change kek", hash, previoushash, locaload);
                    previoushash = hash;
                    for (let i = 0; i < canva.length; i++) {
                        if (globalcolor[i] != canva[i].color) {
                            nochange = false;
                        }
                        tmpcolor.push(canva[i].color)
                        tmpname.push(canva[i].name)
                    }
                    if (!nochange) {
                        setColor(tmpcolor);
                        globalcolor = [...tmpcolor];
                        setUserId(tmpname);
                    }


                        
                    
    
                }
                
                if(load){

                    setloading(false);
                }
            })
            .catch(e => console.log(e));
    }
    ).catch(err => console.error("err", err))
}
function colorset(color, setColor, id, setId, localColor, username) {

    let tmpColors = color;
    tmpColors[id] = localColor;
    fetch("https://applijo.freeddns.org/canvasetcolor", { method: "POST", body: JSON.stringify({ "id": id, "color": localColor, "username": username }) }).then(r => {

        if (r.status == 200) {

            setColor(tmpColors);
        }
    })
    setId(-1);
}