// src/api/packageService.js

// src/api/packageService.js

export async function uploadPackage(packageData) {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/package', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Authorization': token 
        },
        body: JSON.stringify(packageData)
    });

    if (!response.ok) {
        throw new Error('Failed to upload package');
    }

    return await response.json();
}

// src/api/packageService.js

export async function debloatPackage(packageData) {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/package/debloat', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Authorization': token 
        },
        body: JSON.stringify(packageData)
    });

    if (!response.ok) {
        throw new Error('Failed to debloat package');
    }

    return await response.json();
}

// src/api/packageService.js

export async function getPackageRating(packageId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/package/${packageId}/rate`, {
        method: 'GET',
        headers: { 'X-Authorization': token }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch package rating');
    }

    return await response.json();
}

// src/api/packageService.js

// src/api/packageService.js
export async function fetchPackagesDirectory(page) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/package/directory?page=${page}`, {
        method: 'GET',
        headers: { 'X-Authorization': token },
    });
    if (!response.ok) throw new Error('Failed to fetch package directory');
    return await response.json();
}

// src/api/packageService.js

export async function updatePackage(packageData) {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/package', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'X-Authorization': token 
        },
        body: JSON.stringify(packageData)
    });

    if (!response.ok) {
        throw new Error('Failed to update package');
    }

    return await response.json();
}

// src/api/packageService.js

export async function searchPackageByName(name) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/package/byName/${name}`, {
        method: 'GET',
        headers: { 'X-Authorization': token }
    });

    if (!response.ok) {
        throw new Error('Failed to search package by name');
    }

    return await response.json();
}

// src/api/packageService.js

// src/api/packageService.js
export async function searchByRegex(query) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/package/regex-search`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Authorization': token 
        },
        body: JSON.stringify({ query }),
    });
    if (!response.ok) throw new Error('Failed to fetch search results');
    return await response.json();
}


// src/api/packageService.js
export async function getPackageSize(name, version) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/package/${name}/${version}/size`, {
        method: 'GET',
        headers: { 'X-Authorization': token },
    });
    if (!response.ok) throw new Error('Failed to check package size');
    return await response.json();
}

//WORKS
export async function getAvailableVersions(name) {
    try {
        const response = await fetch(`http://54.163.22.181:3000/package/byName/${name}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        return response;
    } catch (error) {
        if (error.message.includes('ECONNREFUSED')) {
            console.error('Connection refused. Please make sure the server is running.');
        } else {
            console.error('Fetch error:', error.message);
        }
        throw error;
    }
}

// src/api/packageService.js
export async function searchPackages(term) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/package/search?term=${encodeURIComponent(term)}`, {
        method: 'GET',
        headers: { 'X-Authorization': token },
    });
    if (!response.ok) throw new Error('Failed to fetch search results');
    return await response.json();
}

// src/api/packageService.js
export async function downloadPackageZip(name, version) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/package/${name}/${version}/download`, {
        method: 'GET',
        headers: { 'X-Authorization': token },
    });
    if (!response.ok) throw new Error('Failed to download package');
    return response; // We’ll handle the download action in the component
}

// src/api/packageService.js
export async function fetchEntireDirectory() {
    try {
        const response = await fetch(`http://54.163.22.181:3000/packages`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        if (error.message.includes('ECONNREFUSED')) {
            console.error('Connection refused. Please make sure the server is running.');
        } else {
            console.error('Fetch error:', error.message);
        }
        throw error;
    }
}

// src/api/packageService.js
export async function getPackageScore(packageId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/package/${packageId}/score`, {
        method: 'GET',
        headers: { 'X-Authorization': token },
    });
    if (!response.ok) throw new Error('Failed to fetch package score');
    return await response.json();
}

// src/api/packageService.js
export async function ingestNpmPackage(url, name, version) {
    try {
        const response = await fetch('http://54.163.22.181:3000/package', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            URL: url,
            packageName: name,
            packageVersion: version
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        if (error.message.includes('ECONNREFUSED')) {
            console.error('Connection refused. Please make sure the server is running.');
        } else {
            console.error('Fetch error:', error.message);
        }
        throw error;
    }
}