import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "@/graphql/schema"; // Your GraphQL schema (type definitions)
import { resolvers } from "@/graphql/resolvers"; // Your GraphQL resolvers
import { createContext } from "@/graphql/context";

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server in standalone mode
async function startApolloServer() {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => createContext({ req }),
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}
startApolloServer();
