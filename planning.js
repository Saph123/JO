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
    var now = Date.now();
    var min = new Date(planning['Soirée d\'ouverture!'][0]) - Date.now();
    if(min > 0)
    {
        min = Math.trunc(min/1000.0);
        return {time:min, name:"Soirée d'ouverture"};
    }
    for (var event in planning)
    {

        // 
    }
    // var dateJO = new Date('2021-08-26T20:00:00');
}
