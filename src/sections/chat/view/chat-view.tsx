import React, { useRef, useState, useEffect } from "react";
import { BsMic, BsSend, BsSearch, BsPaperclip, BsCheck2All, BsEmojiSmile, BsThreeDotsVertical } from "react-icons/bs";

import { styled } from "@mui/system";
import { Box, Grid, Paper, Badge, Avatar, Switch, Tooltip, TextField, Typography, IconButton, CircularProgress } from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

import { Scrollbar } from "src/components/scrollbar";

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: "var(--layout-header-mobile-height)",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default
}));

const MessageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOwn'
})<{ isOwn: boolean }>(({ isOwn }) => ({
  display: "flex",
  justifyContent: isOwn ? "flex-end" : "flex-start",
  marginBottom: "1rem",
  padding: "0 1rem"
}));

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isOwn'
})<{ isOwn: boolean }>(({ isOwn }) => ({
  padding: "0.8rem 1rem",
  borderRadius: "1rem",
  maxWidth: "70%",
  backgroundColor: isOwn ? "#e3f2fd" : "#f5f5f5",
  position: "relative"
}));

const ChatView = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey there!", isOwn: false, time: "09:30 AM", status: "read" },
    { id: 2, text: "Hi! How are you?", isOwn: true, time: "09:31 AM", status: "read" },
    { id: 3, text: "I'm doing great, thanks for asking!", isOwn: false, time: "09:32 AM", status: "read" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        isOwn: true,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent"
      }]);
      setNewMessage("");
    }
  };

  const contacts = [
    { id: 1, name: "John Doe", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36", lastMessage: "Hey there!", unread: 2 },
    { id: 2, name: "Jane Smith", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", lastMessage: "See you soon!", unread: 0 }
  ];

  return (
    <div>
      <StyledPaper>
        <Grid container sx={{
          pt: 'var(--layout-dashboard-content-pt)',
          pb: 'var(--layout-dashboard-content-pb)',
        }}>

          {/* Chat Area */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.12)", display: "flex", alignItems: "center" }}>
                <Avatar src={contacts[0].avatar} alt={contacts[0].name} />
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography variant="subtitle1">{contacts[0].name}</Typography>
                  {isTyping && <Typography variant="body2" color="text.secondary">typing...</Typography>}
                </Box>
                <IconButton>
                  <BsThreeDotsVertical />
                </IconButton>
              </Box>

              {/* Messages */}
              <Scrollbar sx={{ flex: 1, height: 'calc(100vh - 300px)' }}>
                <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                  {messages.map((message) => (
                    <MessageContainer key={message.id} isOwn={message.isOwn}>
                      <MessageBubble isOwn={message.isOwn}>
                        <Typography variant="body1">{message.text}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                            {message.time}
                          </Typography>
                          {message.isOwn && (
                            <BsCheck2All style={{ color: message.status === "read" ? "#2196f3" : "#9e9e9e" }} />
                          )}
                        </Box>
                      </MessageBubble>
                    </MessageContainer>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>
              </Scrollbar>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton>
                    <BsEmojiSmile />
                  </IconButton>
                  <IconButton>
                    <BsPaperclip />
                  </IconButton>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    sx={{ mx: 1 }}
                  />
                  <IconButton>
                    <BsMic />
                  </IconButton>
                  <IconButton onClick={handleSend} color="primary">
                    <BsSend />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* Contacts List */}
          <Grid item xs={12} md={4} sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.12)" }}>
            <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Chats</Typography>
                <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              </Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Search chats..."
                InputProps={{
                  startAdornment: <BsSearch style={{ marginRight: 8 }} />
                }}
              />
            </Box>
            <Box sx={{ overflow: "auto", height: "calc(100% - 130px)" }}>
              {contacts.map((contact) => (
                <Box key={contact.id} sx={{ p: 2, cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={contact.avatar} alt={contact.name} />
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="subtitle1">{contact.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{contact.lastMessage}</Typography>
                    </Box>
                    {contact.unread > 0 && (
                      <Badge badgeContent={contact.unread} color="primary" />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

        </Grid>
      </StyledPaper>
    </div>
  );
};

export default ChatView;