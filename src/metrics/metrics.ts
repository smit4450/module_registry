import {url_interface} from './interfaces.js'

export class Metrics {
    private url:url_interface;
    private contributors: number
    private activity: number
    private documentation: number
    private dependencies: number

    public constructor(url:url_interface, contributors: number, activity: number, documentation: number, dependencies: number) {
        this.url = url;
        this.contributors = contributors;
        this.activity = activity;
        this.documentation = documentation;
        this.dependencies = dependencies;
    }

    // areej creating bus factor equation based on metrics determined from milestone 3
    calculate_bus_factor():void {

        // weights for each factor
        const weights = {
            contributors: 0.4,
            activity: 0.3,
            documentation: 0.2,
            dependencies: 0.1
        }

        // calculate bus factor mini scores
        const contributors_score = (this.contributors / 40) * weights.contributors;         // max 40 contributors
        const activity_score = (this.activity / 100) * weights.activity;                     // avrage activity sum 100+ commits
        const documentation_score = (this.documentation / 10000) * weights.documentation;      // max 10000+ characters
        const dependencies_score = (this.dependencies / 0.05) * weights.dependencies;         // greater than 0.05 dependencies
        
        // total score of bus factor
        const bus_factor = contributors_score + activity_score + documentation_score + dependencies_score;

        // normalize the bus factor
        const maxBusFactor = Object.values(weights).reduce((a, b) => a + b, 0);
        const busFactorValue = (bus_factor / maxBusFactor) * Object.keys(weights).length;   // normalize based on number of factors

        this.url.bus_factor = bus_factor;
    }

    calculate_responsive_maintainer(){
        const responsive_maintainer = 0;
        this.url.responsive_maintainer = responsive_maintainer;
    }




}

// for metric fork count, are you able to get the number of forks created in the last 30 days from github graphql api?

/*
class npm_metrics {
    url:Url;
    public constructor(url:Url) {
        this.url = url;
    }

    // areej creating bus factor equation based on metrics determined from milestone 3
    calculate_bus_factor(dependencies: number, uniqueAuthors: number, maintainers: number):number {

        // weights for each factor
        const weights = {
            dependencies: 0.4,
            uniqueAuthors: 0.3,
            maintainers: 0.3
        }

        // calculate bus factor mini scores
        const dependencies_score = (dependencies / 4.39) * weights.dependencies;         // average 4.39 dependencies
        const uniqueAuthors_score = (uniqueAuthors > 3 ? 1 : 0) * weights.uniqueAuthors; // ratio condition
        const maintainers_score = (maintainers >= 15 && maintainers <= 45 ? 
                                    (maintainers / 45) * weights.maintainers : 0);       // maintainers range 15-45
        
        // total score of bus factor
        const bus_factor = dependencies_score + uniqueAuthors_score + maintainers_score;

        // normalize the bus factor
        const maxBusFactor = Object.values(weights).reduce((a, b) => a + b, 0);
        const busFactorValue = (bus_factor / maxBusFactor) * Object.keys(weights).length;   // normalize based on number of factors
        
        return busFactorValue;
    }

    calculate_responsive_maintainer(){
        
    }


}
*/
