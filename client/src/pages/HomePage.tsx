import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Psychology,
  Public,
  Analytics,
  SmartToy,
  Language,
  TrendingUp,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();

  const features = [
    {
      icon: <Psychology />,
      title: t('home.features.adaptive.title'),
      description: t('home.features.adaptive.description'),
      color: theme.palette.primary.main,
    },
    {
      icon: <Public />,
      title: t('home.features.global.title'),
      description: t('home.features.global.description'),
      color: theme.palette.secondary.main,
    },
    {
      icon: <Analytics />,
      title: t('home.features.analytics.title'),
      description: t('home.features.analytics.description'),
      color: theme.palette.success.main,
    },
    {
      icon: <SmartToy />,
      title: 'AI-Powered Engine',
      description: 'Advanced machine learning algorithms for personalized learning paths.',
      color: theme.palette.warning.main,
    },
    {
      icon: <Language />,
      title: 'Multilingual Support',
      description: 'Available in 15+ languages with cultural adaptation features.',
      color: theme.palette.info.main,
    },
    {
      icon: <TrendingUp />,
      title: 'Learning Effectiveness',
      description: 'Proven to increase learning retention by up to 80%.',
      color: theme.palette.error.main,
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          textAlign: 'center',
          py: { xs: 6, md: 10 },
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          borderRadius: 3,
          mb: 8,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('home.title')}
        </Typography>
        
        <Typography
          variant="h4"
          component="h2"
          color="textSecondary"
          gutterBottom
          sx={{ mb: 3, fontSize: { xs: '1.25rem', md: '1.75rem' } }}
        >
          {t('home.subtitle')}
        </Typography>
        
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
        >
          {t('home.description')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to={user ? '/quizzes' : '/register'}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 3,
              textTransform: 'none',
            }}
          >
            {t('home.getStarted')}
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/quizzes"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 3,
              textTransform: 'none',
            }}
          >
            {t('home.learnMore')}
          </Button>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Chip label="AI-Powered" color="primary" variant="outlined" />
          <Chip label="15+ Languages" color="secondary" variant="outlined" />
          <Chip label="Global Platform" color="success" variant="outlined" />
          <Chip label="Learning Analytics" color="warning" variant="outlined" />
        </Box>
      </MotionBox>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Why Choose QuizDeGogo?
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid {...({ item: true, xs: 12, md: 6, lg: 4, key: index } as any)}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: alpha(feature.color, 0.1),
                      color: feature.color,
                      mb: 2,
                    }}
                  >
                    {React.cloneElement(feature.icon, { fontSize: 'large' })}
                  </Box>
                  
                  <Typography variant="h6" gutterBottom fontWeight="600">
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        sx={{
          textAlign: 'center',
          py: 6,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 3,
          mb: 8,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="600">
          Global Impact
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid {...({ item: true, xs: 12, md: 3 } as any)}>
            <Typography variant="h3" color="primary" fontWeight="700">
              10K+
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Active Users
            </Typography>
          </Grid>
          
          <Grid {...({ item: true, xs: 12, md: 3 } as any)}>
            <Typography variant="h3" color="secondary" fontWeight="700">
              50K+
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Quiz Questions
            </Typography>
          </Grid>
          
          <Grid {...({ item: true, xs: 12, md: 3 } as any)}>
            <Typography variant="h3" color="success.main" fontWeight="700">
              15+
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Languages
            </Typography>
          </Grid>
          
          <Grid {...({ item: true, xs: 12, md: 3 } as any)}>
            <Typography variant="h3" color="warning.main" fontWeight="700">
              80%
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Learning Improvement
            </Typography>
          </Grid>
        </Grid>
      </MotionBox>

      {/* CTA Section */}
      {!user && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          sx={{
            textAlign: 'center',
            py: 6,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 3,
            color: 'white',
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="600">
            Ready to Start Learning?
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Join thousands of learners improving their knowledge with AI-powered quizzes
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              bgcolor: 'white',
              color: theme.palette.primary.main,
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': {
                bgcolor: alpha('white', 0.9),
              },
            }}
          >
            Get Started for Free
          </Button>
        </MotionBox>
      )}
    </Container>
  );
};

export default HomePage;