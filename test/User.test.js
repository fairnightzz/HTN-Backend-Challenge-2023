// import { userType } from '../schemas/types.js'

// const chai = require('chai')

// const expect = chai.expect
import supertest from 'supertest'
const url = `http://localhost:8080`
const request = supertest(url)

describe('User Call', () => {
  // Tests
  it('Call user with elizawright@slambda.com', (done) => {
    request.get('/graphql')
      .send({ query: '{user(email: "elizawright@slambda.com"){email}}' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })
})
