// CustomComponents.js
import React from 'react';

import { Typography } from '@mui/material';

export const Header = () => (
  <div style={{
    backgroundColor: '#000000',
    color: 'white',
    padding: '15px',
    borderRadius: '5px 5px 0 0',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center'
  }}>
    Bạn đồng hành Brickie 😊
  </div>
);

export const BotAvatar = () => (
  <div style={{ width: '40px', height: '40px', marginRight: '15px', borderRadius: '50%', overflow: 'hidden' }}>
    <img src="./assets/icons/chatbox.jpg" alt="Bot" width="40" />
  </div>
);

export const UserAvatar = () => (
  <div style={{ width: '40px', height: '40px', marginLeft: '15px', borderRadius: '50%', overflow: 'hidden' }}>
    <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="User" width="40" />
  </div>
);

export const BotChatMessage = ({ message }) => (
  <div style={{
    backgroundColor: '#edf2f7',
    color: '#3d3d3d',
    borderRadius: '16px 16px 16px 16px',
    padding: '10px 14px',
    marginBottom: '8px',
    display: 'inline-block',
    maxWidth: '80%',
    fontSize: '16px',
    fontWeight: 'bold',
  }}>
    <Typography>{message}</Typography>
  </div>
);

export const UserChatMessage = ({ message }) => (
  <div style={{
    backgroundColor: '#edf2f7',
    color: '#3d3d3d',
    borderRadius: '16px 16px 16px 16px',
    padding: '10px 14px',
    marginBottom: '8px',
    display: 'inline-block',
    maxWidth: '80%',
    fontSize: '16px',
    fontWeight: 'bold',
  }}>
    <Typography>{message}</Typography>
  </div>
);
