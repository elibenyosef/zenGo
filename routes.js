import express from 'express'
import { getCoinsPriceDiffSchema, validate } from './validator.js'
import { welcomePage, getCoinsPriceDiff, updateCoinsList } from './controller.js'
import { checkSchema } from 'express-validator'
const router = express.Router()

router.get('/', welcomePage)
// Get coins price change
router.get('/coinsDiff', validate(checkSchema(getCoinsPriceDiffSchema)), getCoinsPriceDiff)
// Get approved coins list
router.get('/updateCoinsList', updateCoinsList)

// module.exports = router;
export { router }
