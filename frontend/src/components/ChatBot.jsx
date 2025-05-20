import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FiMessageSquare, FiX, FiMinus } from "react-icons/fi";
import Chatbot from "react-chatbot-kit";
import { createChatBotMessage } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

// Styled components
const ChatButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #eab308;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(234, 179, 8, 0.3);
  z-index: 1000;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 110px;
  right: 30px;
  width: 400px;
  max-height: 600px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  background: white;
  z-index: 999;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background: #eab308;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatBody = styled.div`
  flex: 1;
  background: #f8fafc;
  padding: 20px;
  overflow-y: auto;
`;

const config = {
  botName: "ShopAssist",
  initialMessages: [
    createChatBotMessage("Hi! I'm ShopAssist. How can I help you today?")
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#eab308",
    },
    userMessageBox: {
      backgroundColor: "#fff",
    },
  },
};

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  async handleUserMessage(userMessage) {
    const loadingMessage = this.createChatBotMessage("Thinking...");
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, loadingMessage],
    }));

    try {
      const response = await fetch("http://localhost:8000/api/core/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, this.createChatBotMessage(data.reply)],
      }));
    } catch {
      this.setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          this.createChatBotMessage("Sorry, something went wrong."),
        ],
      }));
    }
  }
}

class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    this.actionProvider.handleUserMessage(message);
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX size={26} /> : <FiMessageSquare size={26} />}
      </ChatButton>
      {isOpen && (
        <ChatContainer>
          <ChatHeader>
            <span>ShopAssist</span>
            <FiX size={20} onClick={() => setIsOpen(false)} />
          </ChatHeader>
          <ChatBody>
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </ChatBody>
        </ChatContainer>
      )}
    </>
  );
}