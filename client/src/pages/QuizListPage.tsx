import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search, FilterList, School, Language, TrendingUp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Mock data for demonstration
const mockQuizzes = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
    category: 'Programming',
    difficulty: 3,
    language: 'en',
    questionCount: 20,
    estimatedTime: 300,
    tags: ['javascript', 'programming', 'web'],
    effectiveness: 0.85,
  },
  {
    id: '2',
    title: 'JavaScript基礎',
    description: 'JavaScriptの基本的な変数、関数、制御構造の知識をテストします。',
    category: 'プログラミング',
    difficulty: 3,
    language: 'ja',
    questionCount: 15,
    estimatedTime: 240,
    tags: ['javascript', 'プログラミング', 'ウェブ'],
    effectiveness: 0.82,
  },
  {
    id: '3',
    title: 'React Components',
    description: 'Advanced concepts in React including hooks, context, and performance optimization.',
    category: 'Programming',
    difficulty: 7,
    language: 'en',
    questionCount: 25,
    estimatedTime: 450,
    tags: ['react', 'frontend', 'components'],
    effectiveness: 0.88,
  },
  {
    id: '4',
    title: 'データベース設計',
    description: 'リレーショナルデータベースの設計原則と正規化について学びます。',
    category: 'データベース',
    difficulty: 5,
    language: 'ja',
    questionCount: 18,
    estimatedTime: 360,
    tags: ['database', 'sql', 'design'],
    effectiveness: 0.79,
  },
];

const QuizListPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'success';
    if (difficulty <= 6) return 'warning';
    return 'error';
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 3) return 'Beginner';
    if (difficulty <= 6) return 'Intermediate';
    return 'Advanced';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight="600"
        >
          {t('nav.quizzes')}
        </Typography>
        
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ mb: 3 }}
        >
          Discover AI-powered quizzes tailored to your learning style
        </Typography>

        {/* Search and Filter Bar */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 4,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder={t('common.search')}
            variant="outlined"
            size="medium"
            sx={{ flexGrow: 1, minWidth: '250px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ minWidth: '120px' }}
          >
            {t('common.filter')}
          </Button>
        </Box>
      </Box>

      {/* Quiz Grid */}
      <Grid container spacing={3}>
        {mockQuizzes.map((quiz) => (
          <Grid item xs={12} md={6} lg={4} key={quiz.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip
                    size="small"
                    label={quiz.category}
                    color="primary"
                    variant="outlined"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Language fontSize="small" />
                    <Typography variant="caption">
                      {quiz.language.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>

                {/* Title and Description */}
                <Typography
                  variant="h6"
                  fontWeight="600"
                  gutterBottom
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {quiz.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    mb: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {quiz.description}
                </Typography>

                {/* Metadata */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    size="small"
                    label={getDifficultyText(quiz.difficulty)}
                    color={getDifficultyColor(quiz.difficulty)}
                    variant="filled"
                  />
                  <Chip
                    size="small"
                    label={`${quiz.questionCount} questions`}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={formatTime(quiz.estimatedTime)}
                    variant="outlined"
                  />
                </Box>

                {/* Effectiveness Score */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp fontSize="small" color="success" />
                  <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                    {Math.round(quiz.effectiveness * 100)}% effectiveness
                  </Typography>
                </Box>

                {/* Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {quiz.tags.slice(0, 3).map((tag) => (
                    <Chip
                      key={tag}
                      size="small"
                      label={tag}
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                  {quiz.tags.length > 3 && (
                    <Chip
                      size="small"
                      label={`+${quiz.tags.length - 3}`}
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>

                {/* Action Button */}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 'auto' }}
                  startIcon={<School />}
                >
                  {t('quiz.start')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{ px: 4 }}
        >
          Load More Quizzes
        </Button>
      </Box>
    </Container>
  );
};

export default QuizListPage;