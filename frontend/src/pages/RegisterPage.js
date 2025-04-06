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
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register, socialLogin, error, setError, loading } = useAuth();

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Account Details', 'Personal Information', 'Confirmation'];

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');

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
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateUsername = () => {
    if (!username) {
      setUsernameError('Username is required');
      return false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return validateEmail() && validatePassword() && validateConfirmPassword();
      case 1:
        return validateUsername();
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (validateStep(activeStep)) {
      try {
        const userData = {
          email,
          password,
          username,
          birth_date: birthDate || null,
          birth_time: birthTime || null,
          birth_location: birthLocation || null,
        };

        await register(userData);
        navigate('/login', { state: { message: 'Registration successful! Please check your email to verify your account.' } });
      } catch (err) {
        // Error is handled by the auth context
      }
    }
  };

  // Google registration handler
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

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
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
              required
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
              required
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
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validateConfirmPassword}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              disabled={loading}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={validateUsername}
              error={!!usernameError}
              helperText={usernameError}
              disabled={loading}
              required
            />
            <TextField
              label="Birth Date (optional)"
              type="date"
              fullWidth
              margin="normal"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Birth Time (optional)"
              type="time"
              fullWidth
              margin="normal"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
              helperText="For more accurate astrological readings"
            />
            <TextField
              label="Birth Location (optional)"
              fullWidth
              margin="normal"
              value={birthLocation}
              onChange={(e) => setBirthLocation(e.target.value)}
              disabled={loading}
              helperText="City, Country"
            />
          </>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1">Account Details</Typography>
              <Typography variant="body2">Email: {email}</Typography>
              <Typography variant="body2">Password: ••••••••</Typography>
            </Box>
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1">Personal Information</Typography>
              <Typography variant="body2">Username: {username}</Typography>
              {birthDate && <Typography variant="body2">Birth Date: {birthDate}</Typography>}
              {birthTime && <Typography variant="body2">Birth Time: {birthTime}</Typography>}
              {birthLocation && <Typography variant="body2">Birth Location: {birthLocation}</Typography>}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              By registering, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
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
          maxWidth: 600,
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
          Create an Account
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 4 }}
          color="text.secondary"
        >
          Join the cosmic journey and discover your astrological insights
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                disabled={loading}
              >
                Next
              </Button>
            )}
          </Box>
        </form>

        {activeStep === 0 && (
          <>
            <Divider sx={{ my: 3 }}>or register with</Divider>

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
          </>
        )}

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" fontWeight="bold">
              Sign in
            </Link>
          </Typography>
        </Box>
      </MotionPaper>
    </Box>
  );
};

export default RegisterPage;