import { useNavigate } from "react-router-dom";
import { MdBlock } from "react-icons/md";

const Error400 = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <MdBlock style={styles.icon} />
            <h1 style={styles.title}>400</h1>
            <p style={styles.message}>Ups! Esta página no esta disponible en este momento.</p>
            <p style={styles.message2}>Por favor intentelo mas tarde.</p>
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
        fontSize: "2rem",
        marginTop: "0.5rem",
        color: "#666",
    },
    message2: {
        fontSize: "1.5rem",
        marginTop: "0.5rem",
        color: "#666",

    },
};

export default Error400;