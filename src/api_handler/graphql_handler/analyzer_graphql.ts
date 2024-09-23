//token protections
import { error } from 'console';
import * as dotenv from 'dotenv'; 
import { ListFormat, moveSyntheticComments } from 'typescript';
dotenv.config();
export interface queries {
    years:number
    open:number
    partic:number
    len_i:number
    info:Response
    depend_m:number,
    update_m:number
    depend:number
    start : Date,
    now : Date,
    update: Date,
    calclat : number

}


const NUM = 10;

//object structuring for response from query
export interface Response {
    data: {
        repository: {
            diskUsage: number;
            mentionableUsers: {
                totalCount: number;
                nodes: [
                    {
                        contributionsCollection: {
                            totalIssueContributions: number;
                            totalPullRequestContributions: number;
                            totalPullRequestReviewContributions: number;
                            totalRepositoryContributions: number;
                        }
                    }   
                ]
            }
            contributingGuidelines: {
                body: String;
            }
            codeOfConduct: {
                body: String;
            }
            description: String;
            hasWikiEnabled: boolean;
            dependencyGraphManifests: {
                edges: [
                    {
                        node: {
                            dependencies: {
                                totalCount: number;
                            }
                            dependenciesCount: number;
                        }
                    }
                ]
            }
            icount: {
                totalCount: number;
            }
            issues: {
                nodes: [
                    {
                        participants: {
                            totalCount: number;
                        }
                        closed: boolean;
                        updatedAt: Date;
                    }
                ]
            }
            createdAt: Date;
            updatedAt: Date;
            vulnerabilityAlerts: {
                totalCount: number
            }
            prcount: {
                totalCount: number;
            }
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: Date,
                    }
                ]
            }
            fcount: {
                totalCount: number;
            }
            stargazerCount: number;
            watchers: {
                totalCount: number;
            }
            licenseInfo: {
                name: String;
            }
            license: {
                text: String;
            }
            license2: {
                text: String;
            }
            readme: {
                text: String;
            }
            readme2: {
                text: String;
            }
        }
        rateLimit: {
            cost: number;
            remaining: number;
            resetAt: Date;
        }
    };
}

const start = new Date();

//url and token handling
const input = "https://github.com/lodash/lodash";
const TOKEN = process.env.TOKEN;
export const GRAPHQL_URL = 'https://api.github.com/graphql';

//input url processing
const mod = input.substring(19);
const sep = mod.indexOf('/');
const owner = mod.substring(0, sep);
const name = mod.substring(sep+1);

//query parameters
export const query = `
query {
  rateLimit {
    cost
    remaining
    resetAt
  }
	repository(owner: "${owner}", name: "${name}") {
    diskUsage
    mentionableUsers(first: 10) {
      totalCount
      nodes {
        contributionsCollection {
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalRepositoryContributions
        }
      }
    }
    contributingGuidelines {
      body
    }
    codeOfConduct {
      body
    }
    description
    hasWikiEnabled
    dependencyGraphManifests {
      edges {
        node {
          dependencies{
            totalCount
          }
          dependenciesCount
        }
      }
    }
    icount: issues {
      totalCount
    }
    issues(last: 20) {
      nodes {
        participants {
          totalCount
        }
        closed
        updatedAt
      }
    }
    createdAt
    updatedAt
    vulnerabilityAlerts {
      totalCount
    }
    prcount: pullRequests {
      totalCount
    }
    pullRequests(last: 10) {
      nodes {
        publishedAt
      }
    }
    fcount: forks {
      totalCount
    }
    stargazerCount
    watchers {
      totalCount
    }
    licenseInfo {
      name
    }
    readme: object(expression: "main:README.md") {
      ... on Blob {
        text
      }
    }
    readme2: object(expression: "master:README.md") {
      ... on Blob {
        text
      }
    }
    license: object(expression: "main:LICENSE") {
      ... on Blob {
        text
      }
    }
    license2: object(expression: "master:LICENSE") {
      ... on Blob {
        text
      }
    } 
  }
}
`
;

//request headers
export const headers = {
    Authorization: `bearer ${TOKEN}`,
    'Content-Type': 'application/json',
};


