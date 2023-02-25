import graphql from "graphql"
import { userType } from "./types.js"
import { getID, addUser, updateSkills, addUsers, checkUser, updateUser, getUser } from "../services/database/index.js"
const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLInputObjectType } = graphql

// Types for Input because Object Types aren't acceptable
const skillInput = new GraphQLInputObjectType({
  name: "skillinput",
  type: "Input",
  fields: {
    name: { type: GraphQLString },
    rating: { type: GraphQLInt }
  }
})

const userInput = new GraphQLInputObjectType({
  name: "userInput",
  type: "Input",
  fields: {
    name: { type: GraphQLString },
    picture: { type: GraphQLString },
    company: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    skills: {
      type: new GraphQLList(skillInput)
    }
  }
})

// Mutation Endpoints
const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  type: "Mutation",
  fields: {
    // addUser endpoint
    addUser: {
      type: userType,
      // Mutation Arguments
      args: {
        name: { type: GraphQLString },
        picture: { type: GraphQLString },
        company: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        skills: {
          type: new GraphQLList(skillInput)
        }
      },
      // Resolver
      resolve: async (parentValue, args) => {
        await addUser(args)
        return args
      }
    },
    // addUsers endpoint
    addUsers: {
      type: GraphQLString,
      // Mutation Arguments
      args: {
        users: { type: new GraphQLList(userInput) }
      },
      // Resolver
      resolve: async (parentValue, args) => {
        await addUsers(args.users)
        return args
      }
    },
    // updateUser endpoint
    updateUser: {
      type: userType,
      // Mutation arguments
      args: {
        name: { type: GraphQLString },
        picture: { type: GraphQLString },
        company: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        skills: {
          type: new GraphQLList(skillInput)
        }
      },
      // Resolver
      resolve: async (parentValue, args) => {
        const createdUser = await checkUser(args.email)
        // Checks if user exists
        if (createdUser === true) {
          await updateUser(args)
          // Updating skills
          const skills = args.skills
          // Checks if skills was provided
          if (args.skills != null) {
            // Pass in id of user to get skills
            const id = await getID(args.email)
            await updateSkills(skills, id)
          }
          // We need to return the updated user info.
          return getUser(args.email)
        } else {
          throw new Error('User email does not exist')
        }
      }
    }
  }
})

export const mutation = RootMutation
