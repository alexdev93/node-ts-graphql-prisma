import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import bodyParser from "body-parser";
import cors from "cors";
import { createContext } from "./context"; // Import your custom context

const app = express();

// CORS and Body parsing middleware
app.use(cors());
app.use(bodyParser.json());

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  // Use Express middleware for Apollo Server with full context (including Prisma and JWT)
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Use the custom context function you defined earlier
        return createContext({ req });
      },
    })
  );
};

startServer().then(() => {
  app.listen(4000, () => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  });
});
