import { ObjectType, Field, ID, Int, Float } from 'type-graphql';

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
  createdAt!: Date;
}