import express from 'express'
import { router } from './routes.js'
const app = express()
const port = 8000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', router)

app.listen(port, () => {
  console.log(`ZenGo app listening on port ${port}!`)
})

// module.exports = app;
export default app
