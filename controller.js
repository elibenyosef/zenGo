import axios from 'axios'
import config from './config.js'

/**
 * Calculate the precentage difference between coins prices - from given past date and current date
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns String
 */
const getCoinsPriceDiff = async (req, res, next) => {
//   if (!req.query.coinType) {
//     return res.status(422).send('Please choose at least one coin, it is mandatory')
//   }
//   if (!req.query.date) {
//     return res.status(422).send('Please choose past date, it is mandatory')
//   }
//   const date = req.query.date ? moment(req.query.date, 'DD/MM/YYYY').toDate() : moment().toDate()

  // Fetch all coins data
  const coinsUrl = await urlBuilder(req.query.coinType, req.query.date)
  // Extract the relevant data
  const coinsData = await Promise.all(coinsUrl)
  // build the answer
  const ans = dataBuilder(coinsData)

  return res.send(ans)
}
/**
 *
 * @param {[String]} coinsArray
 * @param {Date} date
 * @returns Array that contains urls
 */
const urlBuilder = async (coinsArray, date) => {
  const timeQuery = Math.round(date.getTime() / 1000)
  // Build urls to get past prices
  const urlArray = coinsArray.map((coinType) => {
    return axios.get(`${config.baseUrl}pricehistorical?fsym=${coinType}&tsyms=USD&ts=${timeQuery}&api_key=${config.apiKey}`)
  })
  // Build url to get current prices
  urlArray.unshift(axios.get(`${config.baseUrl}pricemulti?fsyms=${coinsArray.join(',')}&tsyms=USD&api_key=${config.apiKey}`))
  return urlArray
}

/**
 * Calculate precentage change between two numbers
 * @param {Number} currentPrice
 * @param {Number} previousPrice
 * @returns Number
 */
const calculatePrecentageChange = (currentPrice, previousPrice) => {
  return Math.round((currentPrice - previousPrice) / previousPrice * 100)
}

/**
 * Takes promises array of coins data and process it to relevant data
 * First slot in the array is current price of all coins
 * Each of the rest slots represnts coins price at the a given past date
 * @param {Array} coinsRawDataArray
 */
const dataBuilder = (coinsRawDataArray) => {
  const coinsPriceChange = []
  let coinsNotLaunched = ''
  for (let i = 1; i < coinsRawDataArray.length; i++) {
    // Extract data from coin
    const coin = extractDataFromCoin(coinsRawDataArray, i)

    // Make sure the coin was launched
    if (coin.previousValue !== 0) {
      coinsPriceChange.push(
        { [coin.key]: calculatePrecentageChange(coin.currentValue, coin.previousValue) }
      )
    } else {
      coinsNotLaunched += `, ${coin.key}: wasn't launched on this time`
    }
  }

  // Sort coinsPriceChange in descending coins preformance
  coinsPriceChange.sort((a, b) => {
    return b[Object.keys(b)[0]] - a[Object.keys(a)[0]]
  })
  // build a string from coinsPriceChange array
  return precentageDiffStrBuilder(coinsPriceChange, coinsNotLaunched)
}

/**
 * Build the final answer string
 * @param {Array} coinsPriceChange
 * @param {String} coinsNotLaunchedStr
 */
const precentageDiffStrBuilder = (coinsPriceChange, coinsNotLaunchedStr) => {
  const coinsPriceChangeStr = coinsPriceChange.map((a) => {
    return `${Object.keys(a)[0]}: ${a[Object.keys(a)[0]]}%`
  }).join(', ')
  // make sure there is no extra comma
  const ans = coinsPriceChangeStr === ''
    ? coinsNotLaunchedStr.substr(2)
    : coinsPriceChangeStr + coinsNotLaunchedStr
  return ans
}

/**
 * Extract coin's data from the raw data array
 * @param {Array} coinsRawDataArray
 */
const extractDataFromCoin = (coinsRawDataArray, i) => {
  const key = Object.keys(coinsRawDataArray[i].data)[0]
  const previousValue = coinsRawDataArray[i].data[key].USD
  const currentValue = coinsRawDataArray[0].data[key].USD
  return { key, previousValue, currentValue }
}

const updateCoinsList = async (req, res, next) => {
  let coinsList = await axios.get(`${config.baseUrl}all/coinlist?api_key=${config.apiKey}`)
  coinsList = coinsList.data.Data
  const ans = Object.keys(coinsList).map(key => { return key })
  res.send(ans)
}

export { getCoinsPriceDiff, updateCoinsList }
