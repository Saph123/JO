import styles from "./style";
import * as React from 'react';
import { View, Text, Image, Linking } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

export function VanRommelScreen() {
    let textPresentation = "La Friterie Van Rommel fondée en 2020 par Paul & Fritz Van Rommel père & fils.\nCes véritables spécialistes du poulycroc (maison) et de la friture en tout genre ont vu leur renommée dépasser les frontières du Brabant Wallon."
    let text2 = "L'amour du poulet et des patates est dans notre ADN."
    return (
        <ScrollView>
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Image style={styles.logosah} source={require('./assets/vanrommel.png')} /></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16, textAlign: "center" }}>{text2}</Text></View>

                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 12 }}>{textPresentation}</Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Image style={styles.chicken} source={require('./assets/chicken.png')} /></View>
                </View>
            </View>
            <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
            <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
            <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}>Des bons ingrédients mais aussi des bons outils.</Text></View>
            <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
            <View style={{ alignItems: "center" }}><Image style={{ width: 310, height: 164 }} source={require('./assets/williwaller2006.png')} /></View>
            <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
            <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
            <Image style={{ borderRadius: 40, width: 50, height: 50, marginLeft: 20 }} source={require('./assets/PaulB.jpg')} />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 80, marginTop: -33 }}> Paul B.:</Text>
            <Text style={{ fontSize: 14, fontStyle: "italic", marginLeft: 150, marginTop: -25, color: "blue", textAlign: "center" }}> “Mon seul regret est de ne jamais avoir pu travailler avec les Van Rommel.”</Text>
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'flex-start', flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <TouchableOpacity onPress={() => Linking.openURL('mailto:fritkotvanrommel@gmail.com')}>
                        <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16, color: "blue", textDecorationLine: "underline" }}>Nous contacter</Text></View>
                    </TouchableOpacity>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>

                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                    <TouchableOpacity onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSfNP_1o3R7emNIM9B-JFRfge6lWQuD_0gyflO3xorB0MNUaVg/viewform')}>
                        <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16, color: "blue", textDecorationLine: "underline" }}>Nous rejoindre</Text></View>
                    </TouchableOpacity>
                    <View style={{ alignItems: "center" }}><Text style={{ fontSize: 16 }}> </Text></View>
                </View>
            </View>
        </ScrollView>

    )

}