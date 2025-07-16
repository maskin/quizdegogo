# QuizDeGogo - Global Learning Platform

## Overview

QuizDeGogo is an AI-powered global quiz platform designed for "all life forms" learning. This repository contains the complete implementation of the MVP (Minimum Viable Product) following the enhanced requirements definition v3.0.

## Features

### Core Features (MVP)
- 🧠 **AI-Powered Learning Engine**: Adaptive quiz recommendations based on user learning patterns
- 🌍 **Multi-language Support**: Japanese and English support with i18next framework
- 📊 **Learning Analytics**: Real-time tracking of learning effectiveness and progress
- 💻 **Progressive Web App (PWA)**: Works seamlessly across devices and platforms
- 🔒 **Secure Authentication**: JWT-based authentication with role-based access control
- 📈 **Performance Optimized**: Sub-1-second response times with caching strategies

### Technology Stack

#### Backend
- **Framework**: Node.js + Express + GraphQL (Apollo Server)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for session management and performance
- **Authentication**: JWT with bcrypt password hashing
- **Language**: TypeScript for type safety

#### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Apollo Client for GraphQL state
- **Build Tool**: Vite for fast development and builds
- **PWA**: Service Worker with Workbox
- **Internationalization**: i18next + react-i18next

#### Infrastructure & DevOps
- **Development**: Docker containers for consistent environments
- **Database Migration**: Prisma migrations
- **Logging**: Winston for structured logging
- **Code Quality**: ESLint + TypeScript strict mode

## Getting Started

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL 13+
- Redis 6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/maskin/quizdegogo.git
   cd quizdegogo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Server environment
   cp server/.env.example server/.env
   # Edit server/.env with your database and Redis URLs
   
   # Client environment (optional)
   cp client/.env.example client/.env
   ```

4. **Set up the database**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma db seed  # Optional: seed with sample data
   ```

5. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   
   # This will start:
   # - Server on http://localhost:4000
   # - Client on http://localhost:3000
   # - GraphQL Playground on http://localhost:4000/graphql
   ```

### Database Setup

The application uses PostgreSQL with Prisma ORM. The schema includes:

- **Users**: Authentication, profiles, learning preferences
- **Quizzes**: Quiz metadata, questions, and content
- **Quiz Attempts**: User quiz sessions and results  
- **Analytics**: Learning effectiveness tracking
- **Achievements**: Gamification elements

### Environment Variables

#### Server (.env)
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/quizdegogo"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=development
CLIENT_URL="http://localhost:3000"
```

## Architecture

### System Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React PWA     │    │  GraphQL API     │    │  PostgreSQL     │
│   (Frontend)    │◄──►│  + AI Engine     │◄──►│  + Vector DB    │
│   Material-UI   │    │  Apollo Server   │    │  Prisma ORM     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                               │
                    ┌──────────────────┐
                    │  Redis Cluster   │
                    │  Session Cache   │
                    └──────────────────┘
```

### Key Design Principles

1. **API-First Design**: GraphQL API enables future platform integrations
2. **Scalable Architecture**: Microservices-ready with clear separation of concerns
3. **Global-Ready**: Multi-language support and cultural adaptation from MVP
4. **Performance-Oriented**: Caching, optimization, and real-time analytics
5. **Security-First**: Authentication, authorization, and data protection

## API Documentation

### GraphQL Endpoints

The GraphQL API provides the following main operations:

#### Authentication
- `login(input: LoginInput!)`: User authentication
- `register(input: RegisterInput!)`: User registration
- `logout`: Session termination

#### User Management
- `me`: Get current user profile
- `updateProfile(input: UpdateUserInput!)`: Update user preferences
- `users`: Admin endpoint for user management

#### Quiz Operations
- `quizzes(filter: QuizFilterInput)`: Get available quizzes
- `quiz(id: String!)`: Get specific quiz details
- `recommendedQuizzes`: AI-powered quiz recommendations
- `startQuizAttempt(quizId: String!)`: Begin quiz session
- `submitQuizAttempt(attemptId: String!, answers: [String!]!)`: Submit quiz results

#### Analytics
- `userAnalytics(userId: String, days: Int)`: Learning progress data
- `quizAnalytics(quizId: String!)`: Quiz effectiveness metrics
- `globalAnalytics`: Platform-wide statistics (admin only)

### Example Queries

```graphql
# Get current user
query Me {
  me {
    id
    username
    email
    learningStyle
    preferredTopics
  }
}

# Get quizzes with filters
query GetQuizzes($filter: QuizFilterInput) {
  quizzes(filter: $filter) {
    id
    title
    category
    difficulty
    language
    effectiveness
  }
}

# Start a quiz
mutation StartQuiz($quizId: String!) {
  startQuizAttempt(quizId: $quizId) {
    id
    quiz {
      title
      questions {
        id
        question
        options
      }
    }
  }
}
```

## Development

### Available Scripts

```bash
# Root level
npm run dev          # Start both client and server in development
npm run build        # Build both client and server for production
npm run test         # Run all tests
npm run lint         # Lint both client and server code

# Server specific
npm run server:dev   # Start server in development mode
npm run server:build # Build server for production
npm run server:test  # Run server tests

# Client specific  
npm run client:dev   # Start client development server
npm run client:build # Build client for production
npm run client:test  # Run client tests
```

### Code Structure

```
quizdegogo/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── graphql/        # GraphQL queries and client
│   │   └── i18n/           # Internationalization
│   └── public/             # Static assets
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── graphql/        # GraphQL resolvers and types
│   │   ├── services/       # Business logic services
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── database/       # Database utilities
│   └── prisma/             # Database schema and migrations
├── database/               # Database scripts and docs
├── docs/                   # Documentation
└── REQUIREMENTS_v3.0.md    # Enhanced requirements specification
```

## Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes with tests**
   - Write or update tests for new functionality
   - Follow TypeScript best practices
   - Use meaningful commit messages

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   ```

4. **Submit a pull request**
   - Describe the changes and their purpose
   - Include any breaking changes
   - Add screenshots for UI changes

### Code Style

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Enforced code style and best practices
- **Prettier**: Consistent code formatting
- **GraphQL**: Use schema-first design with type generation

## Deployment

### Production Build

```bash
# Build both client and server
npm run build

# Start production server
npm start
```

### Environment Setup

- **Database**: Set up PostgreSQL with connection pooling
- **Cache**: Configure Redis cluster for high availability  
- **Security**: Use environment-specific JWT secrets
- **Monitoring**: Set up logging and error tracking
- **CDN**: Configure CDN for static assets

### Scaling Considerations

The current MVP architecture supports:
- **Horizontal scaling**: Stateless server design
- **Database optimization**: Query optimization and indexing
- **Caching strategy**: Redis for session and query caching
- **CDN integration**: Static asset optimization

## Roadmap

### Phase 2: Regional Expansion (Months 18-36)
- 15+ language support with cultural adaptation
- Mobile native apps (iOS/Android)
- IoT device integration APIs
- Advanced AI recommendation algorithms
- B2B enterprise features

### Phase 3: Global Domination (Months 36-60)  
- AR/VR platform integration
- Voice assistant compatibility
- Real-time collaborative features
- Advanced learning analytics with ML
- Global marketplace for quiz content

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/maskin/quizdegogo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/maskin/quizdegogo/discussions)

---

**QuizDeGogo v3.0** - Building the future of global learning, one quiz at a time. 🚀