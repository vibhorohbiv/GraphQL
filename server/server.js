import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [
  { id: "1", name: "Alice", age: 30, isMarried: false },
  { id: "2", name: "Bob", age: 25, isMarried: true },
  { id: "3", name: "Charlie", age: 35, isMarried: false },
];

const typeDefs = `
    type Query {
        getUsers:[User]
        getUserById(id: ID!):User
    }

    type Mutation {
        createUser(name: String!, age: Int!, isMarried:Boolean!): User
    }

    type User {
        id: ID
        name: String
        age: Int
        isMarried: Boolean 
    }
`;
const resolvers = {
  Query: {
    getUsers: () => {
      return users;
    },
    getUserById: (parent, args) => {
      // parents allows to Query from other resolvers, args allows to get arguments from the query
      const id = args.id;
      return users.find((user) => user.id === id);
    },
  },
  Mutation: {
    createUser: (parent, args) => {
      const { name, age, isMarried } = args;

      const newUser = {
        id: String(users.length + 1),
        name,
        age,
        isMarried,
      };

      users.push(newUser);

      return newUser;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const {} = await startStandaloneServer(server, { port: 4000 });

console.log(`Server running at http://localhost:4000/`);
