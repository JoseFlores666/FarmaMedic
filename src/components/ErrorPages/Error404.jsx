import { useNavigate } from "react-router-dom";
import { AiOutlineFileSearch } from "react-icons/ai";

export const Error404 = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <AiOutlineFileSearch style={styles.icon} />
            <h1 style={styles.title}>404</h1>
            <p style={styles.message}>Ups! La pagina que estas buscando no existe.</p>
            <button onClick={() => navigate("/")}
                className="btn btn-primary btn-lg btn-block">Regresar a inicio
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "86vh",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        color: "#333",
    },
    icon: {
        fontSize: "9rem",
        color: "#ff6b6b",
        marginBottom: "1rem",
    },
    title: {
        fontSize: "4rem",
        fontWeight: "bold",
        margin: 0,
    },
    message: {
        fontSize: "1.5rem",
        marginTop: "0.5rem",
        color: "#666",
    },
};
