//INPUT:
// package name
// package version
//OUTPUT:
// success/failure
import { Metrics } from './metrics/metrics.js';
import { log } from './logger.js';
import { fetch_repo } from './api_handler/graphql_handler/analyzer_graphql.js';
import { headers } from './api_handler/graphql_handler/analyzer_graphql.js';
import { GRAPHQL_URL } from './api_handler/graphql_handler/analyzer_graphql.js';
import AdmZip from 'adm-zip';
import { latency_calc } from './api_handler/graphql_handler/analyzer_graphql.js';
export async function get_url_interface(urlInput) {
    let url;
    let parameters;
    let metrics;
    url = {
        bus_factor: 0,
        bus_factor_latency: 0,
        responsive_maintainer: 0,
        responsive_maintainer_latency: 0,
        ramp_up: 0,
        ramp_up_latency: 0,
        correctness: 0,
        correctness_latency: 0,
        license: 0,
        license_latency: 0,
        depends: 0,
        depends_latency: 0,
        pull: 0,
        pull_latency: 0,
        net_score: 0,
        net_score_latency: 0,
        disk: 0
    };
    try {
        // Call the fetchRepo function
        var start = new Date();
        parameters = await fetch_repo(GRAPHQL_URL, headers, urlInput, start);
        if (parameters) {
            metrics = new Metrics(url, parameters);
        }
        else {
            log("Couldn't locate parameters from repository", 2, "ERROR");
            process.exit(1);
            return url;
        }
        log("Parameters Found", 1, "INFO");
        log("Calculating metrics", 1, "INFO");
        metrics.calculate_bus_factor();
        metrics.calculate_correctness();
        metrics.calculate_rampup();
        metrics.calc_responsive_maintainer();
        metrics.calc_net_score();
        metrics.calc_license();
        metrics.calculate_depends();
        metrics.calculate_pull();
    }
    catch (error) {
        if (error instanceof Error) {
            log(`Error calling fetchRepo: ${error.message}`, 2, "CRITICAL");
            process.exit(1);
        }
        else {
            log("Unknwon Error", 2, "Error");
            process.exit(1);
        }
    }
    return url;
}
export async function calculate_factors(urlInput) {
    // This if else statement checks if the link is a github link or a npm link, then calls the appropriate analyze functions.  Then it outputs the result.
    if (urlInput.includes("github.com")) {
        log("Link is a GitHub URL", 1, "INFO");
        let url;
        url = await get_url_interface(urlInput);
        let data;
        if (url) {
            data = {
                URL: urlInput,
                NetScore: Number(url.net_score.toFixed(3)) || 0,
                NetScore_Latency: Number(url.net_score_latency.toFixed(3)) || 0,
                RampUP: Number(url.ramp_up.toFixed(3)) || 0,
                RampUp_Latency: Number(url.ramp_up_latency.toFixed(3)) || 0,
                Correctness: Number(url.correctness.toFixed(3)) || 0,
                Correctness_Latency: Number(url.correctness_latency.toFixed(3)) || 0,
                BusFactor: Number(url.bus_factor.toFixed(3)) || 0,
                BusFactor_Latency: Number(url.bus_factor_latency.toFixed(3)) || 0,
                ResponsiveMaintainer: Number(url.responsive_maintainer.toFixed(3)) || 0,
                ResponsiveMaintainer_Latency: Number(url.responsive_maintainer_latency.toFixed(3)) || 0,
                License: Number(url.license.toFixed(3)) || 0,
                License_Latency: Number(url.license_latency.toFixed(3)) || 0,
                Depends: Number(url.depends.toFixed(3)) || 0,
                Depends_Latency: Number(url.depends_latency.toFixed(3)) || 0,
                Pull: Number(url.pull.toFixed(3)) || 0,
                Pull_Latency: Number(url.pull_latency.toFixed(3)) || 0,
            };
        }
        else {
            data = {};
        }
        const output = JSON.stringify(data);
        console.log(output);
    }
    else if (urlInput.includes("npmjs.com/package")) {
        log("Link is an NPM URL", 1, "INFO");
        let url;
        //urlInput = String(await fetchRepoUrl(urlInput))
        url = await get_url_interface(urlInput);
        let data;
        if (url) {
            data = {
                URL: urlInput,
                NetScore: Number(url.net_score.toFixed(3)) || 0,
                NetScore_Latency: Number(url.net_score_latency.toFixed(3)) || 0,
                RampUP: Number(url.ramp_up.toFixed(3)) || 0,
                RampUp_Latency: Number(url.ramp_up_latency.toFixed(3)) || 0,
                Correctness: Number(url.correctness.toFixed(3)) || 0,
                Correctness_Latency: Number(url.correctness_latency.toFixed(3)) || 0,
                BusFactor: Number(url.bus_factor.toFixed(3)) || 0,
                BusFactor_Latency: Number(url.bus_factor_latency.toFixed(3)) || 0,
                ResponsiveMaintainer: Number(url.responsive_maintainer.toFixed(3)) || 0,
                ResponsiveMaintainer_Latency: Number(url.responsive_maintainer_latency.toFixed(3)) || 0,
                License: Number(url.license.toFixed(3)) || 0,
                License_Latency: Number(url.license_latency.toFixed(3)) || 0,
                Depends: Number(url.depends.toFixed(3)) || 0,
                Depends_Latency: Number(url.depends_latency.toFixed(3)) || 0,
                Pull: Number(url.pull.toFixed(3)) || 0,
                Pull_Latency: Number(url.pull_latency.toFixed(3)) || 0,
            };
        }
        else {
            process.exit(1);
        }
        const output = JSON.stringify(data);
        console.log(output);
    }
    else {
        log("This is neither a GitHub nor an npm url", 2, "WARNING");
        process.exit(1);
        //console.log("This is neither a GitHub nor an npm link.");
        return;
    }
}
export async function calculate_depends_DL(path) {
    const zip = new AdmZip(path);
    const zipEntries = zip.getEntries();
    let depends = 1;
    let names = [];
    let total = 0;
    let pinned = 0;
    for (const zipEntry of zipEntries) {
        if (!zipEntry.isDirectory && zipEntry.entryName.split('/').length < 3) {
            const fileName = zipEntry.entryName;
            if (fileName.includes('requirements.txt')) {
                const fileContent = zipEntry.getData().toString('utf8');
                const lines = fileContent.split('\n');
                const dependencies = lines.map((line) => {
                    log("LINE " + line, 2, "INFO");
                    const matches = Array.from(line.matchAll(/([a-zA-Z0-9_-]+)([~=<>!]*)([^,\s]*)/g));
                    return matches.map((match) => {
                        const [, name, prefix, version] = match;
                        log("MATCH " + name + " " + prefix + " " + version, 2, "INFO");
                        return { name, prefix, version };
                    });
                }).flat().filter(dep => dep.name);
                dependencies.forEach(dep => {
                    const { name, prefix, version } = dep;
                    names.push(name + ' ' + prefix + version);
                    total++;
                    if (prefix !== '^') {
                        pinned++;
                    }
                });
            }
            else if (fileName.includes('package.json')) {
                const json = JSON.parse(zipEntry.getData().toString('utf8'));
                const deps = { ...json.dependencies, ...json.devDependencies };
                const dependencies = Object.entries(deps).map(([name, version]) => {
                    const matches = version.matchAll(/([~^]?)([^,\s]*)/g);
                    return Array.from(matches).map(match => {
                        const [, prefix, version] = match;
                        return { name, prefix, version };
                    });
                }).flat().filter(Boolean);
                dependencies.forEach(dep => {
                    const { name, prefix, version } = dep;
                    names.push(name + ' ' + prefix + version);
                    total++;
                    if (prefix !== '^') {
                        pinned++;
                    }
                });
            }
            else if (fileName.includes('Gemfile')) {
                const fileContent = zipEntry.getData().toString('utf8');
                const lines = fileContent.split('\n');
                const dependencies = lines.map(line => {
                    const matches = line.matchAll(/^gem ['"](.+)['"], ['"]([~^]?)(.+)['"]$/g);
                    return Array.from(matches).map(match => {
                        const [, name, prefix, version] = match;
                        return { name, prefix, version };
                    });
                }).flat().filter(Boolean);
                dependencies.forEach(dep => {
                    const { name, prefix, version } = dep;
                    names.push(name + ' ' + prefix + version);
                    total++;
                    if (prefix !== '^') {
                        pinned++;
                    }
                });
            }
        }
    }
    log("DEPENDS " + names, 2, "INFO");
    if (total > 0) {
        depends = pinned / total;
    }
    return depends;
}
export async function calculate_license_DL(path) {
    const zip = new AdmZip(path);
    const zipEntries = zip.getEntries();
    let licenseText = null;
    try {
        for (const zipEntry of zipEntries) {
            if (zipEntry.entryName.includes('LICENSE')) {
                log('License - Reading license from LICENSE file', 2, 'INFO');
                licenseText = zipEntry.getData().toString('utf8');
                break;
            }
            else if (zipEntry.entryName.includes('README.md')) {
                log('License - Reading license from README.md', 2, 'INFO');
                const readmeContent = zipEntry.getData().toString('utf8');
                licenseText = extractLicenseFromReadme(readmeContent);
                if (licenseText)
                    break;
            }
        }
        // Determine if the license is compatible with LGPLv2.1
        if (licenseText && isLicenseCompatibleWithLGPLv21(licenseText)) {
            log('License - License is compatible with LGPLv2.1', 2, 'INFO');
            return 1; // License is compatible
        }
        else {
            return 0; // License is incompatible or not found
        }
    }
    catch (error) {
        log('License - Failed to analyze license', 2, 'INFO');
        return -1;
    }
}
export async function phase_1_DL(path) {
    let net_score = 0;
    let net_score_latency = 0;
    let ramp_up = 0;
    let ramp_up_latency = 0;
    let correctness = 0;
    let correctness_latency = 0;
    let bus_factor = 0;
    let bus_factor_latency = 0;
    let responsive_maintainer = 0;
    let responsive_maintainer_latency = 0;
    let license = 0;
    let license_latency = 0;
    let depends = 0;
    let depends_latency = 0;
    let pull = 0;
    let pull_latency = 0;
    let t1 = new Date();
    depends = await calculate_depends_DL(path);
    let t2 = new Date();
    depends_latency = latency_calc(t1, t2);
    license = await calculate_license_DL(path);
    let t3 = new Date();
    license_latency = latency_calc(t2, t3);
    net_score = (license + depends) / 2;
    let t4 = new Date();
    net_score_latency = latency_calc(t1, t4);
    let data = {
        URL: "",
        NetScore: Number(net_score.toFixed(3)) || 0,
        NetScore_Latency: Number(net_score_latency.toFixed(3)) || 0,
        RampUp: Number(ramp_up.toFixed(3)) || 0,
        RampUp_Latency: Number(ramp_up_latency.toFixed(3)) || 0,
        Correctness: Number(correctness.toFixed(3)) || 0,
        Correctness_Latency: Number(correctness_latency.toFixed(3)) || 0,
        BusFactor: Number(bus_factor.toFixed(3)) || 0,
        BusFactor_Latency: Number(bus_factor_latency.toFixed(3)) || 0,
        ResponsiveMaintainer: Number(responsive_maintainer.toFixed(3)) || 0,
        ResponsiveMaintainer_Latency: Number(responsive_maintainer_latency.toFixed(3)) || 0,
        License: Number(license.toFixed(3)) || 0,
        License_Latency: Number(license_latency.toFixed(3)) || 0,
        Depends: Number(depends.toFixed(3)) || 0,
        Depends_Latency: Number(depends_latency.toFixed(3)) || 0,
        Pull: Number(pull.toFixed(3)) || 0,
        Pull_Latency: Number(pull_latency.toFixed(3)) || 0,
    };
    const output = JSON.stringify(data);
    return output;
}
export async function checkRating(path) {
    let tries = 3;
    while (tries > 0) {
        let output = await phase_1_DL(path);
        if (output != "Error") {
            return output;
        }
        tries--;
    }
    return "Error";
}
// Utility function to check if a license is compatible with LGPLv2.1
export function isLicenseCompatibleWithLGPLv21(licenseText) {
    const compatibleLicenses = [
        'LGPL-2.1',
        'LGPL-2.1-only',
        'LGPL-2.1-or-later',
        'MIT',
        'BSD-3-Clause',
        'BSD-2-Clause',
        'Apache-2.0',
        'GPL-2.0-or-later',
        'GPL-3.0-or-later'
    ];
    return compatibleLicenses.some((license) => licenseText.includes(license));
}
// Extract license from README using regex
function extractLicenseFromReadme(readmeContent) {
    log('License - Extracting license from README.md', 2, 'INFO');
    const licenseRegex = /##\s*License\s*\n+([^#]+)/i;
    const match = readmeContent.match(licenseRegex);
    return match ? match[1].trim() : null;
}
