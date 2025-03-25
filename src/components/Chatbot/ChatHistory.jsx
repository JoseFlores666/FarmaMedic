import PropTypes from "prop-types";

const ChatHistory = ({ chatHistory }) => {
  return (
    <>
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`d-flex ${message.type === "user" ? "justify-content-end" : "justify-content-start"} mb-3`}
        >
          <div
            className={`d-flex flex-column ${message.type === "user" ? "align-items-end" : "align-items-start"}`}
          >
            <span className={`small ${message.type === "user" ? "text-primary" : "text-secondary"}`}>
              {message.type === "user" ? "Tú" : "Chatbot"}
            </span>

            <div
              className={`message-bubble p-2  border shadow-sm ${message.type === "user" ? "bg-primary text-white" : "bg-light text-dark"} ${message.type === "user" ? "user-bubble" : "chatbot-bubble"}`}
            >
              {message.message}
            </div>
          </div>
        </div>

      ))}
    </>
  );
};

ChatHistory.propTypes = {
  chatHistory: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ChatHistory;
