import planning from './assets/planning.json';

export class Planning{
    constructor(){
        for (var event in planning)
        {
            console.log(event);
        }
    }
    
}
export function getNextEventseconds(){
    var now = Date.now();
    var min = new Date(planning['start']) - Date.now();
    console.log(min);
    if(min > 0)
    {
        min = Math.trunc(min/1000.0);
        return {time:min, name:"Soirée d'ouverture"};
    }
    for (var event in planning)
    {

        // console.log(planning[event]);
    }
    // var dateJO = new Date('2021-08-26T20:00:00');
}
