import sport_names from './assets/sports_names.json';
import { fetch_status } from './trace';
export async function fetch_all(){
    let sportnames = [];
    let allmatches = [];
    let allstatus = [];
    for( var sport in sport_names.sports){
        console.log(sport);
        sportnames.push(sport_names.sports[sport])
        sport_names.sports[sport] = "Beerpong"; // verrue à enlever!!

        var matches = await fetch("http://91.121.143.104:7070/teams/" + sport_names.sports[sport] + "_matches.json").then(r => r.json()).then(data =>  {return data }).catch(err => console.log("kekw",err));
        var status = await fetch("http://91.121.143.104:7070/teams/" + sport_names.sports[sport] + "_status.json").then(r => r.json()).then(data => {
            // displayed_state = data['status'];
            return data;
        }).catch(err => console.log("_status.json", err));
        console.log(sportnames);
        allmatches.push(matches)
        allstatus.push(status)
        // console.log(status);

    }
    console.log(allmatches[1])
    console.log(allstatus[2])


}