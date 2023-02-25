import { db } from '../../database/pgAdaptor.js'
import { partialUpdate, getID } from './helper.js'
import { addSkill, getSkills } from './skill.js'
// Returns true or false based on whether user is in database
export const checkUser = async (email) => {
  const query = `SELECT EXISTS(SELECT email from users where email=$1)`
  const values = [email]
  return db.one(query, values)
    .then(res => res.exists)
    .catch(err => console.log(err))
}

// Update the user's info EXCEPT skills
export const updateUser = async (args) => {
  const value = partialUpdate(args)
  if (value[0].length > 1) {
    const query = `UPDATE users SET(${value[1]}) = (${value[2]}) WHERE email='${args.email}'`
    const values = value[0]
    await db
      .none(query, values)
      .then(res => res)
      .catch(err => console.log(err))
  }
}

export const getUsers = async () => {
  const query = `SELECT * FROM users`
  return db
    .manyOrNone(query) // Could return values or no values since the query may be empty
    .then(async (res) => {
      // Get skills of users
      for (let i = 0; i < res.length; i++) {
        const id = await getID(res[i].email)
        res[i].skills = await getSkills(id) // Set the skills of the particular user
      }
      return res
    })
    .catch(err => err)
}

export const getUser = async (email) => {
  const query = `SELECT * FROM users WHERE email=$1`
  const values = [email]
  return db
    .one(query, values)
    .then(async (res) => {
      const id = await getID(email)
      // Set the response's skills to the skills of the user
      res.skills = await getSkills(id)
      return res
    })
    .catch(err => console.log(err))
}

export const addUser = async (args) => {
  const createdUser = await checkUser(args.email)
  if (createdUser) {
    throw new Error('User email is in use')
  }
  // Partial updating values
  const value = partialUpdate(args)
  const query = `INSERT INTO users (${value[1]}) VALUES(${value[2]})`
  const values = value[0]

  const email = args.email
  const skills = args.skills

  return db
    .none(query, values) // We aren't expecting anything back from the mutation
    .then(async function () {
      // Adding skills of the user
      const id = await getID(email)
      for (let i = 0; i < skills.length; i++) {
        await addSkill(skills[i], id)
      }
    })
    .catch(err => console.log(err))
}

export const addUsers = async (userList) => {
  for (let i = 0; i < userList.length; i++) {
    await addUser(userList[i])
  }
}
