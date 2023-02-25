import graphql from "graphql"
const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = graphql

// The skills output
export const skillType = new GraphQLObjectType({
  name: "skill",
  type: "Query",
  fields: {
    name: { type: GraphQLString },
    rating: { type: GraphQLInt }
  }
})

// The skill frequency output
export const skillFreq = new GraphQLObjectType({
  name: "skillFreq",
  type: "Query",
  fields: {
    name: { type: GraphQLString },
    frequency: { type: GraphQLInt }
  }
})

// The user output
export const userType = new GraphQLObjectType({
  name: "user",
  type: "Query",
  fields: {
    name: { type: GraphQLString },
    picture: { type: GraphQLString },
    company: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    skills: {
      type: new GraphQLList(skillType)
    }
  }
})

// Consider using fragments due to duplicate code.
// Not sure if I have to use another type, but it's good in case we need to extend
export const usersType = new GraphQLObjectType({
  name: "users",
  type: "Query",
  fields: {
    name: { type: GraphQLString },
    picture: { type: GraphQLString },
    company: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    skills: {
      type: new GraphQLList(skillType)
    }
  }
})
