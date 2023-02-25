import express from 'express'

// For https requests
import cors from 'cors'

// For debugging
import morgan from 'morgan'

// GraphQL imports

import { graphqlHTTP } from 'express-graphql'
import { GraphQLSchema } from 'graphql'

// Query and Mutation Endpoints
import { RootQuery as query } from "./schemas/query.js"
import { mutation } from "./schemas/mutation.js"

// Express
const app = express()

// Using apis

app.use(morgan('combined'))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())
app.use(cors())

// Schemas
const schema = new GraphQLSchema({
  query,
  mutation
})

// Initalize graphql route
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: { headerEditorEnabled: true } // Visual playthrough
  })
)

// For setting up the database - DO NOT UNCOMMENT FOR DEPLOYMENT
// const userRoutes = require('./routes/user')
// app.use('/user', userRoutes)

export default app
