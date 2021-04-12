const token = 'Tpk_219118a840804c0e83a9d0c7fbc7e1bc'             // need to update these for the real app
const baseURL = 'https://sandbox.iexapis.com/stable/stock'       // need to update these for the real app

class Stock {
  constructor(stockTicker, purchaseDate, pricePerShare, numOfShares) {
    this.stockTicker = stockTicker
    this.purchaseDate = purchaseDate
    this.pricePerShare = pricePerShare
    this.numOfShares = numOfShares
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
    this.purchasedStocks.push(purchasedStock)
    this.stockTickers.push(purchasedStock.stockTicker)
    this.sharesPerStock[purchasedStock.stockTicker] = purchasedStock.numOfShares
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
document.getElementById('getHistoricalDayPrice').addEventListener('click', getHistorricalDayPrice)

async function getHistorricalDayPrice() {
  let stockTicker  = document.getElementById('stockTicker').value
  let historicalDate  = document.getElementById('historicalDate').value
  
  console.log(`stockTicker: ${stockTicker}`)
  console.log(`historicalDate: ${historicalDate}`)
  
  let url = `${baseURL}/${stockTicker}/chart/3m?filter=symbol,date,close&token=${token}`
  
  fetch(url)
  .then(result => result.json())
  .then(dailyData => {
    console.log(`dailyData: ${dailyData}`)
    for (let dayData of dailyData) {
      if (dayData.date === historicalDate) {
        let historicalDayPrice = dayData.close
        console.log(`historicalDayPrice: ${historicalDayPrice}`)
        document.getElementById('historicalDayPrice').value = historicalDayPrice
        break
      }
    }
  })
  .catch(err => {
    console.log('something went wrong', err)
  })
}


// ===== Phase Two: Purchase Stock ===== //
document.getElementById('buyButton').addEventListener('click', makePurchase)

function makePurchase(){
  let stockTicker = document.getElementById('stockTicker').value.toUpperCase()
  let purchaseDate = document.getElementById('historicalDate').value
  let pricePerShare = document.getElementById('historicalDayPrice').value
  let numOfShares = document.getElementById('sharesToBuy').value
  let totalPurchasePrice = pricePerShare * numOfShares
  
  console.log(`stockTicker: ${stockTicker}`)
  console.log(`purchaseDate: ${purchaseDate}`)
  console.log(`pricePerShare: ${pricePerShare}`)
  console.log(`numOfShares: ${numOfShares}`)
  console.log(`totalPurchasePrice: ${totalPurchasePrice}`)
  
  let purchasedStock = new Stock(stockTicker, purchaseDate, pricePerShare, numOfShares)

  if (numOfShares === 0) {
    alert (`MUST buy at least 1 share`)
  }

  if (totalPurchasePrice < portfolio.buyingPower) {
    portfolio.addStock(purchasedStock)
    portfolio.buyingPower -= totalPurchasePrice
  } else {
    alert(`NOT Enough Buying Power\nNeed additional ${totalPurchasePrice-portfolio.buyingPower}`)
  }
}


// ===== Phase Three: Update Portfolio ===== //
document.getElementById('updatePortfolioValue').addEventListener('click', updatePortfolioValue)

async function updatePortfolioValue() {
  let stockTickers = portfolio.getStockTickers()
  let url = `${baseURL}/market/batch?symbols=${stockTickers.join()}&types=quote&token=${token}`
  
  fetch(url)
  .then(result => result.json())
  .then(stockQuotes => {
    console.log(stockQuotes)
    
    let portfolioValue = 0
    for (let stockTicker of stockTickers) {
      portfolioValue += stockQuotes[stockTicker]["quote"]["latestPrice"] * portfolio.getSharesPerStock(stockTicker)
    }
    portfolioValue += portfolio.buyingPower
    console.log(`portfolioValue: ${portfolioValue}`)

    document.getElementById('portfolioValue').innerText = portfolioValue
  })
  .catch(err => {
    console.log('something went wrong', err)
  })
}


// ===== Phase Four: Render Portfolio List On-Screen ===== //
// Move this into the updatePortfolio  Function
document.getElementById('updatePurchasedStocksList').addEventListener('click', updatePurchasedStocksList)

function updatePurchasedStocksList(){
  let ulTag = document.getElementById('purchasedStocksList')
  let stockTickers = portfolio.getStockTickers()
  
  for (let stockTicker of stockTickers) {
    let newLi = document.createElement('li')
    newLi.innerText = stockTicker
    ulTag.appendChild(newLi)
  }
}