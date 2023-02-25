import { db } from '../../database/pgAdaptor.js'

// Gets the id of the user based on email
export const getID = async (email) => {
  const query = `SELECT id FROM users WHERE email=$1`
  const values = [email]
  return db.one(query, values)
    .then(res => res.id)
    .catch(err => console.log(err))
}

// Partial Updating the arguments
export const partialUpdate = (args) => {
  const values = []
  const columns = []
  const stringmanip = []
  let counter = 1
  // Takes all the arguments and formats it for the query
  for (const i in args) {
    if (args[i] != null && i !== 'skills') {
      values.push(args[i])
      columns.push(i)
      // For passing in variables to the pg promise
      stringmanip.push('$' + counter.toString())
      counter += 1
    }
  }
  const columnsplit = columns.toString()
  const stringsplit = stringmanip.toString()
  // Values is the actual variable values, column split is the name of columns in the query, and stringsplit is the variables syntax
  // e.g values = ['Zhehai', 'zhehai@zhehaizhang.com', 'Fairnight']
  // columnsplit = 'name, email, company'
  // stringsplit = '$1,$2,$3'
  return [values, columnsplit, stringsplit]
}
