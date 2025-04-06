import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  AutoGraph as AutoGraphIcon,
  Favorite as FavoriteIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

// Animated component wrapper
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

const HomePage = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <AutoAwesomeIcon fontSize="large" />,
      title: 'Personalized Insights',
      description: 'Get astrological readings tailored to your unique birth chart and current planetary positions.',
    },
    {
      icon: <PsychologyIcon fontSize="large" />,
      title: 'AI-Powered Guidance',
      description: 'Our advanced AI understands your questions and provides meaningful astrological guidance.',
    },
    {
      icon: <AutoGraphIcon fontSize="large" />,
      title: 'Detailed Forecasts',
      description: 'Receive in-depth forecasts about your career, relationships, and personal growth opportunities.',
    },
    {
      icon: <FavoriteIcon fontSize="large" />,
      title: 'Relationship Compatibility',
      description: 'Discover how the stars influence your relationships with friends, family, and romantic partners.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: theme.palette.primary.dark,
          height: { xs: '60vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <MotionTypography
                variant="h1"
                color="white"
                fontWeight="bold"
                sx={{ mb: 2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Unlock Cosmic Wisdom with AI
              </MotionTypography>
              <MotionTypography
                variant="h5"
                color="white"
                sx={{ mb: 4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Your personal AI astrological assistant, available 24/7 to guide you through life's journey.
              </MotionTypography>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mr: 2 }}
                >
                  Get Started
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="secondary"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Login
                </Button>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 6 }}
            color="primary"
          >
            Discover Your Cosmic Journey
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                    },
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      p: 2,
                      color: 'primary.main',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" align="center">
                      {feature.title}
                    </Typography>
                    <Typography align="center" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 8, backgroundColor: theme.palette.primary.dark }}>
        <Container maxWidth="md">
          <MotionBox
            textAlign="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h3" color="white" gutterBottom>
              Ready to Explore the Stars?
            </Typography>
            <Typography variant="h6" color="white" sx={{ mb: 4 }}>
              Start your cosmic journey today with our AI-powered astrological guidance.
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Start Free Trial
            </Button>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;