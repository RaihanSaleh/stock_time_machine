const token = 'Tpk_219118a840804c0e83a9d0c7fbc7e1bc'             // need to update these for the real app
const baseURL = 'https://sandbox.iexapis.com/stable/stock'       // need to update these for the real app
const usDollar = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

class Stock {
  constructor(stockTicker, purchaseDate, pricePerShare, numOfShares) {
    this.stockTicker = stockTicker
    this.purchaseDate = purchaseDate
    this.pricePerShare = pricePerShare
    this.numOfShares = numOfShares
  }
  getTotalPurchasedPrice () {
    return this.numOfShares * this.pricePerShare
  }
}

class Portfolio {
  constructor(){
    this.buyingPower = 100000
    this.purchasedStocks = []
    this.stockTickers = []
    this.sharesPerStock = {}
  }
  addStock(purchasedStock){
    if (purchasedStock.purchaseDate === "") {
      throw "FAILED TO BUY \nProvide date to receive historical stock quote"
    }
    if (purchasedStock.numOfShares <= 0) {
      throw "FAILED TO BUY\nMust buy at least 1 share"
    } 
    if (this.buyingPower < purchasedStock.getTotalPurchasedPrice()) {
      throw `FAILED TO BUY\nNot Enough Buying Power\nNeed additional ${(usDollar.format(purchasedStock.getTotalPurchasedPrice()-this.buyingPower))}`
    }
    if (purchasedStock.stockTicker === "DMX") {
      throw "X GON GIVE IT TO YA"
    }

    this.buyingPower -= purchasedStock.getTotalPurchasedPrice()
    this.purchasedStocks.push(purchasedStock)
    this.stockTickers.push(purchasedStock.stockTicker)
    this.sharesPerStock[purchasedStock.stockTicker] = purchasedStock.numOfShares
    document.getElementById('buyingPower').innerText = `Buying Power: ${usDollar.format(portfolio.buyingPower)}`
  }
  getPurchasedStocksArray(){
    return this.purchasedStocks
  }
  getStockTickers(){
    return this.stockTickers
  }
  getSharesPerStock(stockTicker){
    return this.sharesPerStock[stockTicker]
  }
}

let portfolio = new Portfolio()


// ===== Phase One: Get a price of a stock at a certain date ===== //
document.getElementById('getHistoricalDayPrice').addEventListener('click', getHistoricalDayPriceClickEvent)

async function getHistoricalDayPriceClickEvent(e) {
  if (document.getElementById('stockTicker').value.toUpperCase() === "DMX") {
    document.getElementById('historicalDayPrice').value = 0
    return alert('X GON GIVE IT TO YA')
  }
  getHistoricalDayPrice()
}

async function getHistoricalDayPrice(callback=false) {
  let historicalDayPrice
  let stockTicker = document.getElementById('stockTicker').value.toUpperCase()
  let historicalDate = document.getElementById('historicalDate').value
  let todaysDate = new Date()
  let historicalDateDateFormat = new Date(historicalDate)
  let numOfDays = todaysDate - historicalDateDateFormat
  numOfDays = Math.floor(numOfDays / (1000 * 3600 * 24))

  let url = `${baseURL}/${stockTicker}/chart/${numOfDays}d?filter=date,close&token=${token}`
  
  console.log(`stockTicker: ${stockTicker}`)
  console.log(`historicalDate: ${historicalDate}`)
  
  fetch(url)
  .then(result => result.json())
  .then(dailyData => {
    for (let dayData of dailyData) {
      if (dayData.date === historicalDate) {
        historicalDayPrice = dayData.close
        console.log(`historicalDayPrice: ${historicalDayPrice}`)
        document.getElementById('historicalDayPrice').value = historicalDayPrice
        break
      }
    }
    if (callback) {
      callback()
    }
  })
  .catch(err => {
    console.log('something went wrong', err)
  })
}


// ===== Phase Two: Purchase Stock ===== //
document.getElementById('buyButton').addEventListener('click', makePurchase)

async function makePurchase(){
  let callback = function() {
    let stockTicker = document.getElementById('stockTicker').value.toUpperCase()
    let purchaseDate = document.getElementById('historicalDate').value
    let pricePerShare = document.getElementById('historicalDayPrice').value
    let numOfShares = document.getElementById('sharesToBuy').value
    
    let purchasedStock = new Stock(stockTicker, purchaseDate, pricePerShare, numOfShares)
    console.log(purchasedStock)
    
    try {
      portfolio.addStock(purchasedStock)
    }
    catch(error) {
      alert(error)
    }
  }

  await getHistoricalDayPrice(callback)
}


// ===== Phase Three: Update Portfolio ===== //
document.getElementById('updatePortfolioValue').addEventListener('click', updatePortfolioValue)

async function updatePortfolioValue() {
  let stockTickers = portfolio.getStockTickers()
  let url = `${baseURL}/market/batch?symbols=${stockTickers.join()}&types=quote&token=${token}`
  
  fetch(url)
  .then(result => result.json())
  .then(stockQuotes => {
    let portfolioValue = 0
    for (let stockTicker of stockTickers) {
      portfolioValue += stockQuotes[stockTicker]["quote"]["latestPrice"] * portfolio.getSharesPerStock(stockTicker)
    }
    portfolioValue += portfolio.buyingPower
    console.log(`portfolioValue: ${portfolioValue}`)

    document.getElementById('portfolioValue').innerText = usDollar.format(portfolioValue)
    document.getElementById('buyingPower').innerText = `Buying Power: ${usDollar.format(portfolio.buyingPower)}`

  })
  .catch(err => {
    console.log('something went wrong', err)
  })
}


// ===== Phase Four: Render Portfolio List On-Screen ===== //
// can be part of the buy stock function
document.getElementById('updatePurchasedStocksList').addEventListener('click', updatePurchasedStocksList)

function updatePurchasedStocksList(){
  let ulTag = document.getElementById('purchasedStocksList')
  let stockTickers = portfolio.getStockTickers()
  ulTag.innerHTML = ""
  
  for (let stockTicker of stockTickers) {
    let newLi = document.createElement('li')
    newLi.innerText = stockTicker
    ulTag.appendChild(newLi)
  }
}


// ===== Phase Five: Create the Portfolio Chart ===== //


// ===== Phase Six: Create Stock Chart and display when get price is clicked ===== //