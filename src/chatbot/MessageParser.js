class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    if (message.trim()) {
      this.actionProvider.handleChatGPTResponse(message);
    }
  }
}

export default MessageParser;

// class MessageParser {
//   actionProvider: any;

//   constructor(actionProvider) {
//     this.actionProvider = actionProvider;
//   }

//   parse(message) {
//     const lowerCaseMessage = message.toLowerCase();

//     if (lowerCaseMessage.includes('giá') || lowerCaseMessage.includes('báo giá')) {
//       this.actionProvider.handlePricing();
//     } else if (lowerCaseMessage.includes('liên hệ')) {
//       this.actionProvider.handleContact();
//     } else {
//       this.actionProvider.handleDefault();
//     }
//   }
// }
// export default MessageParser;
