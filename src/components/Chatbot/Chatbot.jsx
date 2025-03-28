import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import ChatHistory from "./ChatHistory";
import './Chatbot.css';

const Chatbot = () => {
    const [userInput, setUserInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const genAI = new GoogleGenerativeAI("AIzaSyClq1Clj5gDLsMfkOxohkTkxCfItTXpqJg");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const fetchEmpresaInfo = async () => {
        try {
            const response = await fetch("https://back-farmam.onrender.com/api/getEmpresa");
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            
            const data = await response.json();

            return Array.isArray(data) ? data[0] : data;
        } catch (error) {
            console.error("Error al obtener información de la empresa:", error);
            return null;
        }
    };

    const sendMessage = async () => {
        if (userInput.trim() === "") return;

        setIsLoading(true);
        try {
            let botResponse = "";
            const lowerCaseInput = userInput.toLowerCase();
            const empresaInfo = await fetchEmpresaInfo();

            if (empresaInfo) {
                if (lowerCaseInput.includes("nombre")||lowerCaseInput.includes("como se llama")) {
                    botResponse = `El nombre de la empresa es: ${empresaInfo.nombre}.`;
                } else if (lowerCaseInput.includes("quienes son") || lowerCaseInput.includes("acerca de") || lowerCaseInput.includes("farmamedic")) {
                    botResponse = `${empresaInfo.nosotros}.`;
                } else if (lowerCaseInput.includes("mision")) {
                    botResponse = `${empresaInfo.mision}.`;
                } else if (lowerCaseInput.includes("vision")) {
                    botResponse = `Visión: ${empresaInfo.vision}.`;
                } else if (lowerCaseInput.includes("eslogan")||lowerCaseInput.includes("frase")){ 
                    botResponse = `Eslogan: ${empresaInfo.eslogan}.`;
                } else if (lowerCaseInput.includes("valores")) {
                    botResponse = `Nuestros valores son: ${empresaInfo.valores}.`;
                } else if (lowerCaseInput.includes("servicios")) {
                    botResponse = `Ofrecemos los siguientes servicios: ${empresaInfo.servicios}.`;
                } else {
                    const result = await model.generateContent(userInput);
                    botResponse = result.response.text();
                }
            } else {
                botResponse = "Lo siento, no pude obtener información sobre la empresa en este momento.";
            }

            setChatHistory(prevChat => [
                ...prevChat,
                { type: "user", message: userInput },
                { type: "bot", message: botResponse }
            ]);
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        } finally {
            setUserInput("");
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setChatHistory([]);
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        className="btn btn-dark border chatbot-toggle"
                        onClick={() => setIsOpen(true)}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.2, opacity: 0.9 }}
                    >
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Google_Bard_logo.svg/1200px-Google_Bard_logo.svg.png"
                            alt="Gemini Logo"
                            width="45"
                            height="45"
                            style={{ objectFit: "contain" }}
                        />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-window shadow-lg border"
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="card">
                            <div className="card-header bg-primary d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">Chatbot</h6>
                                <button className="btn btn-danger" onClick={clearChat}>Limpiar Chat</button>
                                <button className="btn btn-sm btn-light" onClick={() => setIsOpen(false)}>✖</button>
                            </div>
                            <div className="card-body chat-content">
                                <ChatHistory chatHistory={chatHistory} />
                            </div>
                            <div className="card-footer">
                                <div className="input-group">
                                    <input 
                                        type="text"
                                        className="form-control"
                                        placeholder="Escribe tu mensaje..."
                                        value={userInput}
                                        onChange={handleUserInput}
                                    />
                                    <button 
                                        className="btn btn-primary"
                                        onClick={sendMessage}
                                        disabled={isLoading}
                                    >
                                        Enviar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
