import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Check as CheckIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const MotionCard = motion(Card);

const SubscriptionPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/subscriptions/plans');
        setPlans(response.data);
      } catch (err) {
        console.error('Failed to fetch subscription plans:', err);
        setError('Failed to load subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);
  
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPaymentMethod(null);
  };
  
  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
  };
  
  const handleSubscribe = async () => {
    if (!selectedPlan || !paymentMethod) return;
    
    try {
      setProcessing(true);
      
      const response = await api.post('/api/v1/subscriptions/subscribe', {
        tier: selectedPlan.tier,
        payment_method: paymentMethod,
        duration: 1, // Default to 1 month
      });
      
      setSuccess(response.data.message);
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to process subscription:', err);
      setError('Payment processing failed. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };
  
  // Helper to check if plan is the user's current plan
  const isCurrentPlan = (planTier) => {
    return user?.subscription_tier === planTier;
  };
  
  if (loading) {
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
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h1"
          color="primary"
          gutterBottom
          fontWeight="bold"
        >
          Subscription Plans
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose the plan that best fits your cosmic journey
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={3} key={plan.tier}>
            <MotionCard
              raised={plan.tier !== 'FREE'}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
                borderColor: plan.tier !== 'FREE' ? 'primary.main' : undefined,
                ...(plan.tier === 'PREMIUM' && {
                  borderColor: 'secondary.main',
                  borderWidth: 2,
                  borderStyle: 'solid',
                }),
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {plan.tier === 'PREMIUM' && (
                <Chip
                  label="Popular"
                  color="secondary"
                  icon={<AutoAwesomeIcon />}
                  sx={{
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    fontWeight: 'bold',
                  }}
                />
              )}
              
              <CardHeader
                title={
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    {plan.name}
                  </Typography>
                }
                subheader={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="h4" component="span" fontWeight="bold">
                      ${plan.price}
                    </Typography>
                    {plan.price > 0 && (
                      <Typography variant="subtitle1" component="span" color="text.secondary">
                        /month
                      </Typography>
                    )}
                  </Box>
                }
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                sx={{
                  backgroundColor: theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                }}
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                <List>
                  {plan.features.map((feature) => (
                    <ListItem key={feature} sx={{ py: 1, px: 0 }}>
                      <ListItemIcon sx={{ color: 'primary.main' }}>
                        <CheckIcon />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                {isCurrentPlan(plan.tier) ? (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant={plan.tier === 'FREE' ? 'outlined' : 'contained'}
                    color={plan.tier === 'PREMIUM' ? 'secondary' : 'primary'}
                    onClick={() => handleSelectPlan(plan)}
                    disabled={plan.tier === 'FREE' && user?.subscription_tier !== 'FREE'}
                  >
                    {plan.tier === 'FREE' ? 'Free Plan' : 'Subscribe'}
                  </Button>
                )}
              </CardActions>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
      
      {/* Payment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight="bold">
            Subscribe to {selectedPlan?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            You are about to subscribe to the {selectedPlan?.name} plan for ${selectedPlan?.price} per month.
            Choose your preferred payment method:
          </DialogContentText>
          
          <Box sx={{ my: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant={paymentMethod === 'stripe' ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                  onClick={() => handlePaymentMethod('stripe')}
                  sx={{ p: 2 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <img 
                      src="/stripe-logo.png" 
                      alt="Stripe"
                      style={{ height: 30, marginBottom: 8 }}
                    />
                    <Typography variant="body2">Credit/Debit Card</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant={paymentMethod === 'paypal' ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                  onClick={() => handlePaymentMethod('paypal')}
                  sx={{ p: 2 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <img 
                      src="/paypal-logo.png" 
                      alt="PayPal"
                      style={{ height: 30, marginBottom: 8 }}
                    />
                    <Typography variant="body2">PayPal</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant={paymentMethod === 'crypto' ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                  onClick={() => handlePaymentMethod('crypto')}
                  sx={{ p: 2 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <img 
                      src="/usdt-logo.png" 
                      alt="USDT"
                      style={{ height: 30, marginBottom: 8 }}
                    />
                    <Typography variant="body2">USDT (TRC20)</Typography>
                  </Box>
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" color="text.secondary">
            By clicking "Subscribe", you agree to our terms and conditions. You can cancel your subscription at any time from your profile.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={handleSubscribe}
            disabled={!paymentMethod || processing}
            variant="contained"
            color="primary"
            startIcon={processing ? <CircularProgress size={20} /> : null}
          >
            {processing ? 'Processing...' : 'Subscribe'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionPage;