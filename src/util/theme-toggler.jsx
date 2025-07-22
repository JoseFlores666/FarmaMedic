import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);
    };

    useEffect(() => {
        const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
        const storedTheme = localStorage.getItem('theme') || preferredTheme;
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-bs-theme', storedTheme);
    }, []);

   return (
    <div>
        {theme === 'light' ? (
            <FaSun 
                color='yellow' 
                size={20} 
                style={{ cursor: 'pointer' }} 
                onClick={toggleTheme} 
            />
        ) : (
            <FaMoon 
                size={20} 
                color='white' 
                style={{ cursor: 'pointer' }} 
                onClick={toggleTheme} 
            />
        )}
    </div>
);

};

export default ThemeToggle;
