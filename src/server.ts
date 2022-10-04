import express, { Express } from 'express'
import mongoose from 'mongoose';
import { dbUrl } from './config/db.config'

import userRoutes from './routes/user'
import eventRoutes from './routes/event'

const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)

const options = { useNewUrlParser: true, useUnifiedTopology: true }
const PORT: string | number = process.env.PORT || 8080

mongoose.set('useFindAndModify', false)

mongoose.connect(dbUrl, options)
.then(() => {
  console.log('Connected to the database!')
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
  })
})
.catch(err => {
  console.log('Cannot connect to the database!', err)
  process.exit()
})
