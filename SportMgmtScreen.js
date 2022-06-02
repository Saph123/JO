import styles from "./style";
import * as React from 'react';
import { View, ActivityIndicator, Text, TextInput, Image, Pressable } from 'react-native';
import PinchZoomView from 'react-native-pinch-zoom-view';
import { fetch_teams, updateTeams } from "./utils";


export function SportMgmtScreen({ route }) {

    const [loadingmain, setloading] = React.useState(true);
    const [toupdate, setToUpdate] = React.useState(false);
    const [realListe, setListe] = React.useState([]);
    React.useEffect(() => {
        fetch_teams(route.params.sportname).then(r => {
            setListe(r);
            setloading(false);
        }).catch(err => { console.log(err); navigation.navigate('HomeScreen') });


    }, []);

    if (loadingmain) {
        return (<ActivityIndicator size="large" color="#000000" />)
    }
    return (
        <PinchZoomView style={{ position: 'absolute', backgroundColor: "lightgrey", top: 0, left: 0, width: 1500, height: 1500 }} setToUpdate={setToUpdate} toupdate={toupdate} maxScale={1} minScale={0.5} >
            <View style={{ position: 'absolute', top: 100, left: 0 }}>

                <View style={{ flexDirection: "row" }}>
                    <View>
                        <Text style={styles.showPlayers}>Équipe/Athlète</Text>
                        {realListe.map(r =>
                            <TextInput key={r.username} onChangeText={(text) => { r.username = text; }} style={styles.showPlayers}>{r.username}</TextInput>
                        )
                        }
                    </View>
                    <View style={{ width: 60, height: 60, backgroundColor: "lightgrey", justifyContent:"center" }}>
                        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center" }]} onPress={() => { // Function to save only the results!
                            setListe([...realListe]);
                            updateTeams(username, route.params.sportname, realListe);
                        }
                        }>
                            <Image resizeMode="cover" resizeMethod="resize" style={{alignSelf:"center"}} source={require('./assets/save.png')}></Image>
                        </Pressable>

                    </View>
                </View>
</View>

        </PinchZoomView>

    )
};