//action item
export async function fetch_repo(GRAPHQL_URL:string, headers: HeadersInit,query:string, NUM:number):Promise<queries> {
    try {
        console.log("Fetching repository data...");
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query })
        });
        console.log("Repository data fetched successfully.");

        const data = await response.json();
        if(data) {
            //casting as prerecorded interface
            const info = data as Response;
            
            //checking for rate limit and ensuring warnings are issued and information is provided
            if(info.data && info.data.rateLimit) {
                const rate = info.data.rateLimit;
                if(rate.remaining <= rate.cost) {
                    console.log('WARNING: You have reached the rate limit. To get more information, please wait until: ${rate.resetAt}');
                }
            }

            //getting the metrics from the response
            if(info.data && info.data.repository) {
                const metrics = info.data.repository;
                //for all numbers, refer to GraphQL decision matrices
                var now = new Date();
                var update = new Date(metrics.updatedAt);
                var create = new Date(metrics.createdAt);
                var years = daysbetween(create, update) / 365.0;
                
                var depend = 0;
                var open = 0;
                var partic = 0;
                var len_i = metrics.issues.nodes.length - 1;
                for(let i = 0; i <= len_i; i++) {
                    //participants in issues
                    partic += metrics.issues.nodes[i].participants.totalCount;
                    
                    //calculating open issues
                    if(!metrics.issues.nodes[i].closed) {
                        open += 1;
                    }         
                }

                for(let i = 0; i < metrics.dependencyGraphManifests.edges.length; i++) {
                    depend += metrics.dependencyGraphManifests.edges[i].node.dependenciesCount;
                }
                depend /= metrics.diskUsage;
                partic /= NUM * 2;
                var end = new Date();
                var calclat = latency_calc(now, end);
                

                // bus factor
                // var bus, depend_m;
                // [bus, depend_m] = busfactor(info, years, depend); 
                // var end = new Date();
                // var buslat = latency_calc(now, end);
                // console.log("Ans is now",buslat)

                //correctness
                // var cor, update_m;
                // [cor, update_m] = correctness(info, start, update, open);
                // end = new Date();
                // var corlat = latency_calc(now, end) - buslat + calclat;

                //ramp up
                // var ram = rampup(info, years, update_m);
                // end = new Date();
                // var ramlat = latency_calc(now, end) - corlat + calclat;
                
                //responsive maintainer
                // var res = responsive(info, partic, len_i, update_m, depend_m);
                // end = new Date();
                // var reslat = latency_calc(now, end) - ramlat + calclat;

                //licensing
                // var lic = license(info);
                // end = new Date();
                // var liclat = latency_calc(now, end) - corlat;

                // //netscore
                // var net = (bus + cor + ram + res * 2 + lic) / 6;
                // end = new Date();
                // var netlat = latency_calc(start, end);

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
                    start:start,
                    update:update,
                    calclat:calclat

                }
                return parameters
                // console.log(net);
                // console.log(netlat);
                // console.log(buslat);
                // console.log(corlat);
                // console.log(ramlat);
                // console.log(reslat);
                // console.log(liclat);
            }
            else {
                throw new Error("Repository data info not found.");
            }
        }
        else {
            throw new Error("Repository data not found.");
        }
    }
    catch(error) {
        throw new Error("Hel")
    }
}



// function busfactor(info: Response, years: number, depend: number): [number, number] {
//     const metrics = info.data.repository;
//     const BUS_TOTAL = 45 + 60 + 50 + 35;

//     var contr = exists(metrics.mentionableUsers.totalCount);
//     var contr_i = metrics.mentionableUsers.nodes.length - 1;
//     var sum = 0;
//     for(let i = 0; i <= contr_i; i++) {
//         //estimating contributions per repository
//         sum += (metrics.mentionableUsers.nodes[i].contributionsCollection.totalIssueContributions + metrics.mentionableUsers.nodes[i].contributionsCollection.totalPullRequestReviewContributions + metrics.mentionableUsers.nodes[i].contributionsCollection.totalPullRequestContributions);   
//     }
//     var c_act = sum / NUM;
//     var contr_m = ver_bounds((contr/years)/40);
//     var cact_m = ver_bounds(c_act/100);
//     var doc = 0;
//     doc = str_exists(metrics.contributingGuidelines, doc, true);
//     doc = str_exists(metrics.codeOfConduct, doc, true);
//     doc = str_exists(metrics.description, doc, false);
//     var doc_m = (doc / 10000) * 0.75;
//     if(metrics.hasWikiEnabled) {
//         doc_m += 0.25;
//     }
//     doc_m = ver_bounds(doc_m);
//     var depend_m = ver_bounds(depend/0.01);

