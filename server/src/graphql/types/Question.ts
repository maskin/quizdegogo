import { ObjectType, Field, ID, Int, Float } from 'type-graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class Question {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  quizId!: string;

  @Field()
  type!: string;

  @Field()
  question!: string;

  @Field(() => GraphQLJSON, { nullable: true })
  options?: any;

  @Field()
  correctAnswer!: string;

  @Field({ nullable: true })
  explanation?: string;

  @Field(() => Int)
  difficulty!: number;

  @Field(() => Int)
  order!: number;

  @Field(() => Int, { nullable: true })
  timeLimit?: number;

  @Field(() => Int)
  points!: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  audioUrl?: string;

  @Field({ nullable: true })
  videoUrl?: string;

  @Field()
  aiGenerated!: boolean;

  @Field(() => Float)
  cognitiveLoad!: number;

  @Field(() => Float)
  discrimination!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}