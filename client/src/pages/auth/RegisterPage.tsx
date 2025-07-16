import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This page will contain the user registration form.
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;