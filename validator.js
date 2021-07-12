import config from './config.js'
import moment from 'moment'
import { validationResult } from 'express-validator'

const getCoinsPriceDiffSchema = {
  coinType: {
    in: ['query'],
    customSanitizer: {
      options: (value, { req, location, path }) => {
        const sanitizedCoins = value.split(',')
        sanitizedCoins.forEach((coin, index) => {
          sanitizedCoins[index] = coin.trim()
        })
        return sanitizedCoins
      }
    },
    custom: {
      options: (coinsArray) => {
        const coinList = config.approvedCoins
        coinsArray.forEach(coin => {
          // Make sure input coin is in the coins list
          if (!coinList.includes(coin)) {
            throw new Error('One or more coins are invaild')
            // return false
          }
        })
        return true
      }
    }
  },
  date: {
    in: ['query'],
    notEmpty: true,
    // isDate: true,
    isBefore: new Date(),
    errorMessage: 'date param is wrong or empty',
    customSanitizer: {
      options: (value, { req, location, path }) => {
        const sanitizedDate = moment(value, 'DD/MM/YYYY').toDate()
        return sanitizedDate
      }
    }
  }

}

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({
      errors: errors.array()
    })
  }
}

export { getCoinsPriceDiffSchema, validate }
