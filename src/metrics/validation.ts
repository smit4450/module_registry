/*FINAL Validation Test Suite */

import { TestContext } from "node:test";
import { Response } from "../api_handler/graphql_handler/analyzer_graphql.js"; 
import { daysbetween } from "../api_handler/graphql_handler/analyzer_graphql.js";
import { latency_calc } from "../api_handler/graphql_handler/analyzer_graphql.js";
import { queries } from "../api_handler/graphql_handler/analyzer_graphql.js";
import { url_interface } from "./interfaces";
import { Metrics } from "./metrics.js";
import { calculate_factors, get_url_interface } from "../index.js";

//dummy data modeling a newly made repository


const new_repo: Response = {
    data: {
        repository: {
            diskUsage: 1,
            mentionableUsers: {
                totalCount: 0,
                nodes: [
                    {
                        contributionsCollection: {
                            totalIssueContributions: 0,
                            totalPullRequestContributions: 0,
                            totalPullRequestReviewContributions: 0,
                            totalRepositoryContributions: 0,
                        }
                    }   
                ]
            },
            contributingGuidelines: {
                body: "This is a sample contributing guideline."
            },
            codeOfConduct: {
                body: "This is a sample code of conduct."
            },
            description: "This is a sample description.",
            hasWikiEnabled: false,
            dependencyGraphManifests: {
                edges: [
                    {
                        node: {
                            dependencies: {
                                totalCount: 0
                            },
                            dependenciesCount: 0
                        }
                    }
                ]
            },
            icount: {
                totalCount: 0
            },
            issues: {
                nodes: [
                    {
                        participants: {
                            totalCount: 0
                        },
                        closed: true,   
                                 
                        updatedAt: new Date()// 24 hours in milliseconds //current date and time
                    }
                ]
            },
            createdAt: new Date(), //current date and time
            updatedAt: new Date(), //current date and time
            vulnerabilityAlerts: {
                totalCount: 0
            },
            prcount: {
                totalCount: 0
            },
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: new Date(),
                    }
                ]
            },
            fcount: {
                totalCount: 0
            },
            stargazerCount: 0,
            watchers: {
                totalCount: 0
            },
            licenseInfo: {
                name : "MIT License",
            },
            license: {
                text: "null"
            },
            license2: {
                text: "null"
            },
            readme: {
                text: "null"
            },
            readme2: {
                text: "null"
            }
        },
        rateLimit: {
            cost: 0,
            remaining: 5000,
            resetAt: new Date() 
        }
    }
};
const big_repo: Response = {
    data: {
        repository: {
            diskUsage: 100000,
            mentionableUsers: {
                totalCount: 500,
                nodes: [
                    {
                        contributionsCollection: {
                            totalIssueContributions: 100,
                            totalPullRequestContributions: 100,
                            totalPullRequestReviewContributions: 100,
                            totalRepositoryContributions: 100,
                        }
                    }   
                ]
            },
            contributingGuidelines: {
                body: "This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline."
            },
            codeOfConduct: {
                body: "This is a sample code of conduct."
            },
            description: "This is a sample description.",
            hasWikiEnabled: true,
            dependencyGraphManifests: {
                edges: [
                    {
                        node: {
                            dependencies: {
                                totalCount: 100
                            },
                            dependenciesCount: 100
                        }
                    }
                ]
            },
            icount: {
                totalCount: 100
            },
            issues: {
                nodes: [
                    {
                        participants: {
                            totalCount: 50
                        },
                        closed: true,
                        updatedAt: new Date() //current date and time
                    }
                ]
            },
            //march 2012 date
            createdAt: new Date(2012, 2, 1),
            updatedAt: new Date(), //current date and time
            vulnerabilityAlerts: {
                totalCount: 1
            },
            prcount: {
                totalCount: 100
            },
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: new Date(),
                    }
                ]
            },
            fcount: {
                totalCount: 3000
            },
            stargazerCount: 50,
            watchers: {
                totalCount: 50
            },
            licenseInfo: {
                name : "MIT License"
            },
            license: {
                text: "null"
            },
            license2: {
                text: "null"
            },
            readme: {
                text: "null"
            },
            readme2: {
                text: "null"
            }
        },
        rateLimit: {
            cost: 2500,
            remaining: 2500,
            resetAt: new Date()
        }
    }
};
const old_repo: Response = {
    data: {
        repository: {
            diskUsage: 100000,
            mentionableUsers: {
                totalCount: 5000,
                nodes: [
                    {
                        contributionsCollection: {
                            totalIssueContributions: 9000,
                            totalPullRequestContributions: 12000,
                            totalPullRequestReviewContributions: 9500,
                            totalRepositoryContributions: 8700,
                        }
                    }   
                ]
            },
            contributingGuidelines: {
                body: "This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline."
            },
            codeOfConduct: {
                body: "This is a sample code of conduct."
            },
            description: "This is a sample description.",
            hasWikiEnabled: true,
            dependencyGraphManifests: {
                edges: [
                    {
                        node: {
                            dependencies: {
                                totalCount: 100
                            },
                            dependenciesCount: 100
                        }
                    }
                ]
            },
            icount: {
                totalCount: 5
            },
            issues: {
                nodes: [
                    {
                        participants: {
                            totalCount: 10
                        },
                        closed: true,
                        updatedAt: new Date(2005, 5, 20) //current date and time
                    }
                ]
            },
            //march 2012 date
            createdAt: new Date(1998, 5, 15),
            updatedAt: new Date(2005, 5, 20), //current date and time
            vulnerabilityAlerts: {
                totalCount: 1
            },
            prcount: {
                totalCount: 5
            },
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: new Date(2002, 7, 30),
                    }
                ]
            },
            fcount: {
                totalCount: 6000
            },
            stargazerCount: 800,
            watchers: {
                totalCount: 4000
            },
            licenseInfo: {
                name : "MIT License"
            },
            license: {
                text: "null"
            },
            license2: {
                text: "null"
            },
            readme: {
                text: "null"
            },
            readme2: {
                text: "null"
            }
        },
        rateLimit: {
            cost: 2500,
            remaining: 2500,
            resetAt: new Date(2005, 5, 20)
        }
    }
};

