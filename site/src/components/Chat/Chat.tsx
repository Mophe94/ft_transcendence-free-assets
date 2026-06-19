import React, { useContext, useState } from "react"
import { ChatContext } from "../../context/ChatContext"
import './Chat.css'

export function MessagesWindow() {
    const chatContext = useContext(ChatContext);
    if (!chatContext) { return null; }
    const { messages } = chatContext;

    
    

    return (
        <div className="message-container">
            {messages.length === 0 && <p>Start discussion...</p>}
            {messages.map((msg, index) => {
                return (
                    <div key={index}>
                        <span>{msg.time}</span>
                        <span>{msg.username}</span>
                        <p>{msg.content}</p>
                    </div>
                )
            })}
        </div>
    )
}

export function InputBar() {
    const chatContext = useContext(ChatContext);
    const [inputText, setInputText] = useState("");

    if (!chatContext) { return null; }

    const { sendMessage } = chatContext;

    const handleSending = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        if (inputText.trim() === "") { return ; }
        await sendMessage(inputText);
        setInputText("");
    }

    return (
        <div className="input-bar">
            <form onSubmit={handleSending} className="response-container">
                <input id="chat-input" type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}/>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default function Chat () {

    return (
        <div className="chat-container">
            <InputBar />
            <MessagesWindow />
        </div>
    )
}