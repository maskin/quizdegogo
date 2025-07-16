import { ObjectType, Field, ID, Int, Float } from 'type-graphql';

@ObjectType()
export class QuizAttempt {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  quizId!: string;

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
}

@ObjectType()
export class UserAnalytics {
  @Field(() => ID)
  id!: string;

  @Field()
  date!: Date;

  @Field(() => Int)
  questionsAnswered!: number;

  @Field(() => Int)
  correctAnswers!: number;

  @Field(() => Int)
  timeSpent!: number;

  @Field(() => Float)
  knowledgeGain!: number;

  @Field(() => Float)
  retentionRate!: number;

  @Field(() => Float)
  learningVelocity!: number;

  @Field(() => Float)
  engagementScore!: number;
}

@ObjectType()
export class QuizAnalytics {
  @Field(() => ID)
  id!: string;

  @Field()
  date!: Date;

  @Field(() => Int)
  attempts!: number;

  @Field(() => Int)
  completions!: number;

  @Field(() => Float)
  avgScore!: number;

  @Field(() => Float)
  effectiveness!: number;
}