const NUM = 10;
// GitHub URL validation test
async function run_test_suite(): Promise<void>{
    const valid_url = "https://api.github.com/graphql";
    const invalid_url = "https://api.github.com/rest";

    //Test case 1, 2
    console.log("Test Case 1,2: Validating URLs");
    test_url(valid_url, invalid_url);

    //Test cases 3-6: - bus factors for different types of repositories
    console.log("Test Case 3: Bus Factor Calculation using Dummy Data for New Repository");
    const bus_factor_new = test_bus_factor(new_repo);
    if (bus_factor_new < 0.1){
        console.log("Test #3 Passed! Bus Factor for a new repo is less than expected value of 0.1.");
    }
    else{
        console.log("Test #3 Failed! Bus Factor for a new repo is greater than expected value of 0.1.");
    }

    const bus_factor_big = test_bus_factor(big_repo);
    console.log("Test Case 4: Bus Factor Calculation using Dummy Data for Big/Older/Still Currently Updated Repository");
    if (bus_factor_big > 0.6){
        console.log("Test #4 Passed! Bus Factor for a big repo is greater than expected value of 0.6.");
    }
    else{
        console.log("Test #4 Failed! Bus Factor for a big repo is less than expected value of 0.6.");
    }
    
    const bus_factor_old = test_bus_factor(old_repo);
    console.log("Test Case 5: Bus Factor Calculation using Dummy Data for Older Abandoned Repository");
    if (bus_factor_old > 0.6){
        console.log("Test #5 Passed! Bus Factor for a old repo is greater than expected value of 0.6.");
    }
    else{
        console.log("Test #5 Failed! Bus Factor for a old repo is less than expected value of 0.6.");
    }


    //Test cases 7-11: calculate correctness of code
    
    console.log("Test Case 7: Calculate correctness of new repository");
    const correctness_new = test_correctness_factor(new_repo);
    if(correctness_new < 0.3 ){
        console.log("Test #7 Passed! Correctness is less than expected value of 0.3.");
    }
    else{
        console.log("Test #7 Failed! Correctness is greater than expected value of 0.3.");
    }
    
    console.log("Test Case 8: Calculate correctness of big repository");
    const correctness_big = test_correctness_factor(big_repo);
    if(correctness_big > 0.5 ){
        console.log("Test #8 Passed! Correctness is greater than expected value of 0.5.");
    }
    else{
        console.log("Test #8 Failed! Correctness is less than expected value of 0.5.");
    }

    console.log("Test Case 9: Calculate correctness of old repository");
    const correctness_old = test_correctness_factor(old_repo);
    if(correctness_old > 0.5 ){
        console.log("Test #9 Passed! Correctness is less than expected value of 0.5.");
    }
    else{
        console.log("Test #9 Failed! Correctness is greater than expected value of 0.5.");

    //Test cases 12-16: calculate rampup factor
    console.log("Test Case 12: Calculate rampup factor of new repository");
    const rampup_new = test_rampup_factor(new_repo);
    if(rampup_new < 0.3 ){
        console.log("Test #12 Passed! Rampup is less than expected value of 0.3.");
    }
    else{
        console.log("Test #12 Failed! Rampup is greater than expected value of 0.3.");
    }

    console.log("Test Case 13: Calculate rampup factor of big repository");
    const rampup_big = test_rampup_factor(big_repo);
    if(rampup_big > 0.5 ){
        console.log("Test #13 Passed! Rampup is greater than expected value of 0.5.");
    }
    else{
        console.log("Test #13 Failed! Rampup is less than expected value of 0.5.");
    }

    console.log("Test Case 14: Calculate rampup factor of old repository");
    const rampup_old = test_rampup_factor(old_repo);
    if(rampup_old > 0.5 ){
        console.log("Test #14 Passed! Rampup is less than expected value of 0.5.");
    }
    else{
        console.log("Test #14 Failed! Rampup is greater than expected value of 0.5.");
    }

    //Test cases 17-21: calculate responsive maintainer factor
    console.log("Test Case 17: Calculate responsive maintainer factor of new repository");
    const resmaintainer_new = test_resmaintainer_factor(new_repo);

    if(resmaintainer_new < 0.3 ){
        console.log("Test #17 Passed! Responsive Maintainer is less than expected value of 0.3.");
    }
    else{
        console.log("Test #17 Failed! Responsive Maintainer is greater than expected value of 0.3.");
    }

    console.log("Test Case 18: Calculate responsive maintainer factor of big repository");
    const resmaintainer_big = test_resmaintainer_factor(big_repo);
    if(resmaintainer_big > 0.5 ){
        console.log("Test #18 Passed! Responsive Maintainer is greater than expected value of 0.5.");
    }
    else{
        console.log("Test #18 Failed! Responsive Maintainer is less than expected value of 0.5.");
    }

    console.log("Test Case 19: Calculate responsive maintainer factor of old repository");
    const resmaintainer_old = test_resmaintainer_factor(old_repo);
    if(resmaintainer_old > 0.5 ){
        console.log("Test #19 Passed! Responsive Maintainer is less than expected value of 0.5.");
    }
    else{
        console.log("Test #19 Failed! Responsive Maintainer is greater than expected value of 0.5.");
    }
    // console.log("Test Case 4: Bus Factor Calculation using Data for Lodash");
    // const repository_info =await get_url_interface("https://github.com/lodash/lodash");
    // console.log(repository_info);
    // // console.log(repository_info);
    // console.log("Bus Factor: ", repository_info.bus_factor);
    // if (repository_info.bus_factor > 0.6) {
    //     console.log("Test #4 Passed! Bus Factor is greater than expected value of 0.6.");
    // }
    //test_bus_factor(repository_info.bus_factor);
    }
}
run_test_suite();

