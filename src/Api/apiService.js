

export const loginUser = async (username, password) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Error en la autenticación');
    }

    return await response.json();
};