//     var bus = (contr_m * 45 + cact_m * 60 + doc_m * 50 + depend_m * 35) / BUS_TOTAL;
//     console.log(bus);
//     return [bus, depend_m];
// }
// function correctness(info: Response, start: Date, update: Date, open: number): [number, number] {
//     const metrics = info.data.repository;
//     const COR_TOTAL = 65 + 55 + 70;

//     var vul = exists(metrics.vulnerabilityAlerts.totalCount);
//     vul /= metrics.diskUsage;
//     var open_m = ver_bounds(open / 20);
//     var update_m = ver_bounds(1 - (daysbetween(update, start) / 30));
//     var vul_m = ver_bounds(1 - (vul / 0.001));
    
//     var cor = (open_m * 65 + update_m * 55 + vul_m * 70) / COR_TOTAL;
//     console.log(cor);
//     return [cor, update_m];
// }
// function rampup(info: Response, years: number, update_m: number): number {
//     const metrics = info.data.repository;
//     const RAM_TOTAL = 65 + 65 + 55 + 35 + 45 + 65;

//     var is = exists(metrics.icount.totalCount);
//     var prs = exists(metrics.prcount.totalCount);
//     var fs = exists(metrics.fcount.totalCount);
//     var stars = exists(metrics.stargazerCount);
//     var ws = exists(metrics.watchers.totalCount);
//     var icount_m = ver_bounds((is/years) / 730);
//     var prcount_m = ver_bounds((prs/years) / 365);
//     var fcount_m = ver_bounds((fs/years) / 1000);
//     var scount_m = ver_bounds((stars/years) / 10000);
//     var wcount_m = ver_bounds((ws/years) / 100);
    
//     var ram = (icount_m * 65 + prcount_m * 65 + fcount_m * 55 + scount_m * 35 + wcount_m * 45 + update_m * 65) / RAM_TOTAL;
//     console.log(ram);
//     return ram;
// }
// function responsive(info: Response, partic: number, len_i: number, update_m: number, depend_m: number): number {
//     const metrics = info.data.repository;
//     const RES_TOTAL = 50 + 55 + 45 + 45 + 35;

//     var len_pr = metrics.pullRequests.nodes.length - 1;
//     var issue_time;
//     var pr_time;
//     if(len_i != -1) {
//         issue_time = new Date(metrics.issues.nodes[len_i].updatedAt);
//     }
//     if(len_pr != -1) {
//         pr_time = new Date(metrics.pullRequests.nodes[len_pr].publishedAt);
//     }
//     var ipar_m = ver_bounds(partic / 5);
//     var itime_m = 0;
//     if(issue_time) {
//         itime_m = ver_bounds(1 - ((daysbetween(issue_time, start) - 10) / 365));
//     }
//     var prtime_m = 0;
//     if(pr_time) {
//         prtime_m = ver_bounds(1 - ((daysbetween(pr_time, start) - 10) / 365));
//     }
    
//     var res = (ipar_m * 50 + itime_m * 55 + prtime_m * 45 + update_m * 45 + depend_m * 35) / RES_TOTAL;
//     console.log(res);
//     return res;
// }
// function license(info: Response): number {
//     const metrics = info.data.repository;
//     const LIC_TOTAL = 50 + 70;

//     var lic = 0;
//     if(metrics.licenseInfo.name) {
//         lic = 1;
//     }
//     console.log(lic);
//     return lic;
// }

export function daysbetween(before: Date, after: Date): number {
    //gets difference in milliseconds, then converts to days
    return (after.getTime() - before.getTime()) / (1000 * 60 * 60 * 24);
}
export function latency_calc(before: Date, after: Date): number {
    return (after.getTime() - before.getTime()) / (1000);
}
export function str_exists(metric: any, adjust: number, body: boolean): number {
    if(metric && body) {
        adjust += metric.body.length;
    }
    else if(metric) {
        adjust += metric.length;
    }
    return adjust;
}
export function ver_bounds(m: any): number {
    if(m == null || m < 0) {
        return 0;
    }
    if(m > 1) {
        return 1;
    }
    return m;
}
export function exists(metric: any): number {
    if(!metric) {
        return 0;
    }
    return metric;
}
export function checkcompatible(text: String, lictext: any, lic: number) {
    var i;
    for(i in lictext) {
        if(text.includes(lictext[i])) {
            return 1;
        }
    }
    return lic;
}

