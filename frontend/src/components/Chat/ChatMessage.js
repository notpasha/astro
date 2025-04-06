import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  useTheme,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import {
  Person as PersonIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

const ChatMessage = ({ message, isLastMessage }) => {
  const theme = useTheme();
  const isUser = message.is_user;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        maxWidth: '100%',
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            mr: 1,
            width: 40,
            height: 40,
          }}
        >
          <PsychologyIcon />
        </Avatar>
      )}

      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '70%',
          borderRadius: 2,
          bgcolor: isUser
            ? theme.palette.primary.main
            : theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : theme.palette.background.default,
          color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
          position: 'relative',
          '&::after': isUser
            ? {
                content: '""',
                position: 'absolute',
                right: -10,
                top: 10,
                width: 0,
                height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: `10px solid ${theme.palette.primary.main}`,
              }
            : {},
          '&::before': !isUser
            ? {
                content: '""',
                position: 'absolute',
                left: -10,
                top: 10,
                width: 0,
                height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderRight: `10px solid ${
                  theme.palette.mode === 'dark'
                    ? theme.palette.background.paper
                    : theme.palette.background.default
                }`,
              }
            : {},
        }}
      >
        <ReactMarkdown>
          {message.content}
        </ReactMarkdown>
      </Paper>

      {isUser && (
        <Avatar
          sx={{
            bgcolor: theme.palette.secondary.main,
            ml: 1,
            width: 40,
            height: 40,
          }}
        >
          <PersonIcon />
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage;