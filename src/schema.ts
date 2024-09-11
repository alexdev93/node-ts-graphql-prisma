import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: Int!
    email: String!
  }

  type Post {
    id: Int!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    users: [User!]!
    posts: [Post!]!
  }

  type Mutation {
    signUp(email: String!, password: String!): String
    createPost(title: String!, content: String!): Post
  }
`;
