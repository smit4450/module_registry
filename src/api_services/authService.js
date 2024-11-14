// src/api/authService.js

export async function authenticate(username, password) {
    const response = await fetch('/authenticate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ User: { name: username }, Secret: { password } })
    });
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data.token;
}
