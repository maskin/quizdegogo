import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This page will show user profile information, learning preferences, and account settings.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;