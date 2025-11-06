import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css"; 

export const SearchB = () => {
    const [doctores, setDoctores] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const searchRef = useRef(null); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseDoc = await fetch(`${import.meta.env.VITE_API_URL}/getDoc`);
                const responseServ = await fetch(`${import.meta.env.VITE_API_URL}/getServicios`);

                if (!responseDoc.ok || !responseServ.ok) {
                    throw new Error("Error al obtener los datos");
                }

                const dataDoc = await responseDoc.json();
                const dataServ = await responseServ.json();

                setDoctores(Array.isArray(dataDoc) ? dataDoc : []);
                setServicios(Array.isArray(dataServ) ? dataServ : []);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setDoctores([]);
                setServicios([]);
            }
        };
        fetchData();
    }, []);

    const results = search.length > 0
        ? [...doctores, ...servicios].filter((item) =>
            item.nomdoc?.toLowerCase().includes(search.toLowerCase()) ||
            item.nombre?.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = () => {
        navigate(`/Inicio/Busqueda`);
        setSearch("");
    };

    return (
        <div ref={searchRef} className="search-container">
            <div className="search-box">
                <span className="search-icon">
                    <FaSearch className="text-dark" size={20} />
                </span>
                <input
                    type="search"
                    className="search-input"
                    placeholder="Buscar Servicios"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {search.length > 0 && results.length > 0 && (
                <ul className="search-results list-none m-0 p-0">
                    {results.map((item, index) => (
                        <li key={item.coddoc || item.id || index} onClick={() => handleSelect(item)} className="flex gap-2">
                            <FaSearch className="text-gray-500" size={16} />
                            <span className="truncate text-dark">{item.nomdoc || item.nombre}</span>
                            <span className="text-dark text-xs ml-auto">{item.nomdoc ? "Doctor" : "Servicio"}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

SearchB.propTypes = {
    onSelect: PropTypes.func,
};

