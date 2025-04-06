import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Button,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Send as SendIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatSidebar from '../components/Chat/ChatSidebar';

const ChatPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chatId } = useParams();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const messagesEndRef = useRef(null);
  
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/chats');
        setChats(response.data);
        
        // If no active chat but chats exist, set the first one as active
        if (response.data.length > 0 && !chatId) {
          navigate(`/chat/${response.data[0].id}`);
        } else if (chatId) {
          // Find the active chat
          const chat = response.data.find((c) => c.id === parseInt(chatId));
          if (chat) {
            setActiveChat(chat);
          } else if (response.data.length > 0) {
            navigate(`/chat/${response.data[0].id}`);
          }
        }
      } catch (err) {
        console.error('Failed to fetch chats:', err);
        setError('Failed to load chats. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, [chatId, navigate]);
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages]);
  
  const handleChatSelect = (id) => {
    navigate(`/chat/${id}`);
  };
  
  const handleNewChat = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/chats', {
        title: 'New Chat',
      });
      
      // Add the new chat to the list and navigate to it
      setChats([response.data, ...chats]);
      navigate(`/chat/${response.data.id}`);
      
      setSnackbar({
        open: true,
        message: 'New chat created!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Failed to create new chat:', err);
      if (err.response?.status === 402) {
        setSnackbar({
          open: true,
          message: 'Free tier chat limit reached. Please upgrade to continue.',
          severity: 'warning',
        });
        navigate('/subscription');
      } else {
        setError('Failed to create new chat. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteChat = async (id) => {
    try {
      await api.delete(`/api/v1/chats/${id}`);
      
      // Remove the deleted chat from the list
      setChats(chats.filter((chat) => chat.id !== id));
      
      // If the active chat was deleted, navigate to another chat or the chat list
      if (activeChat?.id === id) {
        if (chats.length > 1) {
          const nextChat = chats.find((chat) => chat.id !== id);
          navigate(`/chat/${nextChat.id}`);
        } else {
          navigate('/chat');
        }
      }
      
      setSnackbar({
        open: true,
        message: 'Chat deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      console.error('Failed to delete chat:', err);
      setError('Failed to delete chat. Please try again.');
    }
  };
  
  const handleEditChatTitle = async (id, title) => {
    try {
      const response = await api.put(`/api/v1/chats/${id}`, { title });
      
      // Update the chat in the list
      setChats(
        chats.map((chat) => (chat.id === id ? response.data : chat))
      );
      
      // Update active chat if it's the one being edited
      if (activeChat?.id === id) {
        setActiveChat(response.data);
      }
      
      setSnackbar({
        open: true,
        message: 'Chat title updated',
        severity: 'success',
      });
    } catch (err) {
      console.error('Failed to update chat title:', err);
      setError('Failed to update chat title. Please try again.');
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !activeChat) return;
    
    try {
      setSendingMessage(true);
      
      const response = await api.post(`/api/v1/chats/${activeChat.id}/messages`, {
        content: message,
        is_user: true,
      });
      
      // Update the active chat with the new messages
      setActiveChat({
        ...activeChat,
        messages: [...activeChat.messages, ...response.data],
      });
      
      // Also update the chat in the list
      setChats(
        chats.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                messages: [...chat.messages, ...response.data],
              }
            : chat
        )
      );
      
      // Clear the message input
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  
  if (loading && !activeChat) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="calc(100vh - 140px)"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 140px)',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: theme.shadows[5],
      }}
    >
      {/* Chat Sidebar - Desktop */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChat?.id}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onEditChatTitle={handleEditChatTitle}
        isMobileSidebarOpen={mobileSidebarOpen}
        onMobileSidebarClose={() => setMobileSidebarOpen(false)}
      />
      
      {/* Chat Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          bgcolor: theme.palette.background.default,
          position: 'relative',
        }}
      >
        {/* Chat Header */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {isSmallScreen && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {activeChat?.title || 'Start a New Chat'}
          </Typography>
        </Paper>
        
        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ m: 2 }}
          >
            {error}
          </Alert>
        )}
        
        {/* Chat Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {activeChat ? (
            <>
              <AnimatePresence>
                {activeChat.messages.length > 0 ? (
                  activeChat.messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ChatMessage
                        message={msg}
                        isLastMessage={index === activeChat.messages.length - 1}
                      />
                    </motion.div>
                  ))
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                    }}
                  >
                    <Typography variant="h5" gutterBottom color="primary">
                      Welcome to AstroAI!
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                      This is the beginning of your cosmic journey.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ask a question about your zodiac sign, career path, love life, or anything related to astrology!
                    </Typography>
                  </Box>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                p: 3,
              }}
            >
              <Typography variant="h5" gutterBottom color="primary">
                No Active Chat
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Select an existing chat or start a new one.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNewChat}
              >
                Start New Chat
              </Button>
            </Box>
          )}
        </Box>
        
        {/* Message Input */}
        {activeChat && (
          <Paper
            component="form"
            onSubmit={handleSendMessage}
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <TextField
              fullWidth
              placeholder="Ask about your cosmic journey..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              disabled={sendingMessage}
              InputProps={{
                sx: { borderRadius: 3 },
              }}
            />
            <IconButton
              color="primary"
              sx={{ ml: 1 }}
              disabled={!message.trim() || sendingMessage}
              type="submit"
            >
              {sendingMessage ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </Paper>
        )}
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatPage;