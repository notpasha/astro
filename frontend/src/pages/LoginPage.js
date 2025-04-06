import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { 
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, socialLogin, error, setError, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form validation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (isEmailValid && isPasswordValid) {
      try {
        await login(email, password);
        navigate('/chat');
      } catch (err) {
        // Error is handled by the auth context
      }
    }
  };
  
  // Google login handler
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await socialLogin('google', response.access_token);
        navigate('/chat');
      } catch (err) {
        // Error is handled by the auth context
      }
    },
    onError: () => {
      setError('Google login failed. Please try again.');
    },
  });
  
  // Facebook login handler (mock)
  const handleFacebookLogin = async () => {
    try {
      await socialLogin('facebook', 'mock_facebook_token');
      navigate('/chat');
    } catch (err) {
      // Error is handled by the auth context
    }
  };
  
  // Instagram login handler (mock)
  const handleInstagramLogin = async () => {
    try {
      await socialLogin('instagram', 'mock_instagram_token');
      navigate('/chat');
    } catch (err) {
      // Error is handled by the auth context
    }
  };

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
          borderRadius: 2,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          color="primary"
          fontWeight="bold"
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 4 }}
          color="text.secondary"
        >
          Sign in to continue your astrological journey
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
            error={!!emailError}
            helperText={emailError}
            disabled={loading}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePassword}
            error={!!passwordError}
            helperText={passwordError}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>or continue with</Divider>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => googleLogin()}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            onClick={handleFacebookLogin}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Facebook
          </Button>
          <Button
            variant="outlined"
            startIcon={<InstagramIcon />}
            onClick={handleInstagramLogin}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Instagram
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" fontWeight="bold">
              Sign up
            </Link>
          </Typography>
        </Box>
      </MotionPaper>
    </Box>
  );
};

export default LoginPage;