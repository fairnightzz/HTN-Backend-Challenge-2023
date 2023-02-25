import graphql from "graphql"
import { usersType, userType, skillFreq } from "./types.js"
import { getUsers, getUser, getSkillsFreq } from "../services/database/index.js"
const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLID } = graphql

// Begin Query
export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  type: "Query",
  fields: {
    // Query for getting all users
    users: {
      // What the client wants
      type: new GraphQLList(usersType),
      // Resolver
      resolve: async () => {
        // Take all users.
        return getUsers()
      }
    },
    // Query for getting a specific user
    user: {
      type: userType,
      // We only need email to identify the user
      args: { email: { type: GraphQLID } },
      // Resolver
      resolve: (parentValue, args) => {
        return getUser(args.email)
      }
    },
    // Query for getting skills with parameter
    skills: {
      type: new GraphQLList(skillFreq),
      // Arguments for frequencies
      args: {
        min_frequency: { type: GraphQLInt },
        max_frequency: { type: GraphQLInt }
      },
      // Resolver
      resolve: async (parentValue, args) => {
        const minFrequency = args.min_frequency
        const maxFrequency = args.max_frequency
        return getSkillsFreq(minFrequency, maxFrequency)
      }
    }
  }
})