//test res maintainer calculation
function test_resmaintainer_factor(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calc_responsive_maintainer();
    return url.responsive_maintainer;
}

//test rampup calculation
function test_rampup_factor(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calculate_rampup();
    return url.ramp_up;
}
//test correctness calculation
function test_correctness_factor(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calculate_correctness();
    return url.correctness;
}

//test bus factor calculation
function test_bus_factor(repository:Response):number {
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calculate_bus_factor();
    // metrics.calculate_rampup();
    // metrics.calc_responsive_maintainer();
    // metrics.calc_license();
    // metrics.calc_net_score();
    console.log(`Calculated Bus Factor: ${url.bus_factor}`);
    return url.bus_factor;
}

//testing URL validation
function test_url(valid_url:string, invalid_url: string):void {
    const url_pattern = /^https:\/\/api\.github\.com\/graphql$/;

    if(url_pattern.test(valid_url)){
        console.log("Testing Valid_URL: Passed!");
    }
    else{
        console.log("Testing Valid_URL: Failed!");
    }
    if(url_pattern.test(invalid_url)){
        console.log("Testing Invalid URL: Failed!");
    }
    else{
        console.log("Testing Invalid_URL: Passed!");
    }

}   

//utils for creating test objects 
function get_factors(parameters:queries):url_interface {
    const url:url_interface
     = {
        bus_factor:0,
        bus_factor_latency:0,
        responsive_maintainer:0,
        responsive_maintainer_latency:0,
        ramp_up:0,
        ramp_up_latency:0,
        correctness:0,
        correctness_latency:0,
        license:0,
        license_latency:0,
        net_score:0,
        net_score_latency:0,
        disk:0
    };
    return url;

}

function get_parameters(info:Response) {
    const metrics = info.data.repository;
    //for all numbers, refer to GraphQL decision matrices

    //no need to error check these dates due to being nonnullable
    var now = new Date();
    var update = new Date(metrics.updatedAt);
    var create = new Date(metrics.createdAt);
    var years = daysbetween(create, update) / 365.0;
    
    if(years < 1) {
        years = 1;
    }
    
    var depend = 0;
    var open = 0;
    var partic = 0;
    var len_i = 0;
    if(metrics.issues && metrics.issues.nodes) {
        len_i = metrics.issues.nodes.length - 1;
        for(let i = 0; i <= len_i; i++) {
            //participants in issues
            partic += metrics.issues.nodes[i].participants.totalCount;
            //calculating open issues
            if(!metrics.issues.nodes[i].closed) {
                open += 1;
            }         
        }
    }
    if(metrics.dependencyGraphManifests && metrics.dependencyGraphManifests.edges) {
        for(let i = 0; i < metrics.dependencyGraphManifests.edges.length; i++) {
            depend += metrics.dependencyGraphManifests.edges[i].node.dependenciesCount;
        }
    }
    
    var disk = metrics.diskUsage;
    if(metrics.diskUsage < 1) {
        disk = 1;
    }

    depend /= disk;
    if(len_i < 1) {
        len_i = 1;
    }
    partic /= len_i;
    

    var end = new Date();
    var calclat = latency_calc(now, end);
    


    const parameters:queries = {
        years:years,
        open:open,
        partic:partic,
        len_i:len_i,
        info:info,
        depend_m:-1,
        update_m:-1,
        depend:depend,
        now :now,
        start:new Date(),
        update:update,
        calclat:calclat,
        disk:disk,
    }
    return parameters
}
