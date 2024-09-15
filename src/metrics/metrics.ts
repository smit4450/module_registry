import {Url} from './classes.js'

class metrics {
    url:Url;
    public constructor(url:Url) {
        this.url = url;
    }
    calculate_bus_factor(url:string):number {
        
        return 0;
    }

    calculate_responsive_maintainer(){
        
    }


}

// for metric fork count, are you able to get the number of forks created in the last 30 days from github graphql api?
