import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  username!: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  language!: string;

  @Field()
  role!: string;

  @Field({ nullable: true })
  learningStyle?: string;

  @Field({ nullable: true })
  difficultyLevel?: number;

  @Field(() => [String], { nullable: true })
  preferredTopics?: string[];

  @Field()
  createdAt!: Date;
}