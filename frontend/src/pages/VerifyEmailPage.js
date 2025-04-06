import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { CheckCircle as SuccessIcon, Error as ErrorIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionPaper = motion(Paper);

const VerifyEmailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('Verification token is missing. Please check your email link.');
          setVerifying(false);
          return;
        }
        
        // Call API to verify the token
        const response = await api.get(`/api/v1/auth/verify-email?token=${token}`);
        
        setSuccess(true);
      } catch (err) {
        console.error('Email verification failed:', err);
        setError(
          err.response?.data?.detail || 
          'Email verification failed. The link may have expired or is invalid.'
        );
      } finally {
        setVerifying(false);
      }
    };
    
    verifyEmail();
  }, [location.search]);
  
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 140px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <MotionPaper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: '100%',
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          borderRadius: 2,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {verifying ? (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Verifying Your Email
            </Typography>
            <Typography color="text.secondary">
              Please wait while we verify your email address...
            </Typography>
          </>
        ) : success ? (
          <>
            <SuccessIcon 
              color="success" 
              sx={{ fontSize: 80, mb: 3 }} 
            />
            <Typography variant="h5" gutterBottom color="primary">
              Email Verified Successfully!
            </Typography>
            <Typography color="text.secondary" paragraph>
              Your email has been verified. You can now log in to your account and start your cosmic journey!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </>
        ) : (
          <>
            <ErrorIcon 
              color="error" 
              sx={{ fontSize: 80, mb: 3 }} 
            />
            <Typography variant="h5" gutterBottom color="error">
              Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Typography color="text.secondary" paragraph>
              If you're still having trouble, please try requesting a new verification email.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/register')}
              >
                Sign Up Again
              </Button>
            </Box>
          </>
        )}
      </MotionPaper>
    </Box>
  );
};

export default VerifyEmailPage;