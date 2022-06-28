import styles from "./style";
import * as React from 'react';
import { View, Modal, Pressable, ActivityIndicator, Animated, PanResponder } from 'react-native';
import { VerticalLineCanva, HorizontalLineCanva } from "./global";
export function CanvaScreen() {
    const [arrayVert, setArrayVert] = React.useState([]);
    const [arrayHorizontal, setArrayHorizontal] = React.useState([]);
    const [palette, setPalette] = React.useState(true);
    const [id, setId] = React.useState(-1);
    const [color, setColor] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

  
    React.useEffect(() => {
        let tmpVert = [];
        let tmpHorizontal = [];
        let tmpcolor = [];
        for (let i = 0; i < VerticalLineCanva; i++) {
            tmpVert.push(0);
            for (let i = 0; i < HorizontalLineCanva; i++) {
                tmpcolor.push("white");
                
            }
        }
        for (let i = 0; i < HorizontalLineCanva; i++){
            tmpHorizontal.push(0);
        }
        setColor(tmpcolor);
        setArrayVert(tmpVert);
        setArrayHorizontal(tmpHorizontal);
        setLoading(false);
    }, []);
    if (loading) {
        return (<ActivityIndicator size="large" color="#000000" />)

    }
    return (
        <View style={{flex:1, backgroundColor:"red"}}>


             <Modal
              onStartShouldSetResponder={() => true}
              onResponderMove={(event) => {
               alert(event.nativeEvent.locationX)
                touch.setValue({
                  x: event.nativeEvent.locationX,
                  y: event.nativeEvent.locationY,
                });}}
                transparent={false}
                visible={palette}
                onRequestClose={() => {setPalette(false);alert("kek")}}
            >
                <View  style={styles.palette}>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "black")}><View style={{borderColor: "black", borderWidth:1, width:20, height:20, backgroundColor:"black"}}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "red")}><View style={{borderColor: "black", borderWidth:1, width:20, height:20, backgroundColor:"red"}}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "yellow")}><View style={{borderColor: "black", borderWidth:1, width:20, height:20, backgroundColor:"yellow"}}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "blue")}><View style={{borderColor: "black", borderWidth:1, width:20, height:20, backgroundColor:"blue"}}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "green")}><View style={{borderColor: "black", borderWidth:1, width:20, height:20, backgroundColor:"green"}}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "cyan")}><View style={{borderColor: "black", borderWidth:1, width:20, height:20, backgroundColor:"cyan"}}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "brown")}><View style={{borderColor: "black", borderWidth:1, width:20, height:20, backgroundColor:"brown"}}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "white")}><View style={{borderColor: "black", borderWidth:1, width:20, height:20, backgroundColor:"white"}}></View></Pressable>
                    <Pressable style={{ flex: 1 }} onPress={() => colorset(color, setColor, id, setId, "pink")}><View style={{borderColor: "black", borderWidth:1, width:20, height:20, backgroundColor:"pink"}}></View></Pressable>
                </View>
                {arrayVert.map((r, indexVert) => {
                return (<View style={{ flex: 1, flexDirection: "row", zIndex:10, elevation:10 }}>

                    {arrayHorizontal.map((z, indexHorizontal) => {
                        return (<Pressable key={indexVert * HorizontalLineCanva + indexHorizontal} onPress={() => {setId(indexVert * HorizontalLineCanva + indexHorizontal); setPalette(true) }} style={{ flex: 1, flexDirection: "column", borderColor: "black",  borderWidth:id == (indexVert * HorizontalLineCanva + indexHorizontal) ? 1: 0, backgroundColor: color[indexVert * HorizontalLineCanva + indexHorizontal] }}>
                        </Pressable>)
                    }
                    )}
                </View>)
            })
            }
            </Modal>
            {arrayVert.map((r, indexVert) => {
                return (<View style={{ flex: 1, flexDirection: "row", zIndex:10, elevation:10 }}>

                    {arrayHorizontal.map((z, indexHorizontal) => {
                        return (<Pressable key={indexVert * HorizontalLineCanva + indexHorizontal} onPress={() => {setId(indexVert * HorizontalLineCanva + indexHorizontal) }} style={{ flex: 1, flexDirection: "column", borderColor: id == (indexVert * HorizontalLineCanva + indexHorizontal) ? "white": "grey", borderWidth: 1, backgroundColor: color[indexVert * HorizontalLineCanva + indexHorizontal] }}>
                        </Pressable>)
                    }
                    )}
                </View>)
            })
            }
        </View>

    )
}

function colorset(color, setColor, id, setId, localColor) {
    let tmpColors = color;
    tmpColors[id] = localColor;
    setColor(tmpColors);
    setId(-1);
    // setPalette(false);
}