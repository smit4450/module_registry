//token protections
import * as dotenv from 'dotenv'; 
import { moveSyntheticComments } from 'typescript';
dotenv.config();

const NUM = 10;
//object structuring for response from query

interface Reponse {
    data: {
        repository: {
            diskUsage: number;
            isDisabled: boolean;
            isArchived: boolean;
            isLocked: boolean;
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
            forks: {
                nodes: [
                    {
                        createdAt: String;
                    }
                ]
            }
            stargazerCount: number;
            watchers: {
                totalCount: number;
            }
            licenseInfo: {
                pseudoLicense: boolean;
                body: String;
                limitations: {
                    label: String;
                }
                implementation: String;
                conditions: {
                    description: String;
                }
            }
        }
        rateLimit: {
            cost: number;
            remaining: number;
            resetAt: String;
        }
    };
}

//url and token handling
const input = "https://github.com/lodash/lodash";
const TOKEN = process.env.TOKEN;
const GRAPHQL_URL = 'https://api.github.com/graphql';

//input url processing
const mod = input.substring(19);
const sep = mod.indexOf('/');
const info = {
    owner: mod.substring(0, sep),
    name: mod.substring(sep+1)
};

//query parameters
const query = `
query {
  rateLimit {
    cost
    remaining
    resetAt
  }
	repository(owner: "lodash", name: "lodash") {
    diskUsage
    isDisabled
    isArchived
    isLocked
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
    pullRequests(last:10) {
      nodes {
        publishedAt
      }
    }
    fcount: forks {
      totalCount
    }
    forks (last: 10) {
      nodes {
        createdAt
      }
    }
    stargazerCount
    watchers {
      totalCount
    }
    licenseInfo {
      body
      pseudoLicense
      limitations {
        label
      }
      implementation 
      conditions {
        description
      }
    } 
  }
}
`
;

//request headers
const headers = {
    Authorization: `bearer ${TOKEN}`,
    'Content-Type': 'application/json',
};

