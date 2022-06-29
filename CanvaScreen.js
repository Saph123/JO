import styles from "./style";
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Modal, Pressable, ActivityIndicator, Text, Dimensions } from 'react-native';
import { VerticalLineCanva, HorizontalLineCanva } from "./global";
export function CanvaScreen({route}) {
    const [arrayVert, setArrayVert] = React.useState([]);
    const [arrayHorizontal, setArrayHorizontal] = React.useState([]);
    const [palette, setPalette] = React.useState(true);
    const [id, setId] = React.useState(-1);
    const [color, setColor] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    const [power, setPower] = React.useState(true);
    const navigation = useNavigation();

    React.useEffect(() => {
        var chatInterval = setInterval(() => fetchCanva(setLoading, setColor), 1000);
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
    }, []);
    const dimensions = Dimensions.get('window');
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)

    }
    return (
        <View style={{ flex: 1, backgroundColor: "red" }}>

               { id == -1? <View></View>:<View style={{position:"absolute", top: 30, left:(id % HorizontalLineCanva) < 5 ? dimensions.width - 20:0, zIndex:1000}}>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "black",  route.params.username, setPower)}><View style={{ borderColor: "black", borderWidth: 1, width: 20, height: 20, backgroundColor: "black" }}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "red",  route.params.username, setPower)}><View style={{ borderColor: "black", borderWidth: 1, width: 20, height: 20, backgroundColor: "red" }}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "yellow",  route.params.username, setPower)}><View style={{ borderColor: "black", borderWidth: 1, width: 20, height: 20, backgroundColor: "yellow" }}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "blue",  route.params.username, setPower)}><View style={{ borderColor: "black", borderWidth: 1, width: 20, height: 20, backgroundColor: "blue" }}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "green",  route.params.username, setPower)}><View style={{ borderColor: "black", borderWidth: 1, width: 20, height: 20, backgroundColor: "green" }}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "cyan",  route.params.username, setPower)}><View style={{ borderColor: "black", borderWidth: 1, width: 20, height: 20, backgroundColor: "cyan" }}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "brown",  route.params.username, setPower)}><View style={{ borderColor: "black", borderWidth: 1, width: 20, height: 20, backgroundColor: "brown" }}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "white",  route.params.username, setPower)}><View style={{ borderColor: "black", borderWidth: 1, width: 20, height: 20, backgroundColor: "white" }}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "pink",  route.params.username, setPower)}><View style={{ borderColor: "black", borderWidth: 1, width: 20, height: 20, backgroundColor: "pink" }}></View></Pressable>
                    <View style={{position:"absolute",zIndex:1000, top: y < 180 ? y-60 :y-160, left:x-20, width:100 }}><Text>{"Whisky"}</Text></View>
                </View>}
                
                {arrayVert.map((r, indexVert) => {
                    return (<View style={{ flex: 1, flexDirection: "row", zIndex: 10, elevation: 10 }}>

                        {arrayHorizontal.map((z, indexHorizontal) => {
                            return (<Pressable key={indexVert * HorizontalLineCanva + indexHorizontal} onPress={(e) => { setId(indexVert * HorizontalLineCanva + indexHorizontal);setX(e.nativeEvent.pageX); setY(e.nativeEvent.pageY); showUsername("Max",indexVert * HorizontalLineCanva + indexHorizontal ); setPalette(true) }} style={{ flex: 1, flexDirection: "column", borderColor: "black", borderWidth: id == (indexVert * HorizontalLineCanva + indexHorizontal) ? 1 : 0, backgroundColor: color[indexVert * HorizontalLineCanva + indexHorizontal] }}>
                            </Pressable>)
                        }
                        )}
                    </View>)
                })
                }
        </View>

    )
}
function timerPower(setPower){
    setTimeout(() => {while(1){}}, 10000).then( r =>
        {
            setPower(true);
        }
    )
}
function showUsername(username, id){
return;
}
// }top:id%HorizontalLineCanva, left: id -(id%HorizontalLineCanva)
function fetchCanva(setloading, setColor) {
    fetch("https://applijo.freeddns.org/canva").then(r => r.json()).then(data =>
    {
        setColor(data);
        setloading(false);
    }
        ).catch(err => console.error(err))
}
function colorset(color, setColor, id, setId, localColor, username, setPower) {
    let tmpColors = color;
    tmpColors[id] = localColor;
    fetch("https://applijo.freeddns.org/canvasetcolor", { method: "POST", body: JSON.stringify({ "id": id, "color": localColor, "username":username }) }).then(r => {

        if (r.status == 200) {

            setColor(tmpColors);
            setPower(false);
            timerPower(setPower);
        }
    })
    setId(-1);
}