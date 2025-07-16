import { InputType, Field, Int } from 'type-graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class QuizFilterInput {
  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  language?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => DifficultyRange, { nullable: true })
  difficulty?: DifficultyRange;

  @Field({ nullable: true })
  sortBy?: string;
}

@InputType()
export class DifficultyRange {
  @Field(() => Int, { nullable: true })
  min?: number;

  @Field(() => Int, { nullable: true })
  max?: number;
}

@InputType()
export class CreateQuizInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  category!: string;

  @Field(() => Int)
  difficulty!: number;

  @Field()
  language!: string;

  @Field(() => [String])
  tags!: string[];

  @Field(() => Int, { defaultValue: 300 })
  estimatedTime!: number;

  @Field(() => [CreateQuestionInput])
  questions!: CreateQuestionInput[];
}

@InputType()
export class CreateQuestionInput {
  @Field()
  question!: string;

  @Field()
  type!: string;

  @Field(() => GraphQLJSON, { nullable: true })
  options?: any;

  @Field()
  correctAnswer!: string;

  @Field({ nullable: true })
  explanation?: string;

  @Field(() => Int, { defaultValue: 1 })
  difficulty!: number;

  @Field(() => Int, { nullable: true })
  timeLimit?: number;

  @Field(() => Int, { defaultValue: 1 })
  points!: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  audioUrl?: string;

  @Field({ nullable: true })
  videoUrl?: string;
}