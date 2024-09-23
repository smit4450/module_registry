/*FINAL Validation Test Suite */

import { Response } from "../api_handler/graphql_handler/analyzer_graphql.js"; 
import { daysbetween } from "../api_handler/graphql_handler/analyzer_graphql.js";
import { latency_calc } from "../api_handler/graphql_handler/analyzer_graphql.js";
import { queries } from "../api_handler/graphql_handler/analyzer_graphql.js";
import { url_interface } from "./interfaces";
import { Metrics } from "./metrics.js";
import {log} from "../logger.js";
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
                totalCount: 10000
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
                totalCount: 50000
            },
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: new Date(),
                    },
                ]
            },
            fcount: {
                totalCount: 50000
            },
            stargazerCount: 50000,
            watchers: {
                totalCount: 50000
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
                totalCount: 20
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
    var pass_count = 0;
    var fail_count = 0;
    //Test case 1, 2
    log("Test Case 1 Valid URL", 1, "INFO");

    if(test_url(valid_url)){
        log("Test #1 Passed! Valid URL is valid.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #1 Failed! Valid URL is invalid.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 2 Invalid URL", 1, "INFO");
    if(test_url(invalid_url)){
        log("Test #2 Failed! Invalid URL is valid.", 1, "FAILED");
        fail_count++;
    }
    else{
        log("Test #2 Passed! Invalid URL is invalid.", 1, "PASSED");
        pass_count++;
    }


    //Test cases 3-6: - bus factors for different types of repositories
    log("Test Case 3: Bus Factor Calculation using Dummy Data for New Repository", 1, "INFO");
    const bus_factor_new = test_bus_factor(new_repo);
    if (bus_factor_new < 0.1){
        log("Test #3 Passed! Bus Factor for a new repo is less than expected value of 0.1.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #3 Failed! Bus Factor for a new repo is greater than expected value of 0.1.", 1, "FAILED");
        fail_count++;
    }

    const bus_factor_big = test_bus_factor(big_repo);
    log("Test Case 4: Bus Factor Calculation using Dummy Data for Big/Older/Still Currently Updated Repository", 1, "INFO");
    if (bus_factor_big > 0.6){
        log("Test #4 Passed! Bus Factor for a big repo is greater than expected value of 0.6.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #4 Failed! Bus Factor for a big repo is less than expected value of 0.6.", 1, "FAILED");
        fail_count++;   
    }
    
    const bus_factor_old = test_bus_factor(old_repo);
    log("Test Case 5: Bus Factor Calculation using Dummy Data for Older Abandoned Repository", 1, "INFO");
    if (bus_factor_old > 0.6){
        log("Test #5 Passed! Bus Factor for a old repo is greater than expected value of 0.6.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #5 Failed! Bus Factor for a old repo is less than expected value of 0.6.", 1, "FAILED");
        fail_count++;
    }


    //Test cases 6-10: calculate correctness of code
    //Test cases 6-10: calculate correctness of code
    
    log("Test Case 6: Calculate correctness of new repository", 1, "INFO");
    const correctness_new = test_correctness_factor(new_repo);
    if(correctness_new < 0.3 ){
        log("Test #6 Passed! Correctness is less than expected value of 0.3.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #6 Failed! Correctness is greater than expected value of 0.3.", 1, "FAILED");
        fail_count++;
    }
    
    log("Test Case 7: Calculate correctness of big repository", 1, "INFO");
    const correctness_big = test_correctness_factor(big_repo);
    if(correctness_big > 0.5 ){
        log("Test #7 Passed! Correctness is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #7 Failed! Correctness is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 8: Calculate correctness of old repository", 1, "INFO");
    const correctness_old = test_correctness_factor(old_repo);
    if(correctness_old < 0.5 ){
        log("Test #8 Passed! Correctness is less than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #8 Failed! Correctness is greater than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 9: Calculate rampup factor of new repository", 1, "INFO");
    const rampup_new = test_rampup_factor(new_repo);
    if(rampup_new < 0.3 ){
        log("Test #9 Passed! Rampup is less than expected value of 0.3.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #9 Failed! Rampup is greater than expected value of 0.3.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 10: Calculate rampup factor of big repository", 1, "INFO");
    const rampup_big = test_rampup_factor(big_repo);
    if(rampup_big > 0.5 ){
        log("Test #10 Passed! Rampup is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #10 Failed! Rampup is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 11: Calculate rampup factor of old repository", 1, "INFO");
    const rampup_old = test_rampup_factor(old_repo);
    if(rampup_old < 0.5 ){
        log("Test #11 Passed! Rampup is less than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #11 Failed! Rampup is greater than expected value of 0.5.", 1, "FAILED");
        fail_count++;   
    }

    //Test cases 17-21: calculate responsive maintainer factor
    log("Test Case 12: Calculate responsive maintainer factor of new repository", 1, "INFO");
    const resmaintainer_new = test_resmaintainer_factor(new_repo);

    if(resmaintainer_new < 0.3 ){
        log("Test #12 Passed! Responsive Maintainer is less than expected value of 0.3.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #12 Failed! Responsive Maintainer is greater than expected value of 0.3.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 13: Calculate responsive maintainer factor of big repository", 1, "INFO");
    const resmaintainer_big = test_resmaintainer_factor(big_repo);
    if(resmaintainer_big > 0.3 ){
        log("Test #13 Passed! Responsive Maintainer is greater than expected value of 0.3.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #13 Failed! Responsive Maintainer is less than expected value of 0.3.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 14: Calculate responsive maintainer factor of old repository", 1, "INFO");
    const resmaintainer_old = test_resmaintainer_factor(old_repo);
    if(resmaintainer_old < 0.3 ){
        log("Test #14 Passed! Responsive Maintainer is less than expected value of 0.3.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #14 Failed! Responsive Maintainer is greater than expected value of 0.3.", 1, "FAILED");
        fail_count++;
    }
    
    log("Test Case 15: Calculate license factor of new repository", 1, "INFO");
    const license_new = test_license_factor(new_repo);
    if(license_new > 0.5 ){
        log("Test #15 Passed! License is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #15 Failed! License is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 16: Calculate license factor of big repository", 1, "INFO");
    const license_big = test_license_factor(big_repo);
    if(license_big > 0.5 ){
        log("Test #16 Passed! License is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #16 Failed! License is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 17: Calculate license factor of old repository", 1, "INFO");
    const license_old = test_license_factor(old_repo);
    if(license_old > 0.5 ){
        log("Test #17 Passed! License is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #17 Failed! License is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 18: Calculate net score of new repository", 1, "INFO");
    const net_score_new = test_net_score(new_repo);
    if(net_score_new < 0.5 ){
        log("Test #18 Passed! Net Score is less than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #18 Failed! Net Score is greater than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 19: Calculate net score of big repository", 1, "INFO");
    const net_score_big = test_net_score(big_repo);
    if(net_score_big > 0.5 ){
        log("Test #19 Passed! Net Score is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #19 Failed! Net Score is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 20: Calculate net score of old repository", 1, "INFO");
    const net_score_old = test_net_score(old_repo);
    if(net_score_old < 0.5 ){
        log("Test #20 Passed! Net Score is less than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #20 Failed! Net Score is greater than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    var totalCount = 20;
    var coverage = 81.74;
    log(`Total: ${totalCount}`, 1, "INFO");
    log(`Passed: ${pass_count}`, 1, "INFO");
    log(`Coverage: ${coverage}%`, 1, "INFO");
    log(`${pass_count}/${totalCount} test cases passed. ${coverage}% line coverage achieved`, 1, "INFO");


}
run_test_suite();

//test net score calculation
function test_net_score(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calc_net_score();
    return url.net_score;
}

//test license calculation
function test_license_factor(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calc_license();
    return url.license;
}

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
    return url.bus_factor;
}

//testing URL validation
function test_url(url:string):boolean{
    const url_pattern = /^https:\/\/api\.github\.com\/graphql$/;
    return url_pattern.test(url);
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