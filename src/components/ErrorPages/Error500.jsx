import { useNavigate } from "react-router-dom";
import { FaServer } from "react-icons/fa";

const Error500 = () => {    
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <FaServer style={styles.icon} />
            <h1 style={styles.title}>500</h1>
            <p style={styles.message}>Ups! Algo salió mal en el servidor.</p>
            <p style={styles.message2}>
                Por favor, intentalo más tarde.
            </p>
            <button onClick={() => navigate("/")}
                className="btn btn-primary btn-lg btn-block mb-3">Regresar inicio
            </button>
            <button onClick={() => navigate("/")}
                className="btn btn-primary btn-lg btn-block">Contactar soporte
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
        fontSize: "2rem",
        marginTop: "0.5rem",
        color: "#666",
    },
    message2: {
        fontSize: "1.5rem",
        color: "#666",
    },
};

export default Error500;