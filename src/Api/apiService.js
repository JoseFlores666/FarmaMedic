// src/Api/apiService.js

const API_URL = 'http://localhost:4000/api'; // URL de tu API

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Error en la autenticación');
    }

    return await response.json();
};
