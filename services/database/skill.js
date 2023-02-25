import { db } from '../../database/pgAdaptor.js'
// Assigns skill to user based on id
export const addSkill = async (skill, id) => {
  const createdSkill = await checkSkill(skill.name)
  // Checks if skill has been created
  // If not, then create the skill
  if (!createdSkill) {
    const query = `INSERT INTO skills (name) VALUES($1)`
    const values = [skill.name]
    await db.none(query, values)
      .then(async function () {
        // Connect the skill to user in the userstoskill table
        const skillID = await getskillID(skill.name)
        const query = `INSERT INTO usertoskill (id, skill_id, rating) VALUES($1,$2,$3)`
        const values = [id, skillID, skill.rating]
        await db.none(query, values)
          .then(res => res)
          .catch(err => console.log(err))
      })
  } else {
    // Connects the skill to user in the usertoskill table
    // Next time, turn this portion into its own function
    const skillID = await getskillID(skill.name)
    const query = `INSERT INTO usertoskill (id, skill_id, rating) VALUES($1,$2,$3)`
    const values = [id, skillID, skill.rating]
    await db.none(query, values)
      .then(res => res)
      .catch(err => console.log(err))
  }
}

// Gets the skill_id of the skill name
export const getskillID = async (name) => {
  const query = `SELECT skill_id FROM skills WHERE name=$1`
  const values = [name]
  return db.one(query, values)
    .then(res => res.skill_id)
    .catch(err => console.log(err))
}

// Returns true or false based on whether the skill is in the database
export const checkSkill = async (name) => {
  const query = `SELECT EXISTS(SELECT name from skills where name=$1)`
  const values = [name]
  return db.one(query, values)
    .then(res => res.exists)
    .catch(err => console.log(err))
}

// Deletes the skill
export const deleteSkill = async (skill, id) => {
  const createdSkill = await checkSkill(skill.name)
  if (createdSkill) {
    const skillId = await getskillID(skill.name)
    const query = `DELETE FROM usertoskill WHERE skill_id=$1 AND id=$2`
    const values = [skillId, id]
    await db.none(query, values)
      .then(res => res)
      .catch(err => console.log(err))
  }
}

// Update skills of user
export const updateSkills = async (updated, id) => {
  const currentskills = await getSkills(id)

  // Remove all the users skills
  for (let i = 0; i < currentskills.length; i++) {
    await deleteSkill(currentskills[i], id)
  }

  // Readd all the users skills with updated values
  for (let i = 0; i < updated.length; i++) {
    await addSkill(updated[i], id)
  }
}

// Get the skills based on id
export const getSkills = async (id) => {
  const query = `SELECT s.name, u.rating FROM usertoskill u JOIN skills s ON u.skill_id = s.skill_id WHERE u.id = $1 ORDER BY s.name`
  const values = [id]
  return db.manyOrNone(query, values)
    .then(res => res)
    .catch(err => console.log(err))
}

// Get skills based on frequency

export const getSkillsFreq = async (minFrequency, maxFrequency) => {
  let values = []
  // Basic Query statement for getting name and frequencies of skills
  let query = `SELECT s.name, COUNT(*) AS frequency FROM usertoskill u JOIN skills s ON s.skill_id = u.skill_id GROUP BY s.name `
  // Logic for partial arguments
  if (minFrequency == null && maxFrequency == null) {
    query += `ORDER BY COUNT(*)`
  } else if (minFrequency == null) {
    query += `HAVING COUNT(*) <=$1 ORDER BY COUNT(*)`
    values = [maxFrequency]
  } else if (maxFrequency == null) {
    query += `HAVING COUNT(*) >=$1 ORDER BY COUNT(*)`
    values = [minFrequency]
  } else {
    query += `HAVING COUNT(*) >=$1 AND COUNT(*) <=$2 ORDER BY COUNT(*)`
    values = [minFrequency, maxFrequency]
  }
  // Sent the query and return
  return db
    .manyOrNone(query, values)
    .then(res => res)
}
