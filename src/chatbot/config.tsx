// config.js
import type IConfig from 'react-chatbot-kit/build/src/interfaces/IConfig';

import { createChatBotMessage } from 'react-chatbot-kit';

import { Header, BotAvatar, UserAvatar, BotChatMessage, UserChatMessage } from './CustomComponent';

const botName = 'Brickie';

const config: IConfig = {
  botName,
  initialMessages: [
    createChatBotMessage(`Chào bạn! Tôi là ${botName} Tôi có thể giúp gì cho bạn? 😊`, {}),
  ],
  customComponents: {
    header: (props) => <Header {...props} />,
    botAvatar: (props) => <BotAvatar {...props} />,
    botChatMessage: (props) => <BotChatMessage {...props} />,
    userAvatar: (props) => <UserAvatar {...props} />,
    userChatMessage: (props) => <UserChatMessage {...props} />,
  },
  widgets: [
    {
      widgetName: "typingIndicator",
      widgetFunc: () => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="typing-indicator" />
          <span className="typing-indicator" />
          <span className="typing-indicator" />
        </div>
      ),
      props: undefined,
      mapStateToProps: []
    },
  ],
};


export const getInitialMessage = (setStateFunc) => {
  setTimeout(() => {
    const initMessage = createChatBotMessage("Hello! How can I assist you today?", {});
    setStateFunc((prev) => ({
      ...prev,
      messages: [...prev.messages, initMessage],
    }));
  }, 10000); // Delay 2 giây
};

export default config;