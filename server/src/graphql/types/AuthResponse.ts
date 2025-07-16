import { ObjectType, Field } from 'type-graphql';
import { User } from './User';

@ObjectType()
export class AuthResponse {
  @Field()
  token!: string;

  @Field(() => User)
  user!: User;
}