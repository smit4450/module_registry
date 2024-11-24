//token protections
import * as dotenv from 'dotenv';
import { log } from '../../logger.js';
dotenv.config();
const NUM = 10;
//url and token handling
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
export const GRAPHQL_URL = 'https://api.github.com/graphql';
//input url processing
//query parameters
//request headers
export const headers = {
    Authorization: `bearer ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
};
//action item
export async function fetch_repo(GRAPHQL_URL, headers, urlInput, start) {
    var query = set_query(urlInput);
    try {
        log("Fetching repository data...", 1, "INFO");
        log("-------------------------" + urlInput + "-------------------------", 1, "INFO");
        // console.log("Fetching repository data...");
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query })
        });
        const data = await response.json();
        if (data) {
            //casting as prerecorded interface
            const info = data;
            //console.log(data);
            //checking for rate limit and ensuring warnings are issued and information is provided
            if (info.data && info.data.rateLimit) {
                const rate = info.data.rateLimit;
                if (rate.remaining <= rate.cost) {
                    log('You have reached the rate limit. To get more information, please wait until: ${rate.resetAt}', 2, "WARNING");
                }
            }
            //getting the metrics from the response
            if (info.data && info.data.repository) {
                const metrics = info.data.repository;
                //for all numbers, refer to GraphQL decision matrices
                //no need to error check these dates due to being nonnullable
                var now = new Date();
                var update = new Date(metrics.updatedAt);
                var create = new Date(metrics.createdAt);
                var years = daysbetween(create, update) / 365.0;
                if (years < 1) {
                    years = 1;
                }
                var depend = 0;
                var open = 0;
                var partic = 0;
                var len_i = 0;
                if (metrics.issues && metrics.issues.nodes) {
                    len_i = metrics.issues.nodes.length - 1;
                    for (let i = 0; i <= len_i; i++) {
                        //participants in issues
                        partic += metrics.issues.nodes[i].participants.totalCount;
                        //calculating open issues
                        if (!metrics.issues.nodes[i].closed) {
                            open += 1;
                        }
                    }
                }
                if (metrics.dependencyGraphManifests && metrics.dependencyGraphManifests.edges) {
                    for (let i = 0; i < metrics.dependencyGraphManifests.edges.length; i++) {
                        depend += metrics.dependencyGraphManifests.edges[i].node.dependenciesCount;
                    }
                }
                var disk = metrics.diskUsage;
                if (metrics.diskUsage < 1) {
                    disk = 1;
                }
                depend /= disk;
                if (len_i < 1) {
                    len_i = 1;
                }
                partic /= len_i;
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
                const parameters = {
                    years: years,
                    open: open,
                    partic: partic,
                    len_i: len_i,
                    info: info,
                    depend_m: -1,
                    update_m: -1,
                    depend: depend,
                    now: now,
                    start: start,
                    update: update,
                    calclat: calclat,
                    disk: disk,
                };
                return parameters;
            }
            else {
                throw new Error("Repository data info not found.");
            }
        }
        else {
            throw new Error("Repository data not found.");
        }
    }
    catch (error) {
        throw error;
    }
}
export function daysbetween(before, after) {
    //gets difference in milliseconds, then converts to days
    return (after.getTime() - before.getTime()) / (1000 * 60 * 60 * 24);
}
export function latency_calc(before, after) {
    return (after.getTime() - before.getTime()) / (1000);
}
export function str_exists(metric, adjust, body) {
    if (metric && body) {
        adjust += metric.body.length;
    }
    else if (metric) {
        adjust += metric.length;
    }
    return adjust;
}
export function ver_bounds(m) {
    if (m == null || m < 0) {
        return 0;
    }
    if (m > 1) {
        return 1;
    }
    return m;
}
export function exists(metric) {
    if (!metric) {
        return 0;
    }
    return metric;
}
export function checkcompatible(text, lictext, lic) {
    var i;
    for (i in lictext) {
        if (text.includes(lictext[i])) {
            return 1;
        }
    }
    return lic;
}
export function checkRequirementsTxt(text) {
    const lines = text.split('\n');
    return lines.map(line => {
        const matches = line.matchAll(/([a-zA-Z0-9_-]+)([~=<>!]*)([^,\s]*)/g);
        return Array.from(matches).map(match => {
            const [, name, prefix, version] = match;
            return { name, prefix, version };
        });
    }).flat().filter(Boolean);
}
export function checkPackageJson(text) {
    const json = JSON.parse(text);
    const dependencies = { ...json.dependencies, ...json.devDependencies };
    return Object.entries(dependencies).map(([name, version]) => {
        const matches = version.matchAll(/([~^]?)([^,\s]*)/g);
        return Array.from(matches).map(match => {
            const [, prefix, version] = match;
            return { name, prefix, version };
        });
    }).flat().filter(Boolean);
}
export function checkGemfile(text) {
    const lines = text.split('\n');
    return lines.map(line => {
        const matches = line.matchAll(/^gem ['"](.+)['"], ['"]([~^]?)(.+)['"]$/g);
        return Array.from(matches).map(match => {
            const [, name, prefix, version] = match;
            return { name, prefix, version };
        });
    }).flat().filter(Boolean);
}
function set_query(input) {
    const mod = input.substring(19);
    const sep = mod.indexOf('/');
    const owner = mod.substring(0, sep);
    const name = mod.substring(sep + 1);
    const query = `
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
    pullRequests(last: 100) {
      nodes {
        title
        additions
        state
        reviews(first: 1) {
          totalCount
        }
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
    requirements: object(expression: "main:requirements.txt") {
      ... on Blob {
        text
      }
    }
    requirements2: object(expression: "master:requirements.txt") {
      ... on Blob {
        text
      }
    }
    package: object(expression: "main:package.json") {
      ... on Blob {
        text
      }
    }
    package2: object(expression: "master:package.json") {
      ... on Blob {
        text
      }
    }
    gem: object(expression: "main:Gemfile") {
      ... on Blob {
        text
      }
    }
    gem2: object(expression: "master:Gemfile") {
      ... on Blob {
        text
      }
    }
  }
}
`;
    return query;
}
