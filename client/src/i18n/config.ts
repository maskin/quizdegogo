import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === "development",
    
    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },

    resources: {
      en: {
        common: {
          loading: 'Loading...',
          error: 'An error occurred',
          save: 'Save',
          cancel: 'Cancel',
          delete: 'Delete',
          edit: 'Edit',
          back: 'Back',
          next: 'Next',
          previous: 'Previous',
          submit: 'Submit',
          search: 'Search',
          filter: 'Filter',
          clear: 'Clear',
          login: 'Login',
          logout: 'Logout',
          register: 'Register',
          profile: 'Profile',
          settings: 'Settings',
        },
        nav: {
          home: 'Home',
          quizzes: 'Quizzes',
          analytics: 'Analytics',
          profile: 'Profile',
          login: 'Login',
          register: 'Register',
        },
        quiz: {
          title: 'Quiz',
          start: 'Start Quiz',
          submit: 'Submit Answer',
          next: 'Next Question',
          finish: 'Finish Quiz',
          score: 'Score',
          correct: 'Correct',
          incorrect: 'Incorrect',
          timeRemaining: 'Time Remaining',
          question: 'Question {{number}} of {{total}}',
          difficulty: 'Difficulty',
          category: 'Category',
          language: 'Language',
        },
        auth: {
          loginTitle: 'Login to QuizDeGogo',
          registerTitle: 'Join QuizDeGogo',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          firstName: 'First Name',
          lastName: 'Last Name',
          username: 'Username',
          forgotPassword: 'Forgot Password?',
          noAccount: "Don't have an account?",
          hasAccount: 'Already have an account?',
        },
        home: {
          title: 'Welcome to QuizDeGogo',
          subtitle: 'Global Learning Platform for All Life Forms',
          description: 'AI-powered adaptive quizzes designed to maximize learning effectiveness across all platforms and environments.',
          getStarted: 'Get Started',
          learnMore: 'Learn More',
          features: {
            adaptive: {
              title: 'Adaptive Learning',
              description: 'AI algorithms adapt to your learning style and pace for optimal knowledge retention.',
            },
            global: {
              title: 'Global Platform',
              description: 'Available on web, mobile, IoT devices, and kiosks worldwide.',
            },
            analytics: {
              title: 'Learning Analytics',
              description: 'Track your progress with detailed analytics and effectiveness measurements.',
            },
          },
        },
      },
      ja: {
        common: {
          loading: '読み込み中...',
          error: 'エラーが発生しました',
          save: '保存',
          cancel: 'キャンセル',
          delete: '削除',
          edit: '編集',
          back: '戻る',
          next: '次へ',
          previous: '前へ',
          submit: '送信',
          search: '検索',
          filter: 'フィルター',
          clear: 'クリア',
          login: 'ログイン',
          logout: 'ログアウト',
          register: '登録',
          profile: 'プロフィール',
          settings: '設定',
        },
        nav: {
          home: 'ホーム',
          quizzes: 'クイズ',
          analytics: '分析',
          profile: 'プロフィール',
          login: 'ログイン',
          register: '登録',
        },
        quiz: {
          title: 'クイズ',
          start: 'クイズを開始',
          submit: '回答を送信',
          next: '次の問題',
          finish: 'クイズを終了',
          score: 'スコア',
          correct: '正解',
          incorrect: '不正解',
          timeRemaining: '残り時間',
          question: '問題 {{number}} / {{total}}',
          difficulty: '難易度',
          category: 'カテゴリ',
          language: '言語',
        },
        auth: {
          loginTitle: 'QuizDeGogoにログイン',
          registerTitle: 'QuizDeGogoに参加',
          email: 'メールアドレス',
          password: 'パスワード',
          confirmPassword: 'パスワード確認',
          firstName: '名',
          lastName: '姓',
          username: 'ユーザー名',
          forgotPassword: 'パスワードを忘れた場合',
          noAccount: 'アカウントをお持ちでない方',
          hasAccount: '既にアカウントをお持ちの方',
        },
        home: {
          title: 'QuizDeGogoへようこそ',
          subtitle: '全生命体のためのグローバル学習プラットフォーム',
          description: 'あらゆるプラットフォームと環境で学習効果を最大化するAI搭載アダプティブクイズ。',
          getStarted: '始める',
          learnMore: '詳細',
          features: {
            adaptive: {
              title: 'アダプティブラーニング',
              description: 'AIアルゴリズムがあなたの学習スタイルとペースに適応し、最適な知識定着を実現します。',
            },
            global: {
              title: 'グローバルプラットフォーム',
              description: 'ウェブ、モバイル、IoTデバイス、キオスクで世界中で利用可能。',
            },
            analytics: {
              title: '学習分析',
              description: '詳細な分析と効果測定で学習進捗を追跡します。',
            },
          },
        },
      },
    },
  });

export default i18n;