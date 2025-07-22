import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              QuizDeGogo
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t('home.subtitle')}
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
              AI-powered learning platform for global education revolution.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/quizzes" color="inherit" underline="hover">
                Quizzes
              </Link>
              <Link href="/analytics" color="inherit" underline="hover">
                Analytics
              </Link>
              <Link href="/api" color="inherit" underline="hover">
                API
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" color="inherit" underline="hover">
                About Us
              </Link>
              <Link href="/careers" color="inherit" underline="hover">
                Careers
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/docs" color="inherit" underline="hover">
                Documentation
              </Link>
              <Link href="/blog" color="inherit" underline="hover">
                Blog
              </Link>
              <Link href="/support" color="inherit" underline="hover">
                Support
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
              <Link href="/terms" color="inherit" underline="hover">
                Terms of Service
              </Link>
              <Link href="/gdpr" color="inherit" underline="hover">
                GDPR
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            © {new Date().getFullYear()} QuizDeGogo. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
              Global Learning Platform v3.0
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;