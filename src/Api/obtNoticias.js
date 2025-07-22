export const getNoticias = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getNoticias`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', 
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Error al obtener las noticias');
    }

    return await response.json();
};
