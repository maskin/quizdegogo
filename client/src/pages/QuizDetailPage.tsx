import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const QuizDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quiz Detail Page
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This page will show detailed information about a specific quiz and allow users to start it.
        </Typography>
      </Box>
    </Container>
  );
};

export default QuizDetailPage;