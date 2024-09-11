import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema"; // Your GraphQL schema (type definitions)
import { resolvers } from "./resolvers"; // Your GraphQL resolvers
import { createContext } from "./context"; // Custom context

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo server in standalone mode
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => createContext({ req }), // Use your custom context function
    listen: { port: 4000 }, // You can specify any port
  });

  console.log(`🚀 Server ready at ${url}`);
};

startServer();
