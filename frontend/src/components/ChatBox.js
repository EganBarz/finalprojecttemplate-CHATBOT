import React, { useState, useEffect, useRef } from "react";

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
        if (textareaRef.current) {
            textareaRef.current.style.height = "70px";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [messages, input]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message immediately
        const userMessage = { text: input, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("http://127.0.0.1:5000/api/get_response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await response.json();
            
            // Add bot response after receiving it
            setMessages(prev => [...prev, { text: data.response, isUser: false }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { 
                text: "Sorry, I'm having trouble connecting. Please try again later.", 
                isUser: false 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-interface">
            <div className="message-area">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}
                    >
                        {msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="input-area">
                <div className="message-input-container">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask about mortgage rates, payments, or eligibility..."
                        className="message-input"
                        rows={1}
                    />
                    <button 
                        onClick={sendMessage} 
                        className="send-button"
                        disabled={!input.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;