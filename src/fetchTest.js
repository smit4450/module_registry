
const args = process.argv.slice(2);
const input = args[0];


const response = await fetch(`http://54.163.22.181:3000/packages`, {
    method: 'POST',
  });
if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}

/*
const response = await fetch(`http://54.163.22.181:3000/package/byName/${input}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
    */
const data = await response.json();
const keys = Object.keys(data);

console.log(data);
console.log("data type: ", typeof response);
console.log("data type: ", typeof data);
console.log(keys);
console.log(data.versions);
console.log(data.packages);
console.log(data.Items);

if (typeof data === 'string') {
    try {
      data = JSON.parse(data); // Parse it manually
      console.log("Parsed data:", data);
    } catch (error) {
      console.error("Data is not valid JSON:", error);
    }
}


if (Array.isArray(data)) {
    // Packages found
    data.forEach((pkg) => {
        console.log(`Name: ${pkg.Name}, Version: ${pkg.Version}, ID: ${pkg.ID}`);
    });
} else if (data.message) {
    // No packages found
    console.log(result.message);
} else if (data.error) {
    // Error occurred
    console.error(result.error);
}

export {}