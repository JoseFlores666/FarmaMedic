import { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    const toggleTheme = (event) => {
        const newTheme = event.target.checked ? 'dark' : 'light';
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
        <div className="d-flex justify-content-center align-items-center">
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                />
                <label className="form-check-label text-white">
                    {theme === 'light' ? '🌞Ligth Mode' : '🌜Dark Mode'}
                </label>
            </div>
        </div>

    );
};

export default ThemeToggle;
