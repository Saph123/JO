import * as React from 'react';
import { Button, View, FlatList, Text, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render } from 'react-dom';
import {Svg, Rect, Circle, Path, Line, Polyline} from 'react-native-svg';
class Teams{
    constructor(sport, playerNames, uniqueId){
        // this.numberOfPlayer = Number(numberOfPlayer)
        this.playerNames = playerNames
        this.sport = sport
        this.stillInGame = true
        this.uniqueId = uniqueId
    }
}
let arrayteam = [];
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        <View style={{
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  }}
/>
      <Text>Home Screen</Text>
      <Button  style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}
        title="Beerpong"
        onPress={() => {fetch_teams("Beerpong").then(r => navigation.navigate('BeerpongDetails'))}}
      />
      <View style={{
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  }}
/>
      <Button  style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}
        title="LancerdeTong"
        onPress={() => navigation.navigate('LancerdeTongDetails')}
      />
      <View style={{
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  }}
/>
      <Button  style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}
        title="Waterpolo"
        onPress={() => navigation.navigate('WaterpoloDetails')}
      />
      <View
  style={{
  borderLeftWidth: 1,
  borderLeftColor: 'black',
  }}
/>
      <View style={{
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  }}
/>
      <Button  style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}
        title="centmetreRicard"
        onPress={() => {navigation.navigate('centmetreRicardDetails')}}
        // onPress={() => fetch("http://localhost:8080/TC_found.txt").then((response) => response.json())}
      />
      <View style={{
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  }}
/>
      <Button  style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}
        title="Trail"
        onPress={() => fetch_teams("Beerpong")}/>
    </View>
  );

 
}
function fetch_teams(sportname){
    return new Promise((resolve,reject) => {
    // import teams from  ("./assets/teams.json");
    setTimeout( async function() {

 
    let teams = await fetch("http://localhost:8080/teams_"+sportname+".json").then(response => response.json()).then(data => {return data});
    arrayteam = []
    for(const prop in await teams){
        for (const team in teams[prop])
        {
                arrayteam.push( new Teams(sportname, teams[prop][team]["Players"]));
        }
    }
    
    typeof arrayteam !== 'undefined'? resolve(arrayteam): reject(console.log(arrayteam));},500);
})
}

// async function fetch_teams(sportname){
//     return new Promise((resolve,reject) => {
//     // import teams from  ("./assets/teams.json");
    
//     let teams = await fetch("http://localhost:8080/teams_"+sportname+".json").then(response => response.json()).then(data => {return data});
//     arrayteam = []
//     for(const prop in await teams){
//         for (const team in teams[prop])
//         {
//                 console.log(teams[prop][team]["Players"])
//                 arrayteam.push( new Teams(sportname, teams[prop][team]["Players"]));
//         }
//     }
//     return array}
// }
function get_arrayteam(sport){
    let currentSportTeams = []
    for( const sports of arrayteam)
    {
            currentSportTeams.push(sports.playerNames)
    };

    
    return(currentSportTeams)
}

// function tick() {
//     const element = (
//       <div>
//         <h1>Hello, world!</h1>
//         <h2>It is {new Date().toLocaleTimeString()}.</h2>
//       </div>
//     );
//     render(
//       element,
//       document.getElementById('root')
//     );
//   }
  
//   setInterval(tick, 1000);
  
function BeerpongDetailsScreen({ navigation }) {
    const window = Dimensions.get("window").width
  return (
    <View style={{ flex: 1, alignItems: 'center', alignItems:"stretch",justifyContent:'flex-start'}}>
        <View
        
  style={{
  borderLeftWidth: 1,
  borderLeftColor: 'black',
  borderRightWidth:2,
  borderRightColor: 'black',
  }}
/>

    
    <Trace equipe={get_arrayteam("Beerpong")}/>
    <View style={{ flex: 1, alignItems: 'stretch', width:"500", height:"50"}}>{console.log(Dimensions.get("window").width + "/" + arrayteam.length)}
        
    <Team equipe={get_arrayteam("Beerpong")}/>
    </View>
    <View style={{ flex: 1, alignItems: 'center'}}>
    <Button style={{width:"100", height:"50", alignItems:"center"}} color='red' title="back to menu" onPress={() => navigation.navigate('Home')} />
    </View>
    </View>
  );
}
function LancerdeTongDetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
      <Text style={{flex:6, color:'red'}}>LancerdeTong!</Text>
    <View style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
    <Button color='red' title={hugeText} onPress={() => navigation.navigate('Home')} />
    </View>
    </View>
  );
}
let obj;
function centmetreRicardDetailsScreen({ navigation }) {
  return (
      
    <View style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
      <Text style={{flex:6, color:'red'}}>{arrayteam}</Text>
        
    <View style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
    <Button color='red' title="Home" onPress={() => navigation.navigate('Home')} />
    </View>
    </View>
  );
}

const Team = (props) => {
    const{equipe} = props;
    return(
        <View style={{flexDirection: 'row', alignItems:"stretch", justifyContent:"space-between"}}>
            
                {equipe.map(r => <Text style={{backgroundColor:"powderblue", alignItems:"stretch",justifyContent:"space-between"}}>{r}</Text>)}
            
        </View>
    )
}


const Trace = (props) => {
    const{equipe} = props;
    const window=Dimensions.get("window").width
    return(
        <View style={{flexDirection: 'row', alignItems:"stretch", justifyContent:"space-between"}}>
        {equipe.map((r, index) => 
        <Svg>
            <Polyline
               points= "50,100 100,50 200,50 200,50 200,100"
               fill="none"
               stroke="black"
               strokeWidth="3"
             />  </Svg>)}

             </View>
    )
        }

function WaterpoloDetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
      <Text style={{flex:6, color:'red'}}>WaterpoloDetailsScreen!</Text>
    <View style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
    <Button color='red' title="Home" onPress={() => navigation.navigate('Home')} />
    </View>
    </View>
  );
}
function TrailDetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
      <Text style={{flex:6, color:'red'}}>TrailDetailsScreen!</Text>
    <View style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
    <Button color='red' title="Home" onPress={() => navigation.navigate('Home')} />
    </View>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BeerpongDetails" component={BeerpongDetailsScreen} />
        <Stack.Screen name="LancerdeTongDetails" component={LancerdeTongDetailsScreen} />
        <Stack.Screen name="centmetreRicardDetails" component={centmetreRicardDetailsScreen} />
        <Stack.Screen name="WaterpoloDetails" component={WaterpoloDetailsScreen} />
        <Stack.Screen name="TrailDetails" component={TrailDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
