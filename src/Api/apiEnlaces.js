export const fetchEnlaces = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/getEnlaces', {
            credentials: 'include',
        });
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error obteniendo enlaces:', error);
        throw error; 
    }
};  