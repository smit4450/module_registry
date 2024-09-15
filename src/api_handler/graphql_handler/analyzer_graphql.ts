// //token protections
// import * as dotenv from 'dotenv'; 
// dotenv.config();

// const input = "https://github.com/lodash/lodash";
// const TOKEN = process.env.TOKEN;
// const GRAPHQL_URL = 'https://api.github.com/graphql';

// //input url processing
// const mod = input.substring(19);
// const sep = mod.indexOf('/');
// const info = {
//     owner: mod.substring(0, sep),
//     name: mod.substring(sep+1)
// };

// //query parameters
// const query = `
// query {
// 	repository(owner: "lodash", name: "lodash") {
//     isDisabled
//     isArchived
//     isLocked
//     stargazerCount
//     forkCount
//     licenseInfo {
//       featured
//     }
//     mentionableUsers {
//       totalCount
//     }
//     createdAt
//     pushedAt
//     updatedAt
//     dependencyGraphManifests {
//       edges {
//         node {
//           dependencies{
//             totalCount
//           }
//           dependenciesCount
//         }
//       }
//     }
//     issues(last: 10){
//       totalCount
//       nodes {
//         participants {
//           totalCount
//         }
//         updatedAt
//       }
//     }
//     vulnerabilityAlerts {
//       totalCount
//     }
//     isSecurityPolicyEnabled
//     watchers {
//       totalCount
//     }
//     releases(last:1) {
//       totalCount
//       nodes {
//         updatedAt
//       }
//     }
//     deployments(last:1){
//       totalCount
//       nodes {
//         updatedAt
//       }
//     }
//   }
// }
// `
// ;

// //request headers
// const headers = {
//     Authorization: `bearer ${TOKEN}`,
//     'Content-Type': 'application/json',
// };

// //action item
// fetch(GRAPHQL_URL, {
//     method: 'POST',
//     headers: headers,
//     body: JSON.stringify({ query })
// })
// .then(response => response.json())
// .then(data => {
//     console.log(data);

// })
// .catch(error => {
//     console.error('Error making the request:', error);
// });

// analyzer_graphql.ts

export function analyzeGraphQL() {
  // Simulating some analysis logic
  console.log("Analyzing GraphQL queries...");
  return "GraphQL analysis complete.";
}