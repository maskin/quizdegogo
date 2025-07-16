import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const QuizPlayPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quiz Play Interface
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This page will contain the interactive quiz playing interface with questions, timer, and progress tracking.
        </Typography>
      </Box>
    </Container>
  );
};

export default QuizPlayPage;