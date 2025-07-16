import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      username
      firstName
      lastName
      avatar
      language
      role
      learningStyle
      difficultyLevel
      preferredTopics
      createdAt
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        username
        firstName
        lastName
        role
        language
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        username
        firstName
        lastName
        role
        language
      }
    }
  }
`;

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  language: string;
  role: string;
  learningStyle?: string;
  difficultyLevel?: number;
  preferredTopics?: string[];
  createdAt: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  language?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { data, loading: queryLoading, refetch } = useQuery(ME_QUERY, {
    skip: !localStorage.getItem('token'),
    errorPolicy: 'ignore',
  });

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
    setLoading(queryLoading);
  }, [data, queryLoading]);

  const login = useCallback(async (input: LoginInput) => {
    try {
      const { data } = await loginMutation({
        variables: { input },
      });

      if (data?.login) {
        const { token, user } = data.login;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        await refetch();
        return { success: true, user };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }, [loginMutation, refetch]);

  const register = useCallback(async (input: RegisterInput) => {
    try {
      const { data } = await registerMutation({
        variables: { input },
      });

      if (data?.register) {
        const { token, user } = data.register;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        await refetch();
        return { success: true, user };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  }, [registerMutation, refetch]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Clear Apollo cache
    // apolloClient.clearStore();
  }, []);

  return {
    user,
    loading: loading || loginLoading || registerLoading,
    login,
    register,
    logout,
    refetch,
  };
};