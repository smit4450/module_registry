import { queries } from '../api_handler/graphql_handler/analyzer_graphql.js';
import {url_interface} from './interfaces.js'
import { Response } from '../api_handler/graphql_handler/analyzer_graphql.js';
import { exists } from '../api_handler/graphql_handler/analyzer_graphql.js';
import { ver_bounds } from '../api_handler/graphql_handler/analyzer_graphql.js';
import { str_exists } from '../api_handler/graphql_handler/analyzer_graphql.js';
import { daysbetween } from '../api_handler/graphql_handler/analyzer_graphql.js';
import { latency_calc } from '../api_handler/graphql_handler/analyzer_graphql.js';

const NUM = 10;

export class Metrics {
    private url:url_interface;
    private parameters:queries
    public constructor(url:url_interface, parameters:queries) {
        this.url = url;
        this.parameters=parameters
    }

    calculate_bus_factor(): void {
        const metrics = this.parameters.info.data.repository;
        const BUS_TOTAL = 45 + 60 + 50 + 35;

        var contr = exists(metrics.mentionableUsers.totalCount);
        var contr_i = metrics.mentionableUsers.nodes.length - 1;
        var sum = 0;
        for(let i = 0; i <= contr_i; i++) {
            //estimating contributions per repository
            sum += (metrics.mentionableUsers.nodes[i].contributionsCollection.totalIssueContributions + metrics.mentionableUsers.nodes[i].contributionsCollection.totalPullRequestReviewContributions + metrics.mentionableUsers.nodes[i].contributionsCollection.totalPullRequestContributions);   
        }
        var c_act = sum / NUM;
        var contr_m = ver_bounds((contr/this.parameters.years)/40);
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
        var depend_m = ver_bounds(this.parameters.depend/0.01);

        var bus = (contr_m * 45 + cact_m * 60 + doc_m * 50 + depend_m * 35) / BUS_TOTAL;
        console.log(bus);
        this.parameters.depend_m = depend_m;
        this.url.bus_factor=bus;
        var end = new Date();
        var buslat = latency_calc(this.parameters.now, end);
        this.url.bus_factor_latency = buslat;
        console.log("Bus factor latency: ",buslat);
    }

    calculate_correctness(): void {
        const metrics = this.parameters.info.data.repository;
        const COR_TOTAL = 65 + 55 + 70;
    
        var vul = exists(metrics.vulnerabilityAlerts.totalCount);
        vul /= metrics.diskUsage;
        var open_m = ver_bounds(this.parameters.open / 20);
        var update_m = ver_bounds(1 - (daysbetween(this.parameters.update, this.parameters.start) / 30));
        var vul_m = ver_bounds(1 - (vul / 0.001));
        
        var cor = (open_m * 65 + update_m * 55 + vul_m * 70) / COR_TOTAL;
        console.log(cor);
        this.parameters.update_m=update_m;
        this.url.correctness=cor;
        var end = new Date();
        var corlat = latency_calc(this.parameters.now, end) - this.url.bus_factor_latency + this.parameters.calclat
        this.url.correctness_latency = corlat
    }

    calculate_rampup(): void {
        const metrics = this.parameters.info.data.repository;
        const RAM_TOTAL = 65 + 65 + 55 + 35 + 45 + 65;

        var is = exists(metrics.icount.totalCount);
        var prs = exists(metrics.prcount.totalCount);
        var fs = exists(metrics.fcount.totalCount);
        var stars = exists(metrics.stargazerCount);
        var ws = exists(metrics.watchers.totalCount);
        var icount_m = ver_bounds((is/this.parameters.years) / 730);
        var prcount_m = ver_bounds((prs/this.parameters.years) / 365);
        var fcount_m = ver_bounds((fs/this.parameters.years) / 1000);
        var scount_m = ver_bounds((stars/this.parameters.years) / 10000);
        var wcount_m = ver_bounds((ws/this.parameters.years) / 100);
        
        var ram = (icount_m * 65 + prcount_m * 65 + fcount_m * 55 + scount_m * 35 + wcount_m * 45 + this.parameters.update_m * 65) / RAM_TOTAL;
        this.url.ramp_up = ram;
        var end = new Date();
        var ramlat = latency_calc(this.parameters.now, end) - this.url.correctness_latency + this.parameters.calclat;
        this.url.ramp_up_latency = ramlat;

    }

    calc_responsive_maintainer(): number {
        const metrics = this.parameters.info.data.repository;
        const RES_TOTAL = 50 + 55 + 45 + 45 + 35;

        var len_pr = metrics.pullRequests.nodes.length - 1;
        var issue_time;
        var pr_time;
        if(this.parameters.len_i != -1) {
            issue_time = new Date(metrics.issues.nodes[this.parameters.len_i].updatedAt);
        }
        if(len_pr != -1) {
            pr_time = new Date(metrics.pullRequests.nodes[len_pr].publishedAt);
        }
        var ipar_m = ver_bounds(this.parameters.partic / 5);
        var itime_m = 0;
        if(issue_time) {
            itime_m = ver_bounds(1 - ((daysbetween(issue_time, this.parameters.start) - 10) / 365));
        }
        var prtime_m = 0;
        if(pr_time) {
            prtime_m = ver_bounds(1 - ((daysbetween(pr_time, this.parameters.start) - 10) / 365));
        }
        
        var res = (ipar_m * 50 + itime_m * 55 + prtime_m * 45 + this.parameters.update_m * 45 + this.parameters.depend_m * 35) / RES_TOTAL;
        this.url.responsive_maintainer = res;
        var end = new Date();
        var reslat = latency_calc(this.parameters.now, end) - this.url.ramp_up_latency + this.parameters.calclat;
        this.url.responsive_maintainer_latency = reslat;
        return res;
    }

    calc_net_score() {
        var net = (this.url.bus_factor + this.url.correctness + this.url.ramp_up + this.url.responsive_maintainer * 2 + this.url.license) / 6.
        var end = new Date();
        var netlat = latency_calc(this.parameters.start, end);
        this.url.net_score = net;
        this.url.net_score_latency = netlat;

    }


}




