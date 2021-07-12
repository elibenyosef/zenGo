import express from 'express'
import { getCoinsPriceDiffSchema, validate } from './validator.js'
import { getCoinsPriceDiff, updateCoinsList } from './controller.js'
import { checkSchema } from 'express-validator'
const router = express.Router()

router.get('/', function (req, res) {
  res.send('Welcome To ZenGo!')
})
// Get coins price change
router.get('/coin', validate(checkSchema(getCoinsPriceDiffSchema)), getCoinsPriceDiff)

router.get('/updateCoinsList', updateCoinsList)

// module.exports = router;
export { router }
