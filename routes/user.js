import express from 'express'
import { db } from "../database/pgAdaptor.js"
import { getID, addSkill } from '../services/database.js'
import request from '../database/loader.json'
const router = express.Router()

// Post Request
router.post('/', async (req, res, next) => {
  // Iterate through the list of users to be added
  for (const data in request) {
    const info = request[data]
    const query = `INSERT INTO users (name,email,phone,company,picture) VALUES($1,$2,$3,$4,$5)`
    const values = [info.name, info.email, info.phone, info.company, info.picture]
    // Insert into the database
    await db
      .none(query, values)
      .then(async function () {
        // Insert skills of the user
        const skills = info.skills
        const id = await getID(info.email)
        for (let i = 0; i < skills.length; i++) {
          await addSkill(skills[i], id)
        }
        res.status(201).json({
          message: "Users successfully added!"
        })
      })
      .catch(err => console.log(err))
  }
})

export default router
