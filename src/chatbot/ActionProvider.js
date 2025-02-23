import axios from 'axios';

import { useChatbot } from 'src/stores/use-chatbot';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.addMessage = useChatbot.getState().addMessage;
    this.setMaxMessages = useChatbot.getState().setMaxMessages;
  }

  typeMessageSlowly = (message, delay = 50) => {
    let index = 0;

    const interval = setInterval(() => {
      if (index <= message.length) {
        const partialMessage = this.createChatBotMessage(message.substring(0, index));
        this.setState((prev) => ({
          ...prev,
          messages: [...prev.messages.slice(0, -1), partialMessage], // Update last message
        }));
        index += 1;
      } else {
        clearInterval(interval);
      }
    }, delay);
  };

  handleChatGPTResponse = async (message) => {
    const apiKey = import.meta.env.VITE_OPENAI_KEY;
    const prompt =
      `Tôi muốn bạn đóng vai trò là Brickie người bán vật liệu xây dựng (gạch nung, xi măng, cát) và buôn bán nông sản (ngô, cafe, lúa, sắn) ở khu vực tây nguyên cho công ty TNHH TM DV Huynh Hạnh, sđt 0903525647,` +
      ` người dùng sẽ tương tác với bạn thông qua chatbot để đặt hàng, hỏi giá, tìm hiểu thông tin sản phẩm, vui lòng trả lời các câu hỏi như một người bán hàng thực sự.` +
      ` trả lời tùy yêu cầu người dùng mà bạn nhận được với thái độ vui vẻ, chuyên nghiệp`;

    this.addMessage({ role: 'user', content: message });

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, this.createChatBotMessage('', { widget: 'typingIndicator' })],
    }));

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: prompt }, ...useChatbot.getState().chatHistory],
          temperature: 0.5,
          top_p: 0.7,
          max_tokens: 150,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const chatGPTMessage = response.data.choices[0].message.content;
      this.addMessage({ role: 'assistant', content: chatGPTMessage });
      this.typeMessageSlowly(chatGPTMessage, 20); // Type message slowly
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      const errorMessage = this.createChatBotMessage(
        'Xin lỗi, có lỗi xảy ra khi gửi yêu cầu của bạn. Vui lòng thử lại sau.'
      );
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };
}

export default ActionProvider;

// class ActionProvider {
//   createChatBotMessage: any;

//   setState: any;

//   constructor(createChatBotMessage, setStateFunc) {
//     this.createChatBotMessage = createChatBotMessage;
//     this.setState = setStateFunc;
//   }

//   handlePricing() {
//     const message = this.createChatBotMessage('Thông tin báo giá: Vui lòng truy cập trang "Báo giá" của chúng tôi.');
//     this.updateChatbotState(message);
//   }

//   handleContact() {
//     const message = this.createChatBotMessage('Bạn có thể liên hệ với chúng tôi qua email: support@example.com.');
//     this.updateChatbotState(message);
//   }

//   handleDefault() {
//     const message = this.createChatBotMessage('Xin lỗi, tôi không hiểu. Bạn có thể hỏi về giá hoặc liên hệ.');
//     this.updateChatbotState(message);
//   }

//   updateChatbotState(message) {
//     this.setState((prev) => ({
//       ...prev,
//       messages: [...prev.messages, message],
//     }));
//   }
// }
// export default ActionProvider;
