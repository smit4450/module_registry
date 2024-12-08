import { getAvailableVersions } from './api_services/packageService.js';
/*
export async function apiCall(name) {
    try {
        const response = await fetch(`http://localhost:3000/package/byName/${name}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Please make sure the server is running.');
        } else {
            console.error('Fetch error:', error);
        }
        throw error;
    }
}
*/
const args = process.argv.slice(2);
const input = args[0];

//getAvailableVersions(input).then(console.log).catch(console.error);

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass SSL verification (for development only)

/*
const data = await fetch(`http://localhost:3000/package/byName/${input}`, {
    method: 'GET',
});
*/

const response = await fetch(`http://54.163.22.181:3000/package/byName/${input}`, {
    method: 'GET',
});

const data = await response.json();
const keys = Object.keys(data);

console.log("data type: ", typeof data);
console.log(keys);
console.log(data.versions);

if (typeof data === 'string') {
    try {
      data = JSON.parse(data); // Parse it manually
      console.log("Parsed data:", data);
    } catch (error) {
      console.error("Data is not valid JSON:", error);
    }
  }

export {}