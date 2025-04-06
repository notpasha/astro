import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  Button,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  CreditCard as CreditCardIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Cake as CakeIcon,
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  
  // Form state
  const [profileData, setProfileData] = useState({
    username: '',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
  });
  
  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        birthDate: user.birth_date || '',
        birthTime: user.birth_time || '',
        birthLocation: user.birth_location || '',
      });
    }
  }, [user]);
  
  // Mock subscription details
  const subscriptionDetails = {
    plan: user?.subscription_tier || 'FREE',
    status: 'Active',
    nextBilling: user?.subscription_expiry || '—',
    paymentMethod: 'Visa •••• 4242',
  };
  
  // Mock payment history
  const paymentHistory = [
    {
      id: 'INV-001',
      date: '2023-03-01',
      amount: '$19.99',
      status: 'Paid',
    },
    {
      id: 'INV-002',
      date: '2023-04-01',
      amount: '$19.99',
      status: 'Paid',
    },
    {
      id: 'INV-003',
      date: '2023-05-01',
      amount: '$19.99',
      status: 'Pending',
    },
  ];
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEditToggle = () => {
    setEditing(!editing);
    
    // Reset form if canceling edit
    if (editing) {
      setProfileData({
        username: user?.username || '',
        birthDate: user?.birth_date || '',
        birthTime: user?.birth_time || '',
        birthLocation: user?.birth_location || '',
      });
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // This would be a real API call in a complete app
      // await api.put('/api/v1/users/profile', profileData);
      
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelSubscription = () => {
    setOpenCancelDialog(true);
  };
  
  const confirmCancelSubscription = async () => {
    try {
      setLoading(true);
      
      // This would be a real API call in a complete app
      // await api.post('/api/v1/subscriptions/cancel');
      
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess('Subscription cancelled successfully. You will have access until the end of your billing period.');
      setOpenCancelDialog(false);
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString || dateString === '—') return '—';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (!user) {
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
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 3,
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
              }}
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
                {user.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <EmailIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                {user.email}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <BadgeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                {user.subscription_tier} Plan
              </Typography>
              
              {success && (
                <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
            </Box>
            
            <Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/subscription')}
                sx={{ mr: 1 }}
              >
                Upgrade Plan
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={logout}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Profile Tabs */}
        <Grid item xs={12}>
          <Paper elevation={2}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
            >
              <Tab icon={<PersonIcon />} label="Profile" />
              <Tab icon={<CreditCardIcon />} label="Subscription" />
              <Tab icon={<HistoryIcon />} label="Payment History" />
              <Tab icon={<SettingsIcon />} label="Settings" />
            </Tabs>
            
            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant={editing ? 'outlined' : 'contained'}
                  color={editing ? 'secondary' : 'primary'}
                  startIcon={editing ? <CancelIcon /> : <EditIcon />}
                  onClick={handleEditToggle}
                  disabled={loading}
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>
              
              <form onSubmit={handleUpdateProfile}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      disabled={!editing || loading}
                      InputProps={{
                        startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={user.email}
                      disabled
                      InputProps={{
                        startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Birth Date"
                      name="birthDate"
                      type="date"
                      value={profileData.birthDate}
                      onChange={handleInputChange}
                      disabled={!editing || loading}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <CakeIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Birth Time"
                      name="birthTime"
                      type="time"
                      value={profileData.birthTime}
                      onChange={handleInputChange}
                      disabled={!editing || loading}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <ScheduleIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Birth Location"
                      name="birthLocation"
                      value={profileData.birthLocation}
                      onChange={handleInputChange}
                      disabled={!editing || loading}
                      placeholder="City, Country"
                      InputProps={{
                        startAdornment: <LocationOnIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  
                  {editing && (
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </form>
            </TabPanel>
            
            {/* Subscription Tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Subscription Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Current Plan
                  </Typography>
                  <Typography variant="body1">{subscriptionDetails.plan}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Status
                  </Typography>
                  <Typography variant="body1">{subscriptionDetails.status}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Next Billing Date
                  </Typography>
                  <Typography variant="body1">{formatDate(subscriptionDetails.nextBilling)}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Payment Method
                  </Typography>
                  <Typography variant="body1">{subscriptionDetails.paymentMethod}</Typography>
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/subscription')}
                    >
                      Change Plan
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleCancelSubscription}
                      disabled={subscriptionDetails.plan === 'FREE'}
                    >
                      Cancel Subscription
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Payment History Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom color="primary">
                Payment History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {paymentHistory.map((payment) => (
                  <ListItem key={payment.id} divider>
                    <ListItemText
                      primary={`Invoice ${payment.id}`}
                      secondary={formatDate(payment.date)}
                    />
                    <ListItemText
                      primary={payment.amount}
                      secondary={payment.status}
                      sx={{ textAlign: 'right' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="download">
                        <HistoryIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </TabPanel>
            
            {/* Settings Tab */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Account Settings
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<LockIcon />}
                  >
                    Change Password
                  </Button>
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Email Notifications
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {/* Email notification settings would go here */}
                
                <Grid item xs={12} sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" color="error">
                      Delete Account
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Cancel Subscription Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)} disabled={loading}>
            Keep Subscription
          </Button>
          <Button
            onClick={confirmCancelSubscription}
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;