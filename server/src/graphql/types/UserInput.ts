import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email!: string;

  @Field()
  username!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  language?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  language?: string;

  @Field({ nullable: true })
  learningStyle?: string;

  @Field({ nullable: true })
  difficultyLevel?: number;

  @Field(() => [String], { nullable: true })
  preferredTopics?: string[];
}