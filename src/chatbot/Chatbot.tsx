// ChatBox.js
import './Chatbox.css'
import 'react-chatbot-kit/build/main.css';

import Chatbot from 'react-chatbot-kit';
import React, { useState, useEffect } from 'react';

import config from './config';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';

const ChatBox = () => {
  const [showBot, toggleBot] = useState(false);

  useEffect(() => {
    const delayInitMessage = setTimeout(() => { toggleBot(true); }, 100);
    return () => clearTimeout(delayInitMessage);
  }, []);

  const saveMessages = (ref) => {
    localStorage.setItem('chat_messages', JSON.stringify(ref));
  };

  const loadMessages = () => {
    const messages = JSON.parse(
      localStorage.getItem("chat_messages") ||
      '[{"message": "Chào bạn! Mình có thể giúp gì cho bạn? 😊", "type": "bot", "id": 0}]'
    );
    return messages;
  };

  return (
    <div className={`chat-animation ${showBot ? "visible" : ""}`}>

      {showBot && <Chatbot config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}

        messageHistory={loadMessages()}
        saveMessages={saveMessages}

        placeholderText='Nhập tin nhắn nè...' />}
    </div>
  );
};

export default ChatBox;
