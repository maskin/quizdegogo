import { ObjectType, Field, ID, Int, Float } from 'type-graphql';
import { Question } from './Question';

@ObjectType()
export class Quiz {
  @Field(() => ID)
  id!: string;

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

  @Field(() => Int)
  estimatedTime!: number;

  @Field(() => Float)
  effectiveness!: number;

  @Field()
  isPublic!: boolean;

  @Field()
  isActive!: boolean;

  @Field()
  aiGenerated!: boolean;

  @Field(() => Float)
  qualityScore!: number;

  @Field(() => Float)
  engagement!: number;

  @Field({ nullable: true })
  createdBy?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => [Question], { nullable: true })
  questions?: Question[];
}