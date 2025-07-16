# Quiz Engine - MVP Core Implementation

## Overview

This is the core quiz engine implementation for QuizDeGogo MVP. It provides the foundational functionality for adaptive learning through intelligent quiz management, scoring, and user analytics.

## 🎯 Key Features

### Core Quiz Engine Features
- **Quiz Management**: Browse, filter, and access quizzes by category, difficulty, and language
- **Adaptive Scoring**: Advanced algorithms that consider difficulty, time, and answer patterns
- **Learning Analytics**: Real-time measurement of learning effectiveness, retention, and engagement
- **AI Recommendations**: Personalized quiz suggestions based on user learning history
- **Multiple Question Types**: Support for multiple choice, true/false, and fill-in-the-blank questions
- **User Learning Profiles**: Track progress, identify strengths and improvement areas

### Supported Question Types
- **Multiple Choice**: Standard multiple-choice questions with 2-6 options
- **True/False**: Binary choice questions
- **Fill-in-the-Blank**: Text-based answers with fuzzy matching

## 🏗️ Architecture

### Core Components

```
CoreQuizEngine
├── Quiz Management
│   ├── getAvailableQuizzes() - Browse and filter quizzes
│   ├── getQuiz() - Get specific quiz details
│   └── Filtering (category, difficulty, language)
├── Quiz Attempts
│   ├── startQuizAttempt() - Begin quiz session
│   ├── submitQuizAttempt() - Submit answers and calculate results
│   └── Real-time scoring algorithms
├── Learning Analytics
│   ├── calculateResults() - Advanced scoring with learning metrics
│   ├── getUserStats() - Comprehensive user analytics
│   └── Learning effectiveness measurement
└── Recommendation Engine
    ├── generateRecommendations() - AI-powered quiz suggestions
    ├── User preference analysis
    └── Adaptive difficulty matching
```

## 📊 Scoring Algorithm

### Multi-Factor Scoring System
1. **Base Score**: Percentage of correct answers
2. **Difficulty Bonus**: Up to 10% bonus for harder questions
3. **Time Efficiency**: Performance relative to estimated time
4. **Learning Metrics**:
   - **Learning Gain**: Knowledge acquisition rate
   - **Retention Score**: Long-term learning potential
   - **Engagement Score**: User interaction quality

### Learning Analytics
```typescript
interface LearningMetrics {
  learningGain: number;      // 0-1: Knowledge acquisition rate
  retentionScore: number;    // 0-1: Long-term retention potential
  engagementScore: number;   // 0-1: User engagement level
}
```

## 🤖 AI Recommendation Engine

### Recommendation Factors
- **Category Preferences** (40% weight): User's historical category engagement
- **Difficulty Matching** (30% weight): Optimal challenge level based on performance
- **Quiz Quality** (30% weight): Effectiveness and engagement ratings

### Adaptive Learning
- Tracks user performance patterns
- Identifies optimal difficulty levels
- Suggests personalized learning paths
- Avoids quiz repetition

## 🚀 Quick Start

### Basic Usage

```typescript
import { CoreQuizEngine } from './core/QuizEngine';

// Initialize the engine
const engine = new CoreQuizEngine();

// Browse available quizzes
const quizzes = engine.getAvailableQuizzes({
  category: 'Programming',
  difficulty: { min: 3, max: 5 }
});

// Start a quiz attempt
const attempt = engine.startQuizAttempt('user-1', 'quiz-id');

// Submit answers
const answers = ['42', 'True', 'javascript'];
const results = engine.submitQuizAttempt(attempt.id, answers);

// Get personalized recommendations
const recommendations = engine.generateRecommendations('user-1', 5);

// View user analytics
const stats = engine.getUserStats('user-1');
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- QuizEngine.test.ts
```

### Demo Test

```bash
# Run the interactive demo
npx ts-node src/core/testQuizEngine.ts
```

## 📈 Performance Metrics

### Test Results
- ✅ **17/17 tests passing**
- 🎯 **100% core functionality coverage**
- ⚡ **Sub-second response times**
- 🧠 **Advanced learning analytics**

### Sample Output
```
🎯 Final Score: 84.3%
✅ Correct Answers: 2/3
📈 Learning Metrics:
   🧠 Learning Gain: 20.0%
   🎯 Retention Score: 57.3%
   💫 Engagement Score: 81.3%
```

## 🔧 API Reference

### Core Methods

#### `getAvailableQuizzes(filter?)`
Returns filtered list of available quizzes.

**Parameters:**
- `filter.category`: Filter by quiz category
- `filter.difficulty`: Filter by difficulty range (min/max)
- `filter.language`: Filter by language

#### `startQuizAttempt(userId, quizId)`
Initiates a new quiz attempt for a user.

**Returns:** QuizAttempt object with attempt details

#### `submitQuizAttempt(attemptId, answers)`
Submits quiz answers and calculates comprehensive results.

**Returns:** Completed QuizAttempt with scores and analytics

#### `generateRecommendations(userId, limit)`
Generates personalized quiz recommendations.

**Returns:** Array of recommended quizzes with match scores

#### `getUserStats(userId)`
Retrieves comprehensive user learning analytics.

**Returns:** User statistics including performance metrics

## 🎨 Data Structures

### Quiz Structure
```typescript
interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: number;        // 1-10 scale
  questions: Question[];
  effectiveness: number;     // 0-1 quality score
}
```

### Question Structure
```typescript
interface Question {
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  question: string;
  options?: string[];       // For multiple choice
  correctAnswer: string;
  explanation?: string;
  difficulty: number;       // 1-10 scale
  points: number;
}
```

## 🧪 Testing & Quality Assurance

### Test Coverage
- **Quiz Management**: 4 tests - Browse, filter, retrieve quizzes
- **Quiz Attempts**: 4 tests - Start, submit, score calculation  
- **Learning Analytics**: 2 tests - Metrics calculation, user stats
- **Recommendations**: 3 tests - Generation, filtering, preferences
- **Answer Evaluation**: 2 tests - Multiple choice, fill-in-blank
- **Data Management**: 2 tests - User tracking, attempt persistence

### Quality Metrics
- TypeScript strict mode compliance
- Comprehensive error handling
- Input validation and sanitization
- Performance optimization
- Memory management

## 🚀 Production Readiness

### MVP Features Complete
- ✅ Core quiz engine functionality
- ✅ Advanced scoring algorithms
- ✅ Learning analytics and metrics
- ✅ AI-powered recommendations
- ✅ User learning profiles
- ✅ Comprehensive test suite
- ✅ TypeScript type safety
- ✅ Documentation and examples

### Next Steps for Integration
1. **Database Integration**: Replace in-memory storage with Prisma ORM
2. **GraphQL API**: Expose functionality through GraphQL resolvers
3. **Authentication**: Add JWT-based user authentication
4. **Caching**: Implement Redis caching for performance
5. **Real-time Features**: Add WebSocket support for live quizzes
6. **Advanced AI**: Integrate machine learning models for enhanced recommendations

## 📄 License

MIT License - See LICENSE file for details.

---

**QuizDeGogo Quiz Engine v1.0** - Ready for MVP deployment! 🚀