import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 140px)',
          textAlign: 'center',
          py: 5,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h1"
            color="primary"
            sx={{
              fontSize: { xs: '5rem', md: '8rem' },
              fontWeight: 800,
              mb: 2,
            }}
          >
            404
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 3,
              fontWeight: 600,
            }}
          >
            Lost in the Cosmos
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{
              fontSize: '1.1rem',
              maxWidth: 500,
              mb: 4,
            }}
          >
            The celestial path you're seeking appears to be hidden among the stars.
            Perhaps the stars have realigned or the cosmic forces have moved this page elsewhere.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<HomeIcon />}
            sx={{ borderRadius: 2, px: 4, py: 1 }}
          >
            Return to Earth
          </Button>
        </motion.div>
      </Box>
    </Container>
  );
};

export default NotFoundPage;