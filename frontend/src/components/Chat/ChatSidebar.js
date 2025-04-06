import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Chat as ChatIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSidebar = ({
  chats,
  activeChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onEditChatTitle,
  isMobileSidebarOpen,
  onMobileSidebarClose,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  
  const handleChatSelect = (chatId) => {
    onChatSelect(chatId);
    if (isSmallScreen) {
      onMobileSidebarClose();
    }
  };
  
  const handleDeleteClick = (e, chat) => {
    e.stopPropagation();
    setSelectedChat(chat);
    setIsDeleteDialogOpen(true);
  };
  
  const handleEditClick = (e, chat) => {
    e.stopPropagation();
    setSelectedChat(chat);
    setEditTitle(chat.title);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    onDeleteChat(selectedChat.id);
    setIsDeleteDialogOpen(false);
    setSelectedChat(null);
  };
  
  const handleEditConfirm = () => {
    onEditChatTitle(selectedChat.id, editTitle);
    setIsEditDialogOpen(false);
    setSelectedChat(null);
    setEditTitle('');
  };
  
  // Format the chat date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const sidebar = (
    <Box
      sx={{
        width: { xs: '100%', md: 300 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        {isSmallScreen && (
          <IconButton 
            onClick={onMobileSidebarClose}
            sx={{ mr: 1 }}
            edge="start"
          >
            <CloseIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Your Chats
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onNewChat}
          sx={{ borderRadius: 2 }}
        >
          New Chat
        </Button>
      </Box>
      
      <Divider />
      
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List sx={{ p: 1 }}>
          <AnimatePresence>
            {chats?.length > 0 ? (
              chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={(e) => handleEditClick(e, chat)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => handleDeleteClick(e, chat)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                    sx={{ mb: 1 }}
                  >
                    <ListItemButton
                      selected={chat.id === activeChatId}
                      onClick={() => handleChatSelect(chat.id)}
                      sx={{
                        borderRadius: 2,
                        '&.Mui-selected': {
                          bgcolor: 'primary.dark',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color:
                            chat.id === activeChatId
                              ? 'primary.contrastText'
                              : 'inherit',
                        }}
                      >
                        <ChatIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={chat.title}
                        secondary={formatDate(chat.created_at)}
                        secondaryTypographyProps={{
                          color:
                            chat.id === activeChatId
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'text.secondary',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No chats yet. Start a new conversation!
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </List>
      </Box>
    </Box>
  );
  
  return (
    <>
      {/* Desktop sidebar */}
      {!isSmallScreen && sidebar}
      
      {/* Mobile sidebar */}
      {isSmallScreen && (
        <Dialog
          fullScreen
          open={isMobileSidebarOpen}
          onClose={onMobileSidebarClose}
          TransitionComponent={motion.div}
        >
          {sidebar}
        </Dialog>
      )}
      
      {/* Delete Chat Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the chat "{selectedChat?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Chat Title Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Chat Title</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Chat Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditConfirm} 
            color="primary" 
            variant="contained"
            disabled={!editTitle.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatSidebar;