import planning from './assets/planning.json';

export class Planning{
    constructor(){
        this.listeevent = []

        for (var event in planning)
        {
            this.listeevent.push({eventname:event, timeBegin:new Date(planning[event][0]), timeEnd:new Date(planning[event][1])});
        }
    }
    
}
export function getNextEventseconds(){
    var min = new Date(planning['Soirée d\'ouverture!'][0]) - Date.now(); // test
    if(min > 0)
    {
        min = Math.trunc(min/1000.0);
        return {time:min, name:"Soirée d'ouverture"};
    }
    else{
        if(Math.trunc(min/1000.0) < (-5 * 3600)) // stop du gif après 6h de soirave
        {
            return {time:-1, name:"Soirée d'ouverture"}
        }
        return{time:0, name:"Soirée d'ouverture"}
    }
    // var dateJO = new Date('2021-08-26T20:00:00');
}
