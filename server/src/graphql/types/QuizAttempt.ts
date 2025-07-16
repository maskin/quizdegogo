import { ObjectType, Field, ID, Int, Float } from 'type-graphql';
import { Quiz } from './Quiz';
import { Question } from './Question';

@ObjectType()
export class QuizAttempt {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  quizId!: string;

  @Field(() => Quiz)
  quiz!: Quiz;

  @Field()
  startedAt!: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field(() => Float)
  score!: number;

  @Field(() => Int)
  totalQuestions!: number;

  @Field(() => Int)
  correctAnswers!: number;

  @Field(() => Int)
  timeSpent!: number;

  @Field(() => Float)
  learningGain!: number;

  @Field(() => Float)
  retentionScore!: number;

  @Field(() => Float)
  engagementScore!: number;

  @Field(() => [QuestionAttempt], { nullable: true })
  questionAttempts?: QuestionAttempt[];
}

@ObjectType()
export class QuestionAttempt {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  quizAttemptId!: string;

  @Field(() => ID)
  questionId!: string;

  @Field(() => Question)
  question!: Question;

  @Field()
  userAnswer!: string;

  @Field()
  isCorrect!: boolean;

  @Field(() => Int)
  timeSpent!: number;

  @Field(() => Float, { nullable: true })
  confidence?: number;

  @Field(() => Int)
  hintsUsed!: number;

  @Field(() => Int)
  attempts!: number;

  @Field()
  answeredAt!: Date;
}