//action item
fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query })
})
.then(response => response.json())
.then(data => {
    //handling information recieved from API
    if(data) {
        //casting as prerecorded interface
        const info = data as Reponse;
        //getting the metrics from the response
        if(info.data && info.data.repository) {
            const metrics = info.data.repository;
            var contr = metrics.mentionableUsers.totalCount;
            var update = new Date(metrics.updatedAt);
            var now = new Date();
            var vul = metrics.vulnerabilityAlerts.totalCount / metrics.diskUsage;
            var create = new Date(metrics.createdAt);
            var years = daysbetween(create, update) / 365.0;
            var is = metrics.icount.totalCount;
            var prs = metrics.prcount.totalCount;
            var fs = metrics.fcount.totalCount;
            var stars = metrics.stargazerCount;
            var ws = metrics.watchers.totalCount;
            var len_i = metrics.issues.nodes.length - 1;

            var len_pr = metrics.pullRequests.nodes.length - 1;
            var issue_time = new Date(metrics.issues.nodes[len_i].updatedAt);
            var pr_time = new Date(metrics.pullRequests.nodes[len_pr].publishedAt); 
            
            var sum = 0;
            var depend = 0;
            var open = 0;
            var partic = 0;
            for(let i = 0; i < NUM; i++) {
                //estimating contributions per repository
                sum += (metrics.mentionableUsers.nodes[i].contributionsCollection.totalIssueContributions + metrics.mentionableUsers.nodes[i].contributionsCollection.totalPullRequestReviewContributions + metrics.mentionableUsers.nodes[i].contributionsCollection.totalPullRequestContributions);
                //participants in issues
                partic += metrics.issues.nodes[i].participants.totalCount;
                
                //calculating open issues
                if(!metrics.issues.nodes[i].closed) {
                    open += 1;
                }   
                if(!metrics.issues.nodes[i+10].closed) {
                    open += 1;
                }       
            }
            for(let i = 0; i < metrics.dependencyGraphManifests.edges.length; i++) {
                depend += metrics.dependencyGraphManifests.edges[i].node.dependenciesCount;
            }
            var c_act = sum / NUM;
            depend /= metrics.diskUsage;
            partic /= NUM * 2;


            //for all numbers, refer to GraphQL decision matrices
            //bus factor
            
            const BUS_TOTAL = 45 + 60 + 50 + 35;

            var contr_m = ver_bounds((contr/years)/40);;
            var cact_m = ver_bounds(c_act/100);
            var doc = 0;
            doc = str_exists(metrics.contributingGuidelines, doc, true);
            doc = str_exists(metrics.codeOfConduct, doc, true);
            doc = str_exists(metrics.description, doc, false);
            var doc_m = (doc / 10000) * 0.75;
            if(metrics.hasWikiEnabled) {
                doc_m += 0.25;
            }
            doc_m = ver_bounds(doc_m);
            var depend_m = ver_bounds(depend/0.01);

            var bus = (contr_m * 45 + cact_m * 60 + doc_m * 50 + depend_m * 35) / BUS_TOTAL;
            console.log(bus);

            //correctness
            const COR_TOTAL = 65 + 55 + 70;

            var open_m = ver_bounds(open / 20);
            var update_m = ver_bounds(1 - (daysbetween(update, now) / 30));
            var vul_m = ver_bounds(1 - (vul / 0.001));
            
            var cor = (open_m * 65 + update_m * 55 + vul_m * 70) / COR_TOTAL;
            console.log(cor);

            //ramp up
            const RAM_TOTAL = 65 + 65 + 55 + 35 + 45 + 65;

            var icount_m = ver_bounds((is/years) / 730);
            var prcount_m = ver_bounds((prs/years) / 365);
            var fcount_m = ver_bounds((fs/years) / 1000);
            var scount_m = ver_bounds((stars/years) / 10000);
            var wcount_m = ver_bounds((ws/years) / 100);
            
            var ram = (icount_m * 65 + prcount_m * 65 + fcount_m * 55 + scount_m * 35 + wcount_m * 45 + update_m * 65) / RAM_TOTAL;
            console.log(ram);
            
            //responsive maintainer
            const RES_TOTAL = 50 + 55 + 45 + 45 + 35;

            var ipar_m = ver_bounds(partic / 5);
            var itime_m = ver_bounds(1 - ((daysbetween(issue_time, now) - 10) / 365));
            var prtime_m = ver_bounds(1 - ((daysbetween(pr_time, now) - 10) / 365));
            
            var res = (ipar_m * 50 + itime_m * 55 + prtime_m * 45 + update_m * 45 + depend_m * 35) / RES_TOTAL;
            console.log(res);

            //licensing
            const LIC_TOTAL = 50 + 70;

            var lic_info = 0;
            var body = 0;
            if(metrics.licenseInfo.pseudoLicense && metrics.licenseInfo.body) {
                if(metrics.licenseInfo.limitations) {
                    lic_info = str_exists(metrics.licenseInfo.limitations.label, lic_info, false);
                }
                if(metrics.licenseInfo.conditions) {
                    lic_info = str_exists(metrics.licenseInfo.conditions.description, lic_info, false);
                }
                lic_info = str_exists(metrics.licenseInfo.implementation, lic_info, false);
                body = str_exists(metrics.licenseInfo.body, lic_info, false);
            }
            var licinfo_m = ver_bounds(lic_info / 300);
            var body_m = ver_bounds(body / 200);

            var lic = (licinfo_m * 50 + body_m * 70) / LIC_TOTAL;
            console.log(lic);
            //latency

            //netscore
            
        }
        //checking for rate limit and ensuring warnings are issued and information is provided
        if(info.data && info.data.rateLimit) {
            const rate = info.data.rateLimit;
            if(rate.remaining <= rate.cost) {
                console.log("WARNING: You have reached the rate limit. To get more information, please wait until ", rate.resetAt);
            }
        }
    }
})
.catch(error => {
    console.error('Error making the request:', error);
});

function daysbetween(before: Date, after: Date): number {
    //gets difference in milliseconds, then converts to days
    return (after.getTime() - before.getTime()) / (1000 * 60 * 60 * 24);
}
function str_exists(metric: any, adjust: number, body: boolean): number {
    if(metric && body) {
        adjust += metric.body.length;
    }
    else if(metric) {
        adjust += metric.length;
    }
    return adjust;
}
function ver_bounds(m: any): number {
    if(m == null || m < 0) {
        return 0;
    }
    if(m > 1) {
        return 1;
    }
    return m;
}