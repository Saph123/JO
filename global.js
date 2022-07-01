import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
export let version = 4
export const SportContext = React.createContext(false);
export const ArbitreContext = React.createContext(false);
export const ChatContext = React.createContext(false);
export const LockContext = React.createContext(false);

export let initialLineNumber = {
    "Trail": 0,
    "Dodgeball": 0,
    "Pizza": 0,
    "Tong": 0,
    "Babyfoot": 0,
    "Flechette": 0,
    "PingPong": 0,
    "Orientation": 0,
    "Beerpong": 0,
    "Volley": 0,
    "Waterpolo": 0,
    "Larmina": 0,
    "Natation": 0,
    "SpikeBall": 0,
    "Ventriglisse": 0,
    "100mRicard": 0,
    "Petanque": 0,
    "Molky": 0,
    "Clicker": 0,
    "Home": 0
};

export let adminlist = [
    "Max",
    "Antoine",
    "Ugo",
    "Pierrick"
]
export let paletteColors = ["white", "purple", "darkblue", "blue", "lightblue", "green", "lightgreen", "yellow", "brown", "orange", "red","pink","lightgrey", "grey", "black"]
export async function calcInitLines(){
    let result = await SecureStore.getItemAsync("initialLineNumber");
    if (result) {
        initialLineNumber = JSON.parse(result);
        return 1;
    } else {
        return 0;
    